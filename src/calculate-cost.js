import { getFrankElectricityUsage, getFrankGasUsage } from "./parse-data.js";
import { ElectricityPlans, GasPlans } from "./plans/index.js";
import { pp } from "./plans/utils.js";

/**
 * Returns the rate with the lowest millicent value.
 * @param {import("./plans/types.js").Rate[]} rates a non-empty array of rates
 * @returns {import("./plans/types.js").Rate} the best rate
 */
function getBestRate(rates) {
  if (rates.length === 1) {
    return rates[0];
  }
  /** @type {(import("./plans/types.js").Rate | null)} */
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
 * @param {import("./plans/types.js").ElectricityPlan} plan
 * @param {import("./parse-data.js").UsageEntry} entry
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
 * @param {import("./parse-data.js").UsageDetails} usageDetails
 * @param {import("./plans/types.js").ElectricityPlan} plan
 */
export function calculateElectricityPlanCost({ intervalType, usage }, plan) {
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
 * @param {import("./parse-data.js").GasUsage} gasUsage
 * @param {import("./plans/types.js").PipedGasPlan} plan
 */
export function calculateGasPlanCost(gasUsage, plan) {
  const days = gasUsage.endDate.since(gasUsage.startDate).total("days");
  return Math.round(
    gasUsage.usage * plan.kwhMillicents + days * plan.dailyMillicents
  );
}

/**
  @typedef {{
    electricity: import("./parse-data.js").UsageDetails,
    gas: import("./parse-data.js").GasUsage,
  }} UtilityUsage 
*/

/**
 * @param {UtilityUsage} usage
 */
export function comparePlansIndividually(usage) {
  const electricity = ElectricityPlans.map((plan) => ({
    plan,
    cost: calculateElectricityPlanCost(usage.electricity, plan),
  })).sort((a, b) => a.cost - b.cost);
  const gas = GasPlans.map((plan) => ({
    plan,
    cost: calculateGasPlanCost(usage.gas, plan),
  })).sort((a, b) => a.cost - b.cost);
  return { electricity, gas };
}

/**
 * @typedef PlanOptions
 * @type {object}
 * @property {import("./plans/types.js").ElectricityPlan[]} electricity
 * @property {import("./plans/types.js").PipedGasPlan[]} gas
 */
/**
 * @typedef PlanSelection
 * @type {object}
 * @property {{plan: import("./plans/types.js").ElectricityPlan, cost: number}} electricity
 * @property {{plan: import("./plans/types.js").PipedGasPlan, cost: number}} gas
 */

/**
 * @param {PlanOptions} plans
 * @param {UtilityUsage} usage
 * @returns {PlanSelection}
 */
function selectBestPlan(plans, usage) {
  if (plans.electricity.length === 0 || plans.gas.length === 0) {
    throw new Error("Missing plans: " + pp(plans));
  }
  const bestElectricityPlan = plans.electricity
    .map((plan) => ({
      plan,
      cost: calculateElectricityPlanCost(usage.electricity, plan),
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
  return {
    electricity: bestElectricityPlan,
    gas: bestGasPlan,
  };
}

/**
 @typedef {{    
    name: string;
      electricity: {
          plan: import("./plans/types.js").ElectricityPlan;
          cost: number;
      };
      gas: {
          plan: import("./plans/types.js").PipedGasPlan;
          cost: number;
      };
      total: number;
  }} PlanComparison
 */
/**
 *
 * @param {UtilityUsage} usage
 * @returns {PlanComparison[]}
 */
export function comparePlanCombinations(usage) {
  /** @type {Object.<string, PlanOptions>} */
  const planOptions = {};
  // This could be simplified if plans had a type: ServiceType property
  for (const plan of ElectricityPlans) {
    if (planOptions[plan.provider] === undefined) {
      planOptions[plan.provider] = {
        electricity: [],
        gas: [],
      };
    }
    planOptions[plan.provider].electricity.push(plan);
  }
  for (const plan of GasPlans) {
    if (planOptions[plan.provider] === undefined) {
      planOptions[plan.provider] = {
        electricity: [],
        gas: [],
      };
    }
    planOptions[plan.provider].gas.push(plan);
  }

  const unbundledPlans = {
    electricity: ElectricityPlans.filter((plan) => plan.bundle.length === 0),
    gas: GasPlans.filter((plan) => plan.bundle.length === 0),
  };
  planOptions["Unbundled"] = unbundledPlans;
  return Object.entries(planOptions)
    .filter(
      ([_, options]) => options.electricity.length > 0 && options.gas.length > 0
    )
    .map(([provider, options]) => {
      const selectedPlan = selectBestPlan(options, usage);
      return {
        name: provider,
        electricity: selectedPlan.electricity,
        gas: selectedPlan.gas,
        total: selectedPlan.electricity.cost + selectedPlan.gas.cost,
      };
    })
    .sort((a, b) => a.total - b.total);
}
