import { dailyRate } from "../utils.js";

const provider = "Mercury";

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryOpenTermLowUserElectricity = {
  id: "mercuryOpenTermLowUserElectricity",
  provider,
  name: "Electricity - Open Term",
  variant: "Low User, Anytime",
  dailyMillicents: 138_000,
  rates: [dailyRate(21_660)],
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryFixedTermLowUserElectricity = {
  id: "mercuryFixedTermLowUserElectricity",
  provider,
  name: "Electricity - Fixed Term - 1 year, $300 credit",
  variant: "Low User, Anytime",
  dailyMillicents: 138_000,
  rates: [dailyRate(29_330)],
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryOpenTermStandardUserElectricity = {
  id: "mercuryOpenTermStandardUserElectricity",
  provider,
  name: "Electricity - Open Term",
  variant: "Standard User, Anytime",
  dailyMillicents: 194_350,
  rates: [dailyRate(19_090)],
  bundle: [],
};

/** @type {import("../types.js").ElectricityPlan} */
export const mercuryFixedTermStandardUserElectricity = {
  id: "mercuryFixedTermLowUserElectricity",
  provider,
  name: "Electricity - Fixed Term - 1 year, $300 credit",
  variant: "Standard User, Anytime",
  dailyMillicents: 276_000,
  rates: [dailyRate(23_040)],
  bundle: [],
};

/**
 * 15 cents + GST discount per day for having both gas & power with Mercury.
 * @param {number} mc
 */
const dualFuelDiscount = (mc) => mc - 15_000 * 1.15;

/** @type {import("../types.js").PipedGasPlan} */
export const mercuryOpenTermStandardUserGas = {
  id: "mercuryOpenTermStandardUserGas",
  provider,
  name: "Gas - Open Term",
  variant: "Standard User",
  dailyMillicents: dualFuelDiscount(161_000),
  kwhMillicents: 11_460,
  bundle: ["electricity"],
};

/** @type {import("../types.js").PipedGasPlan} */
export const mercuryOpenTermLowUserGas = {
  id: "mercuryOpenTermLowUserGas",
  provider,
  name: "Gas - Open Term",
  variant: "Low User",
  dailyMillicents: dualFuelDiscount(143_750),
  kwhMillicents: 13_060,
  bundle: ["electricity"],
};

/**
 * Note that to sign up for gas only you have to call them - so this rate may be inaccurate.
 * @type {import("../types.js").PipedGasPlan}
 */
export const mercuryOpenTermLowUserGasUnbundled = {
  id: "mercuryOpenTermLowUserGas",
  provider,
  name: "Gas - Open Term",
  variant: "Low User",
  dailyMillicents: 143_750,
  kwhMillicents: 13_060,
  bundle: [],
};
