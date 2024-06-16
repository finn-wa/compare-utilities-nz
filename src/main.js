import {
  calculatePlanUsageCostBreakdown,
  comparePlanCombinations,
  comparePlansIndividually,
} from "./calculations/cost.js";
import { calculateUsageDetails } from "./calculations/usage.js";
import {
  getFrankElectricityUsage,
  getFrankGasUsage,
} from "./input/frank/parse-frank-data.js";
import { needsBundle } from "./plans/utils.js";
/** @import {UtilityUsage} from "./calculations/cost.js" */
/** @import {PlanUsageCostBreakdown} from "./calculations/types.js" */
/** @import {Plan} from './plans/types.js' */

const eletricityUsage = getFrankElectricityUsage();
const usage = {
  electricity: calculateUsageDetails(eletricityUsage.usage),
  gas: getFrankGasUsage(),
};
printIndividualComparison(usage);
printCombinedComparison(usage);

/**
 * @param {UtilityUsage} usage
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
 * @param {UtilityUsage} usage
 */
function printIndividualComparison(usage) {
  const plansByType = comparePlansIndividually(usage);
  if (plansByType.electricity) {
    console.log("Electricity Plans");
    console.log("Std = Standard Use, Low = Low Use, * = requires bundle");
    console.table(
      plansByType.electricity.map((x) => ({
        name: formatPlanName(x.plan),
        cost: mcTo$(x.totalCost),
        "variable cost": pc(x.variableCost, x.totalCost),
        rates: formatRateBreakdown(
          x.rateBreakdown,
          x.variableCost,
          x.usageDetails.totalUsage
        ),
      }))
    );
  }
  if (plansByType.gas) {
    console.log("Gas Plans");
    console.log("Std = Standard Use, Low = Low Use, * = requires bundle");
    console.table(
      plansByType.gas.map(({ plan, cost }) => ({
        name: formatPlanName(plan),
        cost: mcTo$(cost),
      }))
    );
  }
  if (plansByType.internet) {
    console.log("Internet Plans");
    console.log("* = requires bundle");
    console.table(
      plansByType.internet.map((plan) => ({
        name: formatPlanName(plan),
        cost: mcTo$(plan.monthlyMillicents),
      }))
    );
  }
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
 * @param {Plan} plan
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

/**
 * @param {number} numerator
 * @param {number} denominator
 * @returns {string} formatted as a percentage
 */
function pc(numerator, denominator) {
  return Math.round((numerator / denominator) * 100) + "%";
}

/**
 * @param {PlanUsageCostBreakdown['rateBreakdown']} rateBreakdown
 * @param {number} variableCost
 * @param {number} totalUsage

 * @returns {string}
 */
function formatRateBreakdown(rateBreakdown, variableCost, totalUsage) {
  return Object.entries(rateBreakdown)
    .sort(([_, a], [__, b]) => b.usage - a.usage)
    .map(
      ([rate, { usage, cost }]) =>
        rate + ` (${pc(usage, totalUsage)} 🗲, ${pc(cost, variableCost)} $)`
    )
    .join("; ");
}
