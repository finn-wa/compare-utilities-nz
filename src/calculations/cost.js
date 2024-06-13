import { Temporal } from "temporal-polyfill";
import { ElectricityPlans, GasPlans, InternetPlans } from "../plans/index.js";
import { needsBundle, pp, requireNonEmpty } from "../plans/utils.js";

/**
 * @typedef UsageEntry
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate the start time
 * @property {number} usage usage in kwH
 */
/** @typedef {('hourly'|'daily'|'monthly')} IntervalType */
/**
 * @typedef UsageDetails
 * @type {object}
 * @property {IntervalType} intervalType the period of time between usage entries
 * @property {UsageEntry[]} usage usage in chronological order
 /**
 * @typedef GasUsage
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate
 * @property {Temporal.ZonedDateTime} endDate
 * @property {number} usage usage in kwH
 */

/**
 * Returns the rate with the lowest millicent value.
 * @param {import("../plans/types.js").Rate[]} rates a non-empty array of rates
 * @returns {import("../plans/types.js").Rate} the best rate
 */
function getBestRate(rates) {
  if (rates.length === 1) {
    return rates[0];
  }
  /** @type {(import("../plans/types.js").Rate | null)} */
  let bestRate = null;
  for (const rate of rates) {
    if (bestRate === null || rate.millicents < bestRate.millicents) {
      bestRate = rate;
    }
  }
  if (bestRate === null) {
    throw new Error("Received an empty array of rates!");
  }
  return bestRate;
}

/**
 * @param {import("../plans/types.js").ElectricityPlan} plan
 * @param {UsageEntry} entry
 * @returns {number} cost in millicents
 */
export function calculateHourlyUsageEntryCost(entry, plan) {
  const { dayOfWeek, hour } = entry.startDate;
  const applicableRates = plan.rates.filter((rate) => {
    /** @type {number[]} */
    const days = rate.days;
    return (
      days.includes(dayOfWeek) &&
      rate.hours.some(({ start, end }) => start <= hour && hour < end)
    );
  });
  // Make sure that there aren't any overlapping non-special rates
  const nonSpecialRates = applicableRates.filter((rate) => !rate.special);
  if (nonSpecialRates.length !== 1) {
    let errorMsg = `(Plan: ${plan.id}) There must only be one applicable rate, but ${nonSpecialRates.length} were found for entry with start date ${entry.startDate}`;
    if (nonSpecialRates.length > 1) {
      const rateNames = nonSpecialRates
        .map((rate) => rate.name ?? "unnamed")
        .join(", ");
      errorMsg += `: (${rateNames})`;
    }
    throw new Error(errorMsg);
  }
  const bestRate = getBestRate(applicableRates);
  const variableCost = Math.round(bestRate.millicents * entry.usage);
  const fixedCost = plan.dailyMillicents / entry.startDate.hoursInDay;
  return variableCost + fixedCost;
}

/**
 * Returns the number of days covered by the usage entries.
 *
 * @param {IntervalType} intervalType
 * @param {UsageEntry[]} usage entries in chronological order
 */
function getTotalDays(intervalType, usage) {
  const startDate = usage.at(0)?.startDate;
  const endDate = usage.at(-1)?.startDate;
  if (startDate == null || endDate == null) {
    throw new Error("At least one usage entry is required");
  }
  /** @type {Temporal.Duration} */
  let intervalDuration;
  if (intervalType === "hourly") {
    intervalDuration = Temporal.Duration.from({ hours: 1 });
  } else if (intervalType === "daily") {
    intervalDuration = Temporal.Duration.from({ days: 1 });
  } else if (intervalType === "monthly") {
    intervalDuration = Temporal.Duration.from({ months: 1 });
  } else {
    throw new Error(`Unsupported intervalType: "${intervalType}"`);
  }
  return startDate.until(endDate).add(intervalDuration).total("days");
}

/**
 * @param {UsageDetails} usageDetails
 * @param {import("../plans/types.js").ElectricityPlan} plan
 * @param {boolean} hypothetically use usageFraction on rates if present
 * @returns {number} cost in millicents
 */
export function calculateElectricityPlanCost(
  { intervalType, usage },
  plan,
  hypothetically = false
) {
  if (hypothetically && plan.rates.some((rate) => rate.usageFraction != null)) {
    const totalUsage = usage.reduce((acc, entry) => acc + entry.usage, 0);
    const variableCost = plan.rates.reduce((acc, rate) => {
      if (rate.usageFraction == null) {
        throw new Error("Undefined usageFraction for rate: " + pp(rate));
      }
      return Math.round(
        acc + totalUsage * rate.usageFraction * rate.millicents
      );
    }, 0);
    const fixedCost = getTotalDays(intervalType, usage) * plan.dailyMillicents;
    return Math.round(fixedCost + variableCost);
  }
  if (intervalType !== "hourly") {
    throw new Error(
      `Unsupported intervalType: "${intervalType}" (must be "hourly")`
    );
  }
  const cost = usage.reduce(
    (acc, entry) => acc + calculateHourlyUsageEntryCost(entry, plan),
    0
  );
  return cost;
}

/**
 * @param {GasUsage} gasUsage
 * @param {import("../plans/types.js").PipedGasPlan} plan
 */
export function calculateGasPlanCost(gasUsage, plan) {
  const days = gasUsage.endDate.since(gasUsage.startDate).total("days");
  return Math.round(
    gasUsage.usage * plan.kwhMillicents + days * plan.dailyMillicents
  );
}

/**
  @typedef {{
    electricity: UsageDetails,
    gas: GasUsage,
  }} UtilityUsage 
*/

/**
 * @param {UtilityUsage} usage
 */
export function comparePlansIndividually(usage) {
  let plansByType = {};
  const electricityUsage = usage.electricity;
  if (electricityUsage != null) {
    plansByType.electricity = ElectricityPlans.map((plan) => ({
      plan,
      cost: calculateElectricityPlanCost(electricityUsage, plan, true),
    })).sort((a, b) => a.cost - b.cost);
  }
  const gasUsage = usage.gas;
  if (gasUsage) {
    plansByType.gas = GasPlans.map((plan) => ({
      plan,
      cost: calculateGasPlanCost(gasUsage, plan),
    })).sort((a, b) => a.cost - b.cost);
  }
  plansByType.internet = InternetPlans.sort(
    (a, b) => a.monthlyMillicents - b.monthlyMillicents
  );
  return plansByType;
}

/**
 * @typedef PlanOptions
 * @type {object}
 * @property {import("../plans/types.js").ElectricityPlan[]} [electricity]
 * @property {import("../plans/types.js").PipedGasPlan[]} [gas]
 * @property {import("../plans/types.js").InternetPlan[]} [internet]
 */
/**
 * @typedef PlanSelection
 * @type {object}
 * @property {string} name
 * @property {{plan: import("../plans/types.js").ElectricityPlan, cost: number}} electricity
 * @property {{plan: import("../plans/types.js").PipedGasPlan, cost: number}} gas
 * @property {{plan: import("../plans/types.js").InternetPlan, cost: number}} internet
 * @property {number} total total cost
 */

/**
 * @param {string} name
 * @param {Required<PlanOptions>} plans
 * @param {UtilityUsage} usage
 * @returns {PlanSelection}
 */
function selectBestPlan(name, plans, usage) {
  if (
    plans.electricity.length === 0 ||
    plans.gas.length === 0 ||
    plans.internet.length === 0
  ) {
    throw new Error("No options for some utilities: " + pp(plans));
  }

  const bestElectricityPlan = plans.electricity
    .map((plan) => ({
      plan,
      cost: calculateElectricityPlanCost(usage.electricity, plan, true),
    }))
    .reduce((min, curr) => (curr.cost < min.cost ? curr : min), {
      cost: Number.MAX_SAFE_INTEGER,
      plan: plans.electricity[0],
    });

  const bestGasPlan = plans.gas
    .map((plan) => ({
      plan,
      cost: calculateGasPlanCost(usage.gas, plan),
    }))
    .reduce((min, curr) => (curr.cost < min.cost ? curr : min), {
      cost: Number.MAX_SAFE_INTEGER,
      plan: plans.gas[0],
    });

  const bestInternetPlan = plans.internet.reduce(
    (min, curr) =>
      curr.monthlyMillicents < min.monthlyMillicents ? curr : min,
    plans.internet[0]
  );
  return {
    name,
    electricity: bestElectricityPlan,
    gas: bestGasPlan,
    internet: {
      plan: bestInternetPlan,
      cost: bestInternetPlan.monthlyMillicents,
    },
    total:
      bestElectricityPlan.cost +
      bestGasPlan.cost +
      bestInternetPlan.monthlyMillicents,
  };
}

/**
 * @param {string} name
 * @param {PlanOptions} providerPlans
 * @param {Required<PlanOptions>} bestUnbundled
 * @param {UtilityUsage} usage
 * @returns {PlanSelection}
 */
function selectBestBundledPlan(name, providerPlans, bestUnbundled, usage) {
  const selectionsByPlan = Object.values(providerPlans)
    .flat()
    .filter((plan) => plan.bundle.length > 0)
    .map((plan) => {
      /** @type {PlanOptions} */
      let options = {
        [plan.type]: [plan],
      };
      if (plan.type !== "electricity" && plan.bundle.includes("electricity")) {
        options.electricity = requireNonEmpty(providerPlans.electricity);
      }
      if (plan.type !== "gas" && plan.bundle.includes("gas")) {
        options.gas = requireNonEmpty(providerPlans.gas);
      }
      if (plan.type !== "internet" && plan.bundle.includes("internet")) {
        options.internet = requireNonEmpty(providerPlans.internet);
      }
      return selectBestPlan(name, { ...bestUnbundled, ...options }, usage);
    });
  const bestBundledPlan = selectionsByPlan
    .map((selection) => ({
      ...selection,
      total:
        selection.electricity.cost +
        selection.gas.cost +
        selection.internet.cost,
    }))
    .reduce((min, curr) => (curr.total < min.total ? curr : min), {
      ...selectionsByPlan[0],
      total: Number.MAX_SAFE_INTEGER,
    });
  return bestBundledPlan;
}

/**
 * Returns true if at least one plan requires a bundle.
 * @param {PlanOptions} providerOptions
 * @returns {boolean}
 */
function hasBundlePlan(providerOptions) {
  return (
    providerOptions.electricity?.some((plan) => needsBundle(plan)) ||
    providerOptions.gas?.some((plan) => needsBundle(plan)) ||
    providerOptions.internet?.some((plan) => needsBundle(plan)) ||
    false
  );
}

/**
 *
 * @param {UtilityUsage} usage
 * @returns {PlanSelection[]}
 */
export function comparePlanCombinations(usage) {
  /** @type {Object.<string, PlanOptions>} */
  const planOptions = {};
  const getProviderOptions = (/** @type {string} */ provider) => {
    if (planOptions[provider] === undefined) {
      planOptions[provider] = {};
    }
    return planOptions[provider];
  };
  for (const plan of ElectricityPlans) {
    const options = getProviderOptions(plan.provider);
    options.electricity = (options.electricity ?? []).concat(plan);
  }
  for (const plan of GasPlans) {
    const options = getProviderOptions(plan.provider);
    options.gas = (options.gas ?? []).concat(plan);
  }
  for (const plan of InternetPlans) {
    const options = getProviderOptions(plan.provider);
    options.internet = (options.internet ?? []).concat(plan);
  }
  const unbundledPlans = {
    electricity: ElectricityPlans.filter((plan) => !needsBundle(plan)),
    gas: GasPlans.filter((plan) => !needsBundle(plan)),
    internet: InternetPlans.filter((plan) => !needsBundle(plan)),
  };
  const bestUnbundled = selectBestPlan("Unbundled", unbundledPlans, usage);
  // To fill in any gaps in bundles
  const backupPlans = {
    electricity: [bestUnbundled.electricity.plan],
    gas: [bestUnbundled.gas.plan],
    internet: [bestUnbundled.internet.plan],
  };
  /** @type {PlanSelection[]} */
  const planSelections = [bestUnbundled];
  for (const [provider, providerOptions] of Object.entries(planOptions)) {
    // Skip providers without bundles, they are represented in the Unbundled entry
    if (Object.keys(providerOptions).length === 1) {
      continue;
    }
    if (hasBundlePlan(providerOptions)) {
      planSelections.push(
        selectBestBundledPlan(provider, providerOptions, backupPlans, usage)
      );
    } else {
      planSelections.push(
        selectBestPlan(provider, { ...backupPlans, ...providerOptions }, usage)
      );
    }
  }
  return planSelections.sort((a, b) => a.total - b.total);
}
