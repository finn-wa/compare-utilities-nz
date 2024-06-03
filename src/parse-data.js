import { readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";
import { Temporal } from "temporal-polyfill";

/**
 * Reads Frank electricity usage JSON from the input folder and outputs a formatted usage object.
 *
 * @param {string} inputFolder
 * @param {IntervalType} intervalType
 * @returns {UsageDetails}
 */
export function getFrankElectricityUsage(
  inputFolder = "./data/electricity",
  intervalType = "hourly"
) {
  const electricityUsageFiles = parseFrankElectricityUsageFiles(
    inputFolder,
    intervalType
  );
  return {
    intervalType,
    usage: getUsageEntriesFromFiles(electricityUsageFiles),
  };
}

// Input file types
/** @typedef {('hourly'|'daily'|'monthly')} IntervalType */
// Electricity
/**
 * @typedef FrankElectricityUsage
 * @type {object}
 * @property {number} kw
 * @property {number} unroundedCost e.g. 0.136252
 * @property {string} id e.g. "e11a6eb8404241f57435aaec056cdb8e"
 * @property {string} startDate e.g. "2024-05-20T00:00:00+12:00",
 * @property {string} endDate e.g. "2024-05-20T00:59:59+12:00",
 * @property {IntervalType} intervalType e.g. "hourly"
 */
/**
 * @typedef FrankSupplyPoint
 * @type {object}
 * @property {string} id
 * @property {string} startDate
 * @property {string} endDate
 * @property {FrankElectricityUsage[]} usage
 */
/**
 * @typedef FrankElectricityUsageFile
 * @type {object}
 * @property {string} intervalType
 * @property {FrankSupplyPoint[]} supplyPoints Seems to be a single-item array
 */
// Gas
/**
 * @typedef GasConsumptionTotal
 * @type {object}
 * @property {number} kw
 * @property {number} unroundedCost
 */
/**
 * @typedef GasConsumptionEmptyEntry
 * @type {object}
 * @property {'empty'} type
 */
/**
 * @typedef GasConsumptionNonEmptyEntry
 * @type {object}
 * @property {'actual'|'estimated'} type
 * @property {string} startDate
 * @property {string} endDate
 * @property {number} days
 * @property {GasConsumptionTotal} total
 */
/** @typedef {(GasConsumptionEmptyEntry|GasConsumptionNonEmptyEntry)} GasConsumptionEntry */
/**
 * @typedef FrankGasUsageFile
 * @type {object}
 * @property {number} year
 * @property {GasConsumptionEntry[]} consumptionList
 */

// Output types
/**
 * @typedef UsageEntry
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate the start time
 * @property {number} usage usage in kwH
 */
/**
 * @typedef UsageDetails
 * @type {object}
 * @property {IntervalType} intervalType the period of time between usage entries
 * @property {UsageEntry[]} usage usage in chronological order
 
/**
 * @typedef GasUsage
 * @type {object}
 * @property {Temporal.ZonedDateTime} startDate
 * @property {Temporal.ZonedDateTime} endDate
 * @property {number} usage usage in kwH
 */

/**
 * @param {string} file the JSON file from the Frank API
 * @param {IntervalType} intervalType the expected interval type
 * @returns {FrankElectricityUsageFile}
 */
function parseFrankElectricityUsageFile(file, intervalType) {
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
        Temporal.Instant.from(a.supplyPoints[0].startDate).since(
          Temporal.Instant.from(b.supplyPoints[0].startDate)
        ).milliseconds
    );
}

const tz = Temporal.TimeZone.from("Pacific/Auckland");

/**
 * @param {string} date
 * @returns {Temporal.ZonedDateTime}
 */
function parseDate(date) {
  return Temporal.PlainDateTime.from(date).toZonedDateTime(tz);
}

/**
 * @param {FrankSupplyPoint} supplyPoint
 * @returns {UsageEntry[]}
 */
function convertUsageEntries(supplyPoint) {
  return supplyPoint.usage.map((frankUsage) => ({
    startDate: parseDate(frankUsage.startDate),
    usage: frankUsage.kw,
  }));
}

/**
 * @param {FrankElectricityUsageFile[]} files
 * @returns {UsageEntry[]}
 */
function getUsageEntriesFromFiles(files) {
  console.log("Combining usage details from all files");
  if (files.length === 0) {
    throw new Error("At least one file is required");
  }

  let i = 0;
  let supplyPoint = files[i].supplyPoints[0];
  let lastFileEndDate = parseDate(supplyPoint.endDate);
  const allUsage = [...convertUsageEntries(supplyPoint)];

  for (i = 1; i < files.length; i++) {
    supplyPoint = files[i].supplyPoints[0];
    const startDate = parseDate(supplyPoint.startDate);
    const timeSinceLastFile = startDate.since(lastFileEndDate).total("seconds");
    if (timeSinceLastFile !== 1) {
      throw new Error(
        `Expected 1 second between files, found ${timeSinceLastFile} (startDate: ${startDate})`
      );
    }
    allUsage.push(...convertUsageEntries(supplyPoint));
    lastFileEndDate = parseDate(supplyPoint.endDate);
  }

  return allUsage;
}

/**
 * @param {GasConsumptionEntry} entry
 * @returns {entry is GasConsumptionNonEmptyEntry}
 */
const isNonEmptyEntry = (entry) => entry.type !== "empty";

/**
 * @param {string} file path to JSON usage file
 * @returns {GasUsage}
 */
export function getFrankGasUsage(file = "./data/gas/2024.json") {
  /** @type {FrankGasUsageFile} */
  const json = JSON.parse(readFileSync(file, { encoding: "utf8" }));
  const nonEmptyEntries = json.consumptionList.filter(isNonEmptyEntry);
  const usage = nonEmptyEntries.reduce((acc, entry) => acc + entry.total.kw, 0);
  const startDate = nonEmptyEntries.at(0)?.startDate;
  const endDate = nonEmptyEntries.at(-1)?.endDate;
  if (startDate == null || endDate == null) {
    throw new Error("Gas usage file contains no data");
  }
  return {
    startDate: parseDate(startDate),
    endDate: parseDate(endDate),
    usage,
  };
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
    contents += toCsvRow([startDate.toString(), usage]) + "\n";
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
