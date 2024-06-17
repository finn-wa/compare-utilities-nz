import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

/** @typedef {{start_date: string, end_date: string, invoice_total_charges_incl_gst: number}} Bill */

const dataDir = "./data/ek-bills";

console.log("Reading files from " + dataDir);
const allBills = readdirSync(dataDir)
  .flatMap((filename) => parseBill(join(dataDir, filename)))
  .sort((a, b) => a.start_date.localeCompare(b.start_date));
writeCsv(allBills);
console.log("done");

/**
 * @param {string} path
 * @returns {Bill[]}
 */
function parseBill(path) {
  console.log("Reading " + path);
  const billJson = JSON.parse(readFileSync(path, { encoding: "utf8" }));
  return billJson.data.bills;
}

/**
 * @param {Bill[]} bills
 */
function writeCsv(bills) {
  let out = `"start_date", "end_date", "invoice_total_charges_incl_gst"\n`;
  for (const bill of bills) {
    out += `${bill.start_date}, ${bill.end_date}, ${bill.invoice_total_charges_incl_gst}\n`;
  }
  writeFileSync("./bills.csv", out, { encoding: "utf8" });
}
