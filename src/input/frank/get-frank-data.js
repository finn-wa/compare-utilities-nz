import { readFileSync } from "fs";
import { Temporal } from "temporal-polyfill";
import { writeJson } from "../../plans/utils.js";

await getFrankHourlyElectricityData();

async function getFrankHourlyElectricityData() {
  const auth = readFileSync("./data/auth.txt", { encoding: "utf8" });
  const rangeStart = Temporal.PlainDate.from("2024-01-13");
  const rangeEnd = Temporal.PlainDate.from("2024-06-01");
  let startDate = rangeStart;

  while (startDate.dayOfYear < rangeEnd.dayOfYear) {
    // Start and end date are both inclusive
    // Max hours of data is 100
    const endDate = startDate.add({ days: 3 });
    const response = await requestUsage(
      {
        startDate: startDate.toString(),
        endDate: endDate.toString(),
        intervalType: "HOURLY",
      },
      auth
    );
    writeJson(
      response,
      `./data/electricity/${startDate.toString()}_${endDate.toString()}.json`
    );
    startDate = endDate.add({ days: 1 });
  }
}

/**
 * @param {{ startDate: string; endDate: string;  intervalType: string; }} body
 * @param {string} authorization
 * @returns {Promise<import("./parse-frank-data.js").FrankElectricityUsageFile>}
 */
async function requestUsage(body, authorization) {
  const bodyStr = JSON.stringify(body);
  console.log("Sending request: " + bodyStr);
  const response = await fetch(
    "https://web-api.energyonline.co.nz/v2/private/electricity/site-usage",
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
        Accept: "application/json",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        Authorization: authorization,
        "Brand-Id": "GEOL",
        "Cache-Control": "no-cache,no-store,must-revalidate,max-age=0",
        Pragma: "no-cache",
        Expires: "0",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        Priority: "u=1",
      },
      referrer: "https://myaccount.frankenergy.co.nz/",
      body: bodyStr,
      method: "POST",
      mode: "cors",
    }
  );
  return response.json();
}
