import { readFileSync } from "fs";

const auth = readFileSync("./data/auth.txt", { encoding: "utf8" });
await printData("2024-01-01", "2024-06-01", auth);

/**
 * @param {string} startDate
 * @param {string} endDate
 * @param {string} auth
 */
async function printData(startDate, endDate, auth) {
  const responseBody = await fetch(
    `https://api.electrickiwi.co.nz/consumption/averages/92878882/465733/?start_date=${startDate}&end_date=${endDate}&group_by=day`,
    {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:126.0) Gecko/20100101 Firefox/126.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        Authorization: auth,
      },
      referrer: "https://my.electrickiwi.co.nz/",
      method: "GET",
      mode: "cors",
    }
  ).then((res) => res.json());
  console.log(responseBody);
}
