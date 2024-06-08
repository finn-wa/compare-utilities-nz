import { dailyRate, electricityPlan, gasPlan } from "../utils.js";

export const frankLowUser = electricityPlan({
  id: "frankLowUser",
  provider: "Frank",
  name: "Electricity",
  variant: "Low",
  dailyMillicents: 69_000,
  bundle: [],
  rates: [dailyRate(26_220)],
});

export const frankStandardUser = electricityPlan({
  id: "frankStandardUser",
  provider: "Frank",
  name: "Electricity",
  variant: "Std",
  dailyMillicents: 155_250,
  bundle: [],
  rates: [dailyRate(22_310)],
});

export const frankGasBundled = gasPlan({
  id: "frankGasBundled",
  provider: "Frank",
  name: "Piped Gas",
  variant: "Bundled",
  dailyMillicents: 184_000,
  kwhMillicents: 8_970,
  bundle: ["electricity"],
});

export const frankGasUnbundled = gasPlan({
  id: "frankGasUnbundled",
  provider: "Frank",
  name: "Piped Gas",
  variant: "Unbundled",
  dailyMillicents: 284_000,
  kwhMillicents: 8_970,
  bundle: [],
});
