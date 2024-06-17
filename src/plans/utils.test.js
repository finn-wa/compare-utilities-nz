import assert from "node:assert";
import { describe, it } from "node:test";
import { daily, getRateForTime, weekdays, weekends } from "./utils.js";

describe("getRateForTime", () => {
  it("should work for peak times", () => {
    const plan = getSampleComplexPlan();
    const peakRate = plan.rates[0];
    for (const day of weekdays) {
      assert.strictEqual(getRateForTime(plan, day, 7), peakRate);
      assert.strictEqual(getRateForTime(plan, day, 8), peakRate);
      assert.strictEqual(getRateForTime(plan, day, 17), peakRate);
      assert.strictEqual(getRateForTime(plan, day, 18), peakRate);
      assert.strictEqual(getRateForTime(plan, day, 20), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 6), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 9), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 16), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 21), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 0), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 13), peakRate);
    }
    for (const day of weekends) {
      assert.notStrictEqual(getRateForTime(plan, day, 7), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 8), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 0), peakRate);
      assert.notStrictEqual(getRateForTime(plan, day, 13), peakRate);
    }
  });

  it("should work for weekends", () => {
    const plan = getSampleComplexPlan();
    const shoulderRate = plan.rates[2];
    for (const day of weekdays) {
      assert.notStrictEqual(getRateForTime(plan, day, 0), shoulderRate);
      assert.notStrictEqual(getRateForTime(plan, day, 7), shoulderRate);
      assert.notStrictEqual(getRateForTime(plan, day, 9), shoulderRate);
      assert.notStrictEqual(getRateForTime(plan, day, 23), shoulderRate);
    }
    for (const day of weekends) {
      assert.notStrictEqual(getRateForTime(plan, day, 0), shoulderRate);
      assert.notStrictEqual(getRateForTime(plan, day, 6), shoulderRate);
      assert.strictEqual(getRateForTime(plan, day, 7), shoulderRate);
      assert.strictEqual(getRateForTime(plan, day, 12), shoulderRate);
      assert.strictEqual(getRateForTime(plan, day, 13), shoulderRate);
      assert.strictEqual(getRateForTime(plan, day, 22), shoulderRate);
      assert.notStrictEqual(getRateForTime(plan, day, 23), shoulderRate);
    }
  });

  it("should work for special rates", () => {
    const plan = getSampleComplexPlan();
    const specialRate = plan.rates[4];
    for (const day of daily) {
      assert.notStrictEqual(getRateForTime(plan, day, 0), specialRate);
      assert.notStrictEqual(getRateForTime(plan, day, 14), specialRate);
      assert.strictEqual(getRateForTime(plan, day, 15), specialRate);
      assert.notStrictEqual(getRateForTime(plan, day, 16), specialRate);
      assert.notStrictEqual(getRateForTime(plan, day, 23), specialRate);
    }
  });
});

/** @returns {import("./types.js").ElectricityPlan} */
function getSampleComplexPlan() {
  return {
    type: "electricity",
    id: "electricKiwiMoveMasterLowUser",
    provider: "Electric Kiwi",
    name: "MoveMaster",
    variant: "Low",
    bundle: [],
    dailyMillicents: 69000,
    rates: [
      {
        name: "Peak",
        days: [1, 2, 3, 4, 5],
        hours: [
          { start: 7, end: 9 },
          { start: 17, end: 21 },
        ],
        millicents: 45500,
      },
      {
        name: "Off-Peak Shoulder",
        days: [1, 2, 3, 4, 5],
        hours: [
          { start: 9, end: 17 },
          { start: 21, end: 23 },
        ],
        millicents: 31850,
      },
      {
        name: "Off-Peak Shoulder",
        days: [6, 7],
        hours: [{ start: 7, end: 23 }],
        millicents: 31850,
      },
      {
        name: "Off-Peak Night",
        days: [1, 2, 3, 4, 5, 6, 7],
        hours: [
          { start: 23, end: 24 },
          { start: 0, end: 7 },
        ],
        millicents: 22750,
      },
      {
        name: "Hour of Power",
        days: [1, 2, 3, 4, 5, 6, 7],
        hours: [{ start: 15, end: 16 }],
        millicents: 0,
        special: true,
      },
    ],
  };
}
