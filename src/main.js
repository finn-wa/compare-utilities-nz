import {
  calculateElectricityPlanCost,
  calculateGasPlanCost,
  comparePlans,
} from "./calculate-cost.js";
import { getFrankElectricityUsage, getFrankGasUsage } from "./parse-data.js";
import { ElectricityPlans, GasPlans } from "./plans/index.js";

comparePlansCombined();

function comparePlansCombined() {
  const plans = comparePlans();
  const planTable = plans.map((choice) => ({
    name: choice.name,
    electricity: formatPlanName(choice.electricity.plan),
    gas: formatPlanName(choice.gas.plan),
    cost: mcTo$(choice.electricity.cost + choice.gas.cost),
  }));
  console.table(planTable);
}

function comparePlansIndividually() {
  const electricityUsage = getFrankElectricityUsage();
  const electricityPlanCost = Object.fromEntries(
    ElectricityPlans.map((plan) => [
      formatPlanName(plan),
      mcTo$(calculateElectricityPlanCost(electricityUsage, plan)),
    ])
  );
  console.table(electricityPlanCost);
  const gasUsage = getFrankGasUsage();
  const gasPlanCost = Object.fromEntries(
    GasPlans.map((plan) => [
      formatPlanName(plan),
      mcTo$(calculateGasPlanCost(gasUsage, plan)),
    ])
  );
  console.table(gasPlanCost);
}

/**
 * Formats millicents as dollars.
 * @param {number} mc
 * @returns {string} dollar value as a string
 */
function mcTo$(mc) {
  return "$" + (mc / 100_000).toFixed(2);
}

/**
 * @param {import("./plans/types.js").Plan} plan
 * @returns {string}
 */
function formatPlanName(plan) {
  const name = `${plan.provider}: ${plan.name}`;
  if (plan.variant != null) {
    return `${name} (${plan.variant})`;
  }
  return name;
}
