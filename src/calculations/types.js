import { Temporal } from "temporal-polyfill";
/** @import { Day, Plan } from "../plans/types.js" */

/**
 * @typedef UsageEntry
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate the start time
 * @property {number} usage usage in kwH
 */
/** @typedef {('hourly'|'daily'|'monthly')} IntervalType */
/**
 * @typedef UsageEntries
 * @type {object}
 * @property {IntervalType} intervalType the period of time between usage entries
 * @property {UsageEntry[]} usage usage in chronological order
 */
/**
 * @typedef UsageDetails
 * @type {object}
 * @property {number[]} usageByHourOfDay a 24-element array containing usage in kwH binned by hour
 * @property {Record<Day, number[]>} usageByHourOfWeek usage binned by day and then hour in kwH
 * @property {number} totalDays the number of days the usage spans
 * @property {number} totalUsage the total usage in kw
 */
/**
 * @typedef GasUsage
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate
 * @property {Temporal.ZonedDateTime} endDate
 * @property {number} usage usage in kwH
 */
/**
 * A cost breakdown
 * @typedef PlanUsageCostBreakdown
 * @type {object}
 * @property {Plan} plan the plan
 * @property {UsageDetails} usageDetails
 * @property {number} totalCost in mc
 * @property {number} fixedCost daily charges in mc
 * @property {number} variableCost usage charges in mc
 * @property {Object.<string, {usage: number, cost: number}>} rateBreakdown cost & usage by rate
 */
