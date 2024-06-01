import assert from "node:assert";
import test, { describe } from "node:test";
import { Temporal } from "temporal-polyfill";
import { calculateHourlyUsageEntryCost } from "./calculate-cost.js";
import { ElectricityPlan } from "./plans.js";

const usageWithCostFrank = {
  intervalType: "hourly",
  usage: [
    { startDate: "2024-04-20T00:00:00+12:00", cost: 0.188692, usage: 0.61 },
    { startDate: "2024-04-20T01:00:00+12:00", cost: 0.151984, usage: 0.47 },
    { startDate: "2024-04-20T02:00:00+12:00", cost: 0.149362, usage: 0.46 },
    { startDate: "2024-04-20T03:00:00+12:00", cost: 0.154606, usage: 0.48 },
    { startDate: "2024-04-20T04:00:00+12:00", cost: 0.149362, usage: 0.46 },
    { startDate: "2024-04-20T05:00:00+12:00", cost: 0.175582, usage: 0.56 },
  ],
};

describe("calculateHourlyUsageEntryCost", () => {
  test("with frank plan", () => {
    const cost = calculateHourlyUsageEntryCost(
      {
        startDate: Temporal.ZonedDateTime.from(
          "2024-04-20T00:00:00+12:00[Pacific/Auckland]"
        ),
        usage: 0.61,
      },
      ElectricityPlan.frankLowUser
    );
    assert.strictEqual(
      cost,
      Math.round(0.61 * ElectricityPlan.frankLowUser.rates[0].millicents)
    );
  });
});
