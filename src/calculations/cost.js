import { Temporal } from "temporal-polyfill";
import { ElectricityPlans, GasPlans, InternetPlans } from "../plans/index.js";
import {
  daily,
  getRateForTime,
  needsBundle,
  pp,
  requireNonEmpty,
} from "../plans/utils.js";
import { calculateUsageDetails, getTotalDays } from "./usage.js";
/** @import { Plan, Rate, ElectricityPlan, PipedGasPlan, InternetPlan } from '../plans/types.js' */
/** @import { UsageEntry, UsageEntries, GasUsage, IntervalType, UsageDetails, PlanUsageCostBreakdown } from './types.js' */

/**
 * @param {UsageDetails} usageDetails
 * @param {ElectricityPlan} plan
 * @returns {PlanUsageCostBreakdown} cost & usage breakdown
 */
export function calculatePlanUsageCostBreakdown(usageDetails, plan) {
  const { variableCost, rateBreakdown } = getVariableCost(usageDetails, plan);
  const fixedCost = Math.round(usageDetails.totalDays * plan.dailyMillicents);
  const totalCost = fixedCost + variableCost;
  return {
    usageDetails,
    plan,
    totalCost,
    fixedCost,
    variableCost,
    rateBreakdown,
  };
}

/**
 *
 * @param {UsageDetails} usageDetails
 * @param {ElectricityPlan} plan
 * @returns {Pick<PlanUsageCostBreakdown, 'variableCost' | 'rateBreakdown'>}
 */
function getVariableCost(usageDetails, plan) {
  if (plan.rates.length === 1) {
    const rate = plan.rates[0];
    const cost = Math.round(usageDetails.totalUsage * rate.millicents);
    return {
      rateBreakdown: { [rate.name]: { usage: usageDetails.totalUsage, cost } },
      variableCost: cost,
    };
  }
  const rateUsage = Object.fromEntries(
    plan.rates.map((rate) => [rate.name, 0])
  );
  for (const day of daily) {
    for (let hour = 0; hour < 24; hour++) {
      const rate = getRateForTime(plan, day, hour);
      rateUsage[rate.name] += usageDetails.usageByHourOfWeek[day][hour];
    }
  }
  const rateBreakdown = Object.fromEntries(
    Object.entries(rateUsage).map(([rateName, usage]) => {
      // TODO: remove weekend/weekday rates as it has caused a bad bug here
      // where they were tallied twice. all rates should have an array of periods
      const rate = plan.rates.find((rate) => rate.name === rateName);
      if (rate == null) {
        throw new Error("typescript was right :O");
      }
      return [
        rateName,
        {
          usage,
          cost: Math.round(rate.millicents * usage),
        },
      ];
    })
  );
  const variableCost = Object.values(rateBreakdown).reduce(
    (acc, rate) => acc + rate.cost,
    0
  );
  return { rateBreakdown, variableCost };
}

/**
 * @param {GasUsage} gasUsage
 * @param {PipedGasPlan} plan
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
  if (usage.electricity != null) {
    plansByType.electricity = ElectricityPlans.map((plan) =>
      calculatePlanUsageCostBreakdown(usage.electricity, plan)
    ).sort((a, b) => a.totalCost - b.totalCost);
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
 * @property {ElectricityPlan[]} [electricity]
 * @property {PipedGasPlan[]} [gas]
 * @property {InternetPlan[]} [internet]
 */
/**
 * @typedef PlanSelection
 * @type {object}
 * @property {string} name
 * @property {{plan: ElectricityPlan, cost: PlanUsageCostBreakdown}} electricity
 * @property {{plan: PipedGasPlan, cost: number}} gas
 * @property {{plan: InternetPlan, cost: number}} internet
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
      cost: calculatePlanUsageCostBreakdown(usage.electricity, plan),
    }))
    .reduce((min, curr) =>
      curr.cost.totalCost < min.cost.totalCost ? curr : min
    );

  const bestGasPlan = plans.gas
    .map((plan) => ({
      plan,
      cost: calculateGasPlanCost(usage.gas, plan),
    }))
    .reduce((min, curr) => (curr.cost < min.cost ? curr : min));

  const bestInternetPlan = plans.internet.reduce((min, curr) =>
    curr.monthlyMillicents < min.monthlyMillicents ? curr : min
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
      bestElectricityPlan.cost.totalCost +
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
        selection.electricity.cost.totalCost +
        selection.gas.cost +
        selection.internet.cost,
    }))
    .reduce((min, curr) => (curr.total < min.total ? curr : min));
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
