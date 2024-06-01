import { readFileSync } from "fs";
import { calculateCost, toTemporalUsageEntries } from "./calculate-cost.js";
import { ElectricityPlans } from "./plans/index.js";

const usageDetailsFile = "./data/output/electricity-usage.json";

/** @type {import("./parse-data.js").UsageDetails} */
const usageDetails = JSON.parse(
  readFileSync(usageDetailsFile, { encoding: "utf8" })
);
const usage = toTemporalUsageEntries(usageDetails.usage);
const costPerPlan = Object.fromEntries(
  ElectricityPlans.map((plan) => [
    formatPlanName(plan),
    mcTo$(calculateCost(usageDetails.intervalType, usage, plan)),
  ])
);
console.table(costPerPlan);

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
