import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const inputFolder = "./data/input";
const outputFile = "./data/output/electricity-usage.json";

/** @type {IntervalType} */
const intervalType = "hourly";
const files = parseFrankElectricityUsageFiles(inputFolder, intervalType);
const rows = getUsageEntriesFromFiles(files);
writeUsageDetailsJson(intervalType, rows, outputFile);

/**
 * Input file types:
 * @typedef {('hourly'|'daily'|'monthly')} IntervalType
 *
 * @typedef FrankElectricityUsage
 * @type {object}
 * @property {number} kw
 * @property {number} unroundedCost e.g. 0.136252
 * @property {number} costNZD e.g. 0.14
 * @property {string} id e.g. "e11a6eb8404241f57435aaec056cdb8e"
 * @property {string} startDate e.g. "2024-05-20T00:00:00+12:00",
 * @property {string} endDate e.g. "2024-05-20T00:59:59+12:00",
 * @property {IntervalType} intervalType e.g. "hourly"
 *
 * @typedef FrankSupplyPoint
 * @type {object}
 * @property {string} id
 * @property {string} startDate
 * @property {string} endDate
 * @property {FrankElectricityUsage[]} usage
 *
 * @typedef FrankElectricityUsageFile
 * @type {object}
 * @property {string} intervalType
 * @property {FrankSupplyPoint[]} supplyPoints Seems to be a single-item array
 *
 * Output types:
 * @typedef UsageEntry
 * @type {object}
 * @property {string} startDate the start time
 * @property {number} usage usage in kwH
 *
 * @typedef UsageDetails
 * @type {object}
 * @property {IntervalType} intervalType the period of time between usage entries
 * @property {UsageEntry[]} usage usage in chronological order
 */

/**
 * @param {string} file the JSON file from the Frank API
 * @param {IntervalType} intervalType the expected interval type
 * @returns {FrankElectricityUsageFile}
 */
function parseFrankElectricityUsageFile(file, intervalType) {
  console.log("Parsing " + file);
  /** @type {FrankElectricityUsageFile} */
  const usageFile = JSON.parse(readFileSync(file, { encoding: "utf8" }));
  if (usageFile.supplyPoints.length !== 1) {
    throw new Error(
      `File ${file} has ${usageFile.supplyPoints.length} supply points!`
    );
  }
  if (usageFile.intervalType !== intervalType) {
    throw new Error(
      `File ${file} has intervalType ${usageFile.intervalType} instead of ${intervalType}`
    );
  }
  return usageFile;
}

/**
 * @param {string} dataDir
 * @param {IntervalType} intervalType the expected interval type
 * @returns {FrankElectricityUsageFile[]}
 */
function parseFrankElectricityUsageFiles(dataDir, intervalType = "hourly") {
  console.log("Reading files from " + dataDir);
  return readdirSync(dataDir)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) =>
      parseFrankElectricityUsageFile(join(dataDir, filename), intervalType)
    )
    .sort(
      (a, b) =>
        Date.parse(a.supplyPoints[0].startDate) -
        Date.parse(b.supplyPoints[0].startDate)
    );
}

/**
 * @param {FrankElectricityUsageFile[]} files
 * @returns {UsageEntry[]}
 */
function getUsageEntriesFromFiles(files) {
  console.log("Combining usage details from all files");
  /** @type {FrankElectricityUsage[]} */
  const allUsage = [];
  /** @type {number} */
  let lastFileEndDate = 0;
  for (const file of files) {
    const startDate = Date.parse(file.supplyPoints[0].startDate);
    if (lastFileEndDate !== 0 && startDate - lastFileEndDate !== 1000) {
      throw new Error(
        `Expected 1 second between files, found ${
          (startDate - lastFileEndDate) / 1000
        } (startDate: ${file.supplyPoints[0].startDate})`
      );
    }
    allUsage.push(...file.supplyPoints[0].usage);
    lastFileEndDate = Date.parse(file.supplyPoints[0].endDate);
  }
  return allUsage
    .map(({ startDate, unroundedCost, kw }) => ({
      startDate,
      cost: unroundedCost,
      usage: kw,
    }))
    .sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
}

/**
 * @param {(number|string|boolean)[]} values
 * @returns {string}
 */
function toCsvRow(values) {
  return values.map((value) => JSON.stringify(value)).join(",");
}

/**
 * @param {UsageEntry[]} rows
 * @returns {string}
 */
function toCsvString(rows) {
  console.log("Converting rows to CSV");
  let contents = '"startDate", "usage"\n';
  for (const { startDate, usage } of rows) {
    contents += toCsvRow([startDate, usage]) + "\n";
  }
  return contents;
}

/**
 * @param {UsageEntry[]} rows
 * @param {string} outputPath output file path
 */
function writeCsv(rows, outputPath) {
  const csv = toCsvString(rows);
  console.log("Writing CSV output to " + outputPath);
  writeFileSync(outputPath, csv, { encoding: "utf8" });
}

/**
 * @param {IntervalType} intervalType
 * @param {UsageEntry[]} usage
 * @param {string} outputPath output file path
 */
function writeUsageDetailsJson(intervalType, usage, outputPath) {
  console.log("Writing JSON output to " + outputPath);
  /** @type {UsageDetails} */
  const usageDetails = { intervalType, usage };
  const json = JSON.stringify(usageDetails);
  writeFileSync(outputPath, json, { encoding: "utf8" });
}
