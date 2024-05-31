import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

const files = parseFiles("./data");
const rows = getRowsFromFiles(files);
writeJson(rows, "data.json");

/**
 * Input file types:
 * @typedef Usage
 * @type {object}
 * @property {number} kw
 * @property {number} unroundedCost e.g. 0.136252
 * @property {number} costNZD e.g. 0.14
 * @property {string} id e.g. "e11a6eb8404241f57435aaec056cdb8e"
 * @property {string} startDate e.g. "2024-05-20T00:00:00+12:00",
 * @property {string} endDate e.g. "2024-05-20T00:59:59+12:00",
 * @property {string} intervalType "hourly"
 *
 * @typedef SupplyPoint
 * @type {object}
 * @property {string} id
 * @property {string} startDate
 * @property {string} endDate
 * @property {Usage[]} usage
 *
 * @typedef UsageFile
 * @type {object}
 * @property {string} intervalType
 * @property {SupplyPoint[]} supplyPoints Seems to be a single-item array
 *
 * Output types:
 * @typedef HourUsageRow
 * @type {object}
 * @property {string} startDate the start time
 * @property {number} usage usage in kwH
 * @property {number} cost cost in NZD
 */

/**
 * @param {string} file
 * @returns {UsageFile}
 */
function parseFile(file) {
  console.log("Parsing " + file);
  /** @type {UsageFile} */
  const usageFile = JSON.parse(readFileSync(file, { encoding: "utf8" }));
  if (usageFile.supplyPoints.length !== 1) {
    throw new Error(
      `File ${file} has ${usageFile.supplyPoints.length} supply points!`
    );
  }
  if (usageFile.intervalType !== "hourly") {
    throw new Error(
      `File ${file} has intervalType ${
        usageFile.intervalType
      } instead of ${"hourly"}`
    );
  }
  return usageFile;
}

/**
 * @param {string} dataDir
 * @returns {UsageFile[]}
 */
function parseFiles(dataDir) {
  console.log("Reading files from " + dataDir);
  return readdirSync(dataDir)
    .filter((filename) => filename.endsWith(".json"))
    .map((filename) => parseFile(join(dataDir, filename)))
    .sort(
      (a, b) =>
        Date.parse(a.supplyPoints[0].startDate) -
        Date.parse(b.supplyPoints[0].startDate)
    );
}

/**
 * @param {UsageFile[]} files
 * @returns {HourUsageRow[]}
 */
function getRowsFromFiles(files) {
  console.log("Converting file contents to rows");
  /** @type {Usage[]} */
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
 * @param {HourUsageRow[]} rows
 * @returns {string}
 */
function toCsvString(rows) {
  console.log("Converting rows to CSV");
  let contents = '"startDate", "usage", "cost"\n';
  for (const { startDate, usage, cost } of rows) {
    contents += toCsvRow([startDate, usage, cost]) + "\n";
  }
  return contents;
}

/**
 * @param {HourUsageRow[]} rows
 * @param {string} outputPath output file path
 */
function writeCsv(rows, outputPath) {
  const csv = toCsvString(rows);
  console.log("Writing CSV output to " + outputPath);
  writeFileSync(outputPath, csv, { encoding: "utf8" });
}

/**
 * Writes out usage rows without the cost.
 *
 *  @param {HourUsageRow[]} rows
 * @param {string} outputPath output file path
 */
function writeJson(rows, outputPath) {
  console.log("Writing JSON output to " + outputPath);
  const json = JSON.stringify(
    rows.map(({ startDate, usage }) => ({ startDate, usage }))
  );
  writeFileSync(outputPath, json, { encoding: "utf8" });
}
