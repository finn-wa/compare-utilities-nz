import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { Temporal } from "temporal-polyfill";
import { NZT } from "../utils.js";
import { pp } from "../../plans/utils.js";
/** @import { UsageEntries, UsageEntry } from '../../calculations/types.js' */

/**
 * Reads Electric Kiwi electricity consumption JSON files from the input folder and outputs a formatted usage object.
 *
 * @param {string} inputFolder
 * @param {{startDate: string, endDate: string}} [dateRange] start and end date in YYYY-MM-DD format. Start-inclusive, end-exclusive.
 * @returns {UsageEntries}
 */
export function getElectricKiwiConsumption(
  inputFolder = "./data/ek",
  dateRange
) {
  const consumptionData = parseConsumptionFiles(inputFolder);
  return {
    intervalType: "hourly",
    usage: getUsageEntriesFromFiles(consumptionData, dateRange),
  };
}

function tallyCost() {
  // so this doesn't match my calculations
  // plus hour of power needs to be read from data
  const consumption = parseConsumptionFiles("./data/ek");
  let cost = 0;
  for (const file of consumption) {
    for (const day in file.data.usage) {
      cost += parseFloat(file.data.usage[day].total_charges_incl_gst);
    }
  }
  console.log(cost);
}

// Input file types

/**
  @typedef {{
    consumption: string
    consumption_rate: number
    hop_best: number
    hop_interval: number
    time: string
  }} UsageInterval

  @typedef {{
    adjustment_charges_incl_gst: string              
    bill_consumption: string
    consumption: string
    consumption_adjustment: string
    fixed_charges_excl_gst: string
    fixed_charges_incl_gst: string
    intervals: {[intervalNumber: string]: UsageInterval}
    percent_consumption_adjustment: string
    range: {
      end_date: string
      start_date: string
    }
    solar_feed_in_tariffs: number
    status: string
    total_charges_incl_gst: string
    type: string
    usage_type: string
  }} DailyUsage
  
  @typedef {{
    group_breakdown: string[]
    range: {
      end_date: string
      group_by: string
      start_date: string
    }
    type: string
    usage: {[date: string]: DailyUsage }
  }} ConsumptionData

  @typedef {{
    data: ConsumptionData
    status: number
  }} ElectricKiwiConsumptionJson
 */

/**
 * @param {string} dataDir
 * @returns {ElectricKiwiConsumptionJson[]}
 */
function parseConsumptionFiles(dataDir) {
  console.log("Reading files in " + dataDir);
  return readdirSync(dataDir)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => parseConsumptionFile(join(dataDir, filename)))
    .sort(
      (a, b) =>
        Temporal.PlainDate.from(a.data.range.start_date).since(
          Temporal.PlainDate.from(b.data.range.start_date)
        ).milliseconds
    );
}

/**
 * @param {string} file the JSON file from the Electric Kiwi API
 * @returns {ElectricKiwiConsumptionJson}
 */
function parseConsumptionFile(file) {
  console.log("Parsing " + file);
  return JSON.parse(readFileSync(file, { encoding: "utf8" }));
}

/**
 * @param {ElectricKiwiConsumptionJson[]} files
 * @param {{startDate: string, endDate: string}} [dateRange] start and end date in YYYY-MM-DD format. Start-inclusive, end-exclusive.
 * @returns {UsageEntry[]}
 */
function getUsageEntriesFromFiles(files, dateRange) {
  console.log("Combining usage details from all files");
  if (files.length === 0) {
    throw new Error("At least one file is required");
  }

  let i = 0;
  let fileData = files[i].data;
  const allUsage = [...getUsageEntriesFromFile(fileData)];
  let lastEntryStartTime = allUsage[allUsage.length - 1].startDate;

  for (i = 1; i < files.length; i++) {
    fileData = files[i].data;
    allUsage.push(...getUsageEntriesFromFile(fileData, lastEntryStartTime));
    lastEntryStartTime = allUsage[allUsage.length - 1].startDate;
  }

  if (dateRange) {
    console.log(
      `Finding entries between ${dateRange.startDate} and ${dateRange.endDate}`
    );
    const startDate = Temporal.PlainDate.from(dateRange.startDate);
    const endDate = Temporal.PlainDate.from(dateRange.endDate);
    const startIndex = allUsage.findIndex(
      (entry) =>
        entry.startDate.toPlainDate().since(startDate).total("hours") >= 0
    );
    const endIndex = allUsage.findIndex(
      (entry) =>
        entry.startDate.toPlainDate().since(endDate).total("hours") >= 0
    );
    console.log(
      "First: " + allUsage[startIndex].startDate.toPlainDate().toString()
    );
    console.log(
      "Last: " + allUsage[endIndex - 1].startDate.toPlainDate().toString()
    );
    return allUsage.slice(startIndex, endIndex);
  }

  return allUsage;
}

/**
 * @param {ConsumptionData} data
 * @param {Temporal.ZonedDateTime} [afterTime]
 * @returns {UsageEntry[]}
 */
function getUsageEntriesFromFile(data, afterTime) {
  const entries = data.group_breakdown.flatMap((day) =>
    getUsageEntriesFromDay(day, data.usage[day])
  );
  if (afterTime != null) {
    const startIndex = entries.findIndex(
      (entry) => entry.startDate.since(afterTime).total("hours") > 0
    );
    if (startIndex === -1) {
      console.log(
        "WARNING: only duplicate entries were found in file with range " +
          pp(data.range)
      );
      return [];
    }
    if (
      startIndex === 0 &&
      entries[0].startDate.since(afterTime).total("hours") > 1
    ) {
      throw new Error(
        `Expected file with range ${pp(
          data.range
        )} to start from ${afterTime.toString()}`
      );
    }
    return entries.slice(startIndex);
  }
  return entries;
}

/**
 * @param {string} date YYYY-MM-DD
 * @param {DailyUsage} dailyUsage
 * @returns {UsageEntry[]}
 */
export function getUsageEntriesFromDay(date, dailyUsage) {
  const day = Temporal.PlainDate.from(date);
  const halfHourEntries = Object.keys(dailyUsage.intervals)
    .map((interval) => {
      const { time, consumption } = dailyUsage.intervals[interval];
      const startDate = parseTime(time).toZonedDateTime({
        plainDate: day,
        timeZone: NZT,
      });
      return { startDate, usage: parseFloat(consumption) };
    })
    .sort((a, b) => a.startDate.since(b.startDate).seconds);

  /**@type {UsageEntry[]} */
  const usageEntries = [];
  for (let i = 0; i < halfHourEntries.length; i += 2) {
    const first = halfHourEntries[i];
    const second = halfHourEntries[i + 1];
    if (first.startDate.hour !== second.startDate.hour) {
      throw new Error(
        `Half-hourly data mismatch: ${first.startDate}, ${second.startDate}`
      );
    }
    usageEntries.push({
      startDate: first.startDate,
      usage: first.usage + second.usage,
    });
  }
  return usageEntries;
}

/**
 * @param {string} date e.g. 2023-04-10
 * @returns {Temporal.ZonedDateTime}
 */
function parseDate(date) {
  return Temporal.PlainDate.from(date).toZonedDateTime(NZT);
}

/**
 * @param {string} time
 */
function parseTime(time) {
  const [numbers, amPM] = time.split(" ");
  const [hoursStr, minsStr] = numbers.split(":");
  /** @type {number} */
  let hour;
  if (amPM === "AM") {
    hour = hoursStr === "12" ? 0 : Number(hoursStr);
  } else {
    hour = hoursStr === "12" ? 12 : Number(hoursStr) + 12;
  }
  return Temporal.PlainTime.from({
    hour,
    minute: Number(minsStr),
  });
}
