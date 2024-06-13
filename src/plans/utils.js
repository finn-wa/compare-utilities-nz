import { writeFileSync } from "fs";

/** @type {import("./types.js").Day[]} */
export const weekdays = [1, 2, 3, 4, 5];
/** @type {import("./types.js").Day[]} */
export const weekends = [6, 7];
/** @type {import("./types.js").Day[]} */
export const daily = [1, 2, 3, 4, 5, 6, 7];

/**
 * Validates and returns an hour interval.
 *
 * @param {number} start
 * @param {number} end
 * @returns {import("./types.js").HourInterval}
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

/** @type {import("./types.js").HourInterval[]} */
export const allDay = [hours(0, 24)];

/**
 * Returns a single rate that applies all day, every day of
 * the week.
 *
 * @param {number} millicents price per kwH
 * @returns {import("./types.js").Rate}
 */
export function dailyRate(millicents) {
  return { days: daily, hours: allDay, millicents };
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
 * Adds the `type: "electricity"` property
 * @param {Omit<import("./types.js").ElectricityPlan, 'type'>} plan
 * @returns {import("./types.js").ElectricityPlan}
 */
export function electricityPlan(plan) {
  return { type: "electricity", ...plan };
}

/**
 * Adds the `type: "gas"` property
 * @param {Omit<import("./types.js").PipedGasPlan, 'type'>} plan
 * @returns {import("./types.js").PipedGasPlan}
 */
export function gasPlan(plan) {
  return { type: "gas", ...plan };
}

/**
 * Adds the `type: "internet"` property
 * @param {Omit<import("./types.js").InternetPlan, 'type'>} plan
 * @returns {import("./types.js").InternetPlan}
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
 * @param {import("./types.js").Plan} plan
 * @returns {boolean}
 */
export function needsBundle(plan) {
  return plan.bundle.length > 0;
}
