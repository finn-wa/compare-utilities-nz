import { Temporal } from "temporal-polyfill";

/**
 * A UsageEntry with a parsed ZonedDateTime for the startDate.
 * @typedef TemporalUsageEntry
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate the start time
 * @property {number} usage usage in kwH
 */
/**
 * UsageDetail with total days and TemporalUsageEntries.
 * @typedef TemporalUsageDetail
 * @type {object}
 * @property {import("./parse-data.js").IntervalType} intervalType
 * @property {TemporalUsageEntry[]} usage
 * @property {number} days number of days that the usage entries span
 */

/**
 * @param {import('./parse-data.js').UsageEntry[]} usageEntries
 * @returns {TemporalUsageEntry[]}
 */
export function toTemporalUsageEntries(usageEntries) {
  return usageEntries.map((entry) => ({
    startDate: Temporal.ZonedDateTime.from(
      entry.startDate + "[Pacific/Auckland]"
    ),
    usage: entry.usage,
  }));
}

/**
 * Returns the number of days covered by the usage entries.
 *
 * @param {import("./parse-data.js").IntervalType} intervalType
 * @param {TemporalUsageEntry[]} usage entries in chronological order
 */
function getTotalDays(intervalType, usage) {
  const startDate = usage.at(0)?.startDate;
  const endDate = usage.at(-1)?.startDate;
  if (startDate == null || endDate == null) {
    throw new Error("At least one usage entry is required");
  }
  /** @type {Temporal.Duration} */
  let intervalDuration;
  if (intervalType === "hourly") {
    intervalDuration = Temporal.Duration.from({ hours: 1 });
  } else if (intervalType === "daily") {
    intervalDuration = Temporal.Duration.from({ days: 1 });
  } else if (intervalType === "monthly") {
    intervalDuration = Temporal.Duration.from({ months: 1 });
  } else {
    throw new Error(`Unsupported intervalType: "${intervalType}"`);
  }
  const days = startDate.until(endDate).add(intervalDuration).total("days");
  console.log(`Usage entries span ${days} days`);
  return days;
}

/**
 * @param {import("./plans/types.js").ElectricityPlan} plan
 * @param {TemporalUsageEntry} entry
 * @returns {number} cost in millicents
 */
export function calculateHourlyUsageEntryCost(entry, plan) {
  const { dayOfWeek, hour } = entry.startDate;
  const applicableRates = plan.rates.filter((rate) => {
    /** @type {number[]} */
    const days = rate.days;
    return (
      days.includes(dayOfWeek) &&
      rate.hours.some(({ start, end }) => start <= hour && hour < end)
    );
  });
  if (applicableRates.length !== 1) {
    let errorMsg = `(Plan: ${plan.id}) There must only be one applicable rate, but ${applicableRates.length} were found for entry with start date ${entry.startDate}`;
    if (applicableRates.length > 1) {
      const rateNames = applicableRates
        .map((rate) => rate.name ?? "unnamed")
        .join(", ");
      errorMsg += `: (${rateNames})`;
    }
    throw new Error(errorMsg);
  }
  const variableCost = Math.round(applicableRates[0].millicents * entry.usage);
  const fixedCost = plan.dailyMillicents / entry.startDate.hoursInDay;
  return variableCost + fixedCost;
}

/**
 * @param {import("./parse-data.js").IntervalType} intervalType
 * @param {TemporalUsageEntry[]} usage
 * @param {import("./plans/types.js").ElectricityPlan} plan
 */
export function calculateCost(intervalType, usage, plan) {
  if (intervalType !== "hourly") {
    throw new Error(
      `Unsupported intervalType: "${intervalType}" (must be "hourly")`
    );
  }
  const cost = usage.reduce(
    (acc, entry) => acc + calculateHourlyUsageEntryCost(entry, plan),
    0
  );
  return cost;
}
