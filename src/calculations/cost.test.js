import assert from "node:assert";
import test, { describe } from "node:test";
import { Temporal } from "temporal-polyfill";
import { dailyRate, electricityPlan, mcTo$ } from "../plans/utils.js";
import { calculateElectricityPlanCost, getRate } from "./cost.js";
import { getFrankElectricityUsage } from "../input/frank/parse-frank-data.js";

const dailyRatePlan = electricityPlan({
  id: "frankLowUser",
  provider: "Frank",
  name: "Electricity",
  variant: "Low",
  dailyMillicents: 69_000,
  bundle: [],
  rates: [dailyRate(26_220)],
});

describe("calculateHourlyUsageEntryCost", () => {
  test("with daily rate", () => {
    const cost = getRate(
      {
        startDate: Temporal.ZonedDateTime.from(
          "2024-04-20T00:00:00+12:00[Pacific/Auckland]"
        ),
        usage: 0.61,
      },
      dailyRatePlan
    );
    assert.strictEqual(mcTo$(cost), 0.19);
  });
});

describe("calculateElectricityPlanCost", () => {
  const intervalType = "hourly";

  function getAprilUsage() {
    const { usage } = getFrankElectricityUsage("./data/test", intervalType);
    const april = Temporal.ZonedDateTime.from(
      "2024-04-01T00:00:00[Pacific/Auckland]"
    );
    const may = Temporal.ZonedDateTime.from(
      "2024-05-01T00:00:00[Pacific/Auckland]"
    );
    const startIndex = usage.findIndex(
      (i) => i.startDate.since(april).total("seconds") >= 0
    );
    const endIndex = usage.findIndex(
      (i) => i.startDate.since(may).total("seconds") >= 0
    );
    console.log({ startIndex, endIndex });
    return usage.slice(startIndex + 1, endIndex);
  }

  test("daily rate with 1 month of data", () => {
    const usage = getAprilUsage();
    console.log(usage[0].startDate.toString());
    console.log(usage[usage.length - 1].startDate.toString());
    const totalKw = usage.reduce((acc, entry) => acc + entry.usage, 0);
    // assert.strictEqual(totalKw.toFixed(2), "609.24");
    const cost = calculateElectricityPlanCost(
      { intervalType, usage },
      dailyRatePlan
    );
    // 609.72;
    assert.strictEqual(mcTo$(cost), 180.44);
  });
});
