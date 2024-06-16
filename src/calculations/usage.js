/** @import { UsageDetails, UsageEntry, UsageEntries, GasUsage, IntervalType } from './types.js' */

import { Temporal } from "temporal-polyfill";

/**
 *
 * @param {UsageEntry[]} usageEntries
 * @returns {UsageDetails} usage binned by hour
 */
export function calculateUsageDetails(usageEntries) {
  const totalDays = getTotalDays("hourly", usageEntries);
  const usageByHour = emptyHourlyUsage();
  // Using an array to get around strict typing being angry about Day != number
  const usageByDayArr = Array.from({ length: 7 }, () => emptyHourlyUsage());
  for (const entry of usageEntries) {
    usageByHour[entry.startDate.hour] += entry.usage;
    usageByDayArr[entry.startDate.dayOfWeek - 1][entry.startDate.hour] +=
      entry.usage;
  }
  const usageByDay = {
    1: usageByDayArr[0],
    2: usageByDayArr[1],
    3: usageByDayArr[2],
    4: usageByDayArr[3],
    5: usageByDayArr[4],
    6: usageByDayArr[5],
    7: usageByDayArr[6],
  };
  return {
    totalDays,
    totalUsage: usageByHour.reduce((acc, curr) => acc + curr, 0),
    usageByHourOfDay: usageByHour,
    usageByHourOfWeek: usageByDay,
  };
}

function emptyHourlyUsage() {
  return Array.from({ length: 24 }, () => 0);
}

/**
 * Returns the number of days covered by the usage entries.
 *
 * @param {IntervalType} intervalType
 * @param {UsageEntry[]} usage entries in chronological order
 */
export function getTotalDays(intervalType, usage) {
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
  return startDate.until(endDate).add(intervalDuration).total("days");
}
