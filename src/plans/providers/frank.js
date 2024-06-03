import { dailyRate } from "../utils.js";

/** @type {import("../types.js").ElectricityPlan} */
export const frankLowUser = {
  id: "frankLowUser",
  provider: "Frank",
  name: "Electricity",
  variant: "Low",
  dailyMillicents: 69_000,
  bundle: [],
  rates: [dailyRate(26_220)],
};

/** @type {import("../types.js").ElectricityPlan} */
export const frankStandardUser = {
  id: "frankStandardUser",
  provider: "Frank",
  name: "Electricity",
  variant: "Std",
  dailyMillicents: 155_250,
  bundle: [],
  rates: [dailyRate(22_310)],
};

/** @type {import("../types.js").PipedGasPlan} */
export const frankGasBundled = {
  id: "frankGasBundled",
  provider: "Frank",
  name: "Piped Gas",
  variant: "Bundled",
  dailyMillicents: 184_000,
  kwhMillicents: 8_970,
  bundle: ["electricity"],
};

/** @type {import("../types.js").PipedGasPlan} */
export const frankGasUnbundled = {
  id: "frankGasUnbundled",
  provider: "Frank",
  name: "Piped Gas",
  variant: "Unbundled",
  dailyMillicents: 284_000,
  kwhMillicents: 8_970,
  bundle: [],
};
