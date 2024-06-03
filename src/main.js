import { calculateCost } from "./calculate-cost.js";
import { getFrankElectricityUsage, getFrankGasUsage } from "./parse-data.js";
import { ElectricityPlans } from "./plans/index.js";
import { pp } from "./plans/utils.js";

comparePlans();

function comparePlans() {
  const gasUsage = getFrankGasUsage();
  console.log(pp(gasUsage));
  const electricityUsage = getFrankElectricityUsage();
  const costPerPlan = Object.fromEntries(
    ElectricityPlans.map((plan) => [
      formatPlanName(plan),
      mcTo$(calculateCost(electricityUsage, plan)),
    ])
  );
  console.table(costPerPlan);
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
 * @param {import("./plans/types.js").ElectricityPlan} plan
 * @returns {string}
 */
function formatPlanName(plan) {
  const name = `${plan.provider}: ${plan.name}`;
  if (plan.variant != null) {
    return `${name} (${plan.variant})`;
  }
  return name;
}
