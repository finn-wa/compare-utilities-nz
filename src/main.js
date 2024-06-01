import { readFileSync } from "fs";
import { calculateCost, toTemporalUsageEntries } from "./calculate-cost.js";
import { ElectricityPlans } from "./plans.js";

const usageDetailsFile = "./data/output/electricity-usage.json";

/** @type {import("./parse-data.js").UsageDetails} */
const usageDetails = JSON.parse(
  readFileSync(usageDetailsFile, { encoding: "utf8" })
);
const usage = toTemporalUsageEntries(usageDetails.usage);
for (const plan of ElectricityPlans) {
  calculateCost(usageDetails.intervalType, usage, plan);
}
