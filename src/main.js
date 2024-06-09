import {
  comparePlanCombinations,
  comparePlansIndividually,
} from "./calculate-cost.js";
import { getFrankElectricityUsage, getFrankGasUsage } from "./parse-data.js";
import { InternetPlans } from "./plans/index.js";
import { needsBundle } from "./plans/utils.js";

const usage = {
  electricity: getFrankElectricityUsage(),
  gas: getFrankGasUsage(),
};
printIndividualComparison(usage);
printCombinedComparison(usage);

/**
 * @param {import("./calculate-cost.js").UtilityUsage} usage
 */
function printCombinedComparison(usage) {
  const plans = comparePlanCombinations(usage);
  const planTable = plans.map((choice) => ({
    name: choice.name,
    electricity: formatPlanName(choice.electricity.plan),
    gas: formatPlanName(choice.gas.plan),
    internet: formatPlanName(choice.internet.plan),
    cost: mcTo$(choice.total),
  }));
  console.log("Plan Combinations & Provider Bundles");
  console.log(
    "The best bundle from each provider + the best combination of unbundled plans"
  );
  console.log("Std = Standard Use, Low = Low Use, * = requires bundle");
  console.table(planTable);
}

/**
 *
 * @param {import("./calculate-cost.js").UtilityUsage} usage
 */
function printIndividualComparison(usage) {
  const { gas, electricity } = comparePlansIndividually(usage);
  console.log("Electricity Plans");
  console.log("Std = Standard Use, Low = Low Use, * = requires bundle");
  console.table(
    electricity.map(({ plan, cost }) => ({
      name: formatPlanName(plan),
      cost: mcTo$(cost),
    }))
  );
  console.log("Gas Plans");
  console.log("Std = Standard Use, Low = Low Use, * = requires bundle");
  console.table(
    gas.map(({ plan, cost }) => ({
      name: formatPlanName(plan),
      cost: mcTo$(cost),
    }))
  );
  console.log("Internet Plans");
  console.log("* = requires bundle");
  console.table(
    InternetPlans.sort((a, b) => a.monthlyMillicents - b.monthlyMillicents).map(
      (plan) => ({
        name: formatPlanName(plan),
        cost: mcTo$(plan.monthlyMillicents),
      })
    )
  );
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
  let name = `${plan.provider}: ${plan.name}`;
  if (plan.variant != null) {
    name += ` (${plan.variant})`;
  }
  if (needsBundle(plan)) {
    name += "*";
  }
  return name;
}

/** @param {Record<string, string | number>[]} data */
function printMarkdownTable(data) {
  const headers = Object.keys(data[0]);

  let output = `| ${headers.join(" | ")} |\n`;
  output += `| ${headers.map(() => "---").join(" | ")} |\n`;

  for (const obj of data) {
    const row = headers.map((header) => obj[header]);
    output += `| ${row.join(" | ")} |\n`;
  }
  console.log(output);
}
