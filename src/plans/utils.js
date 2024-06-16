import { writeFileSync } from "fs";
/** @import { Day, Rate, HourInterval, ElectricityPlan, PipedGasPlan, InternetPlan, Plan } from "./types.js" */

/** @type {Day[]} */
export const weekdays = [1, 2, 3, 4, 5];
/** @type {Day[]} */
export const weekends = [6, 7];
/** @type {Day[]} */
export const daily = [1, 2, 3, 4, 5, 6, 7];

/**
 * Validates and returns an hour interval.
 *
 * @param {number} start
 * @param {number} end
 * @returns {HourInterval}
 */
export function hours(start, end) {
  if (start >= end) {
    throw new Error(`Start must be less than end [${start}, ${end}]`);
  }
  if (start < 0 || start > 23) {
    throw new Error(`Start is out of bounds (${start})`);
  }
  if (end < 1 || start > 24) {
    throw new Error(`End is out of bounds (${end})`);
  }
  return { start, end };
}

/** @type {HourInterval[]} */
export const allDay = [hours(0, 24)];

/**
 * Returns a single rate that applies all day, every day of
 * the week.
 *
 * @param {number} millicents price per kwH
 * @returns {Rate}
 */
export function dailyRate(millicents, name = "Daily") {
  return { days: daily, hours: allDay, millicents, name };
}

/**
 * Pretty-prints an object as a JSON.
 * @param {any} obj
 * @returns {string}
 */
export function pp(obj) {
  return JSON.stringify(obj, null, 2);
}

/**
 * @param {object} jsonObject
 * @param {string} outputPath output file path
 */
export function writeJson(jsonObject, outputPath) {
  console.log("Writing JSON output to " + outputPath);
  const json = JSON.stringify(jsonObject);
  writeFileSync(outputPath, json, { encoding: "utf8" });
}

/**
 * Adds the `type: "electricity"` property and validates rates.
 * @param {Omit<ElectricityPlan, 'type'>} plan
 * @returns {ElectricityPlan}
 */
export function electricityPlan(plan) {
  /** @type {ElectricityPlan} */
  const planWithType = { type: "electricity", ...plan };
  for (const day of daily) {
    for (const hour of Array.from({ length: 24 }, (_, i) => i)) {
      if (getRateForTime(planWithType, day, hour) == null) {
        // getRateForTime will throw a better error
        throw new Error("No rate found!");
      }
    }
  }
  return planWithType;
}

/**
 * Adds the `type: "gas"` property
 * @param {Omit<PipedGasPlan, 'type'>} plan
 * @returns {PipedGasPlan}
 */
export function gasPlan(plan) {
  return { type: "gas", ...plan };
}

/**
 * Adds the `type: "internet"` property
 * @param {Omit<InternetPlan, 'type'>} plan
 * @returns {InternetPlan}
 */
export function internetPlan(plan) {
  return { type: "internet", ...plan };
}

/**
 * Converts dollars to millicents
 * @param {number} dollars dollar value
 * @returns {number} millicent value
 */
export function $ToMc(dollars) {
  return dollars * 100_000;
}

/**
 * Converts millicents to dollars (2 d.p.)
 * @param {number} mc millicent value
 * @returns {number} dollar value
 */
export function mcTo$(mc) {
  return Number((mc / 100_000).toFixed(2));
}

/** @type {<T extends any[]> (arr: T | null | undefined) => T} */
export const requireNonEmpty = (arr) => {
  if (arr == null || arr.length === 0) {
    throw new Error("Array must be non-empty, received " + pp(arr));
  }
  return arr;
};

/**
 * @param {Plan} plan
 * @returns {boolean}
 */
export function needsBundle(plan) {
  return plan.bundle.length > 0;
}

/**
 * @param {ElectricityPlan} plan
 * @param {Day} day
 * @param {number} hour
 */
export function getRateForTime(plan, day, hour) {
  const applicableRates = plan.rates.filter((rate) => {
    /** @type {number[]} */
    const days = rate.days;
    return (
      days.includes(day) &&
      rate.hours.some(({ start, end }) => start <= hour && hour < end)
    );
  });
  if (applicableRates.length === 1) {
    return applicableRates[0];
  }
  // Make sure that there aren't any overlapping non-special rates
  const nonSpecialRates = applicableRates.filter((rate) => !rate.special);
  if (nonSpecialRates.length !== 1) {
    let errorMsg = `(Plan: ${plan.id}) There must only be one applicable rate, but ${nonSpecialRates.length} were found for day ${day} & hour ${hour}`;
    if (nonSpecialRates.length > 1) {
      const rateNames = nonSpecialRates
        .map((rate) => rate.name ?? "unnamed")
        .join(", ");
      errorMsg += `: (${rateNames})`;
    }
    throw new Error(errorMsg);
  }
  return applicableRates.reduce((min, rate) =>
    rate.millicents < min.millicents ? rate : min
  );
}
