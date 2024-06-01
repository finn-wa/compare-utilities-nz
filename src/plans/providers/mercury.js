import { dailyRate } from "../utils.js";

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryOpenTermLowUse = {
  id: "mercuryOpenTermLowUse",
  provider: "Mercury",
  name: "Open Term",
  variant: "Low Use, Anytime",
  dailyMillicents: 138_000,
  rates: dailyRate(21_660),
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryFixedTermLowUse = {
  id: "mercuryFixedTermLowUse",
  provider: "Mercury",
  name: "Fixed Term - 1 year, $300 credit",
  variant: "Low Use, Anytime",
  dailyMillicents: 138_000,
  rates: dailyRate(29_330),
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryOpenTermStandardUse = {
  id: "mercuryOpenTermStandardUse",
  provider: "Mercury",
  name: "Open Term",
  variant: "Standard Use, Anytime",
  dailyMillicents: 194_350,
  rates: dailyRate(19_090),
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryFixedTermStandardUse = {
  id: "mercuryFixedTermLowUse",
  provider: "Mercury",
  name: "Fixed Term - 1 year, $300 credit",
  variant: "Standard Use, Anytime",
  dailyMillicents: 276_000,
  rates: dailyRate(23_040),
  bundle: [],
};
