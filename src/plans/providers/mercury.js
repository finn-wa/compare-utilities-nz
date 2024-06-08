import { dailyRate, electricityPlan, gasPlan } from "../utils.js";

const provider = "Mercury";

// All electricity plans have "Anytime" pricing

export const mercuryOpenTermLowUserElectricity = electricityPlan({
  id: "mercuryOpenTermLowUserElectricity",
  provider,
  name: "Electricity - Open Term",
  variant: "Low",
  dailyMillicents: 138_000,
  rates: [dailyRate(21_660)],
  bundle: [],
});

export const mercuryFixedTermLowUserElectricity = electricityPlan({
  id: "mercuryFixedTermLowUserElectricity",
  provider,
  name: "Electricity - Fixed Term - 1 year, $300 credit",
  variant: "Low",
  dailyMillicents: 138_000,
  rates: [dailyRate(29_330)],
  bundle: [],
});

export const mercuryOpenTermStandardUserElectricity = electricityPlan({
  id: "mercuryOpenTermStandardUserElectricity",
  provider,
  name: "Electricity - Open Term",
  variant: "Std",
  dailyMillicents: 194_350,
  rates: [dailyRate(19_090)],
  bundle: [],
});

export const mercuryFixedTermStandardUserElectricity = electricityPlan({
  id: "mercuryFixedTermLowUserElectricity",
  provider,
  name: "Electricity - Fixed Term - 1 year, $300 credit",
  variant: "Std",
  dailyMillicents: 276_000,
  rates: [dailyRate(23_040)],
  bundle: [],
});

/**
 * 15 cents + GST discount per day for having both gas & power with Mercury.
 * @param {number} mc
 */
const dualFuelDiscount = (mc) => mc - 15_000 * 1.15;

export const mercuryOpenTermStandardUserGas = gasPlan({
  id: "mercuryOpenTermStandardUserGas",
  provider,
  name: "Gas - Open Term",
  variant: "Std",
  dailyMillicents: dualFuelDiscount(161_000),
  kwhMillicents: 11_460,
  bundle: ["electricity"],
});

export const mercuryOpenTermLowUserGas = gasPlan({
  id: "mercuryOpenTermLowUserGas",
  provider,
  name: "Gas - Open Term",
  variant: "Low",
  dailyMillicents: dualFuelDiscount(143_750),
  kwhMillicents: 13_060,
  bundle: ["electricity"],
});

/**
 * Note that to sign up for gas only you have to call them - so this rate may be inaccurate.
 */
export const mercuryOpenTermLowUserGasUnbundled = gasPlan({
  id: "mercuryOpenTermLowUserGas",
  provider,
  name: "Gas - Open Term",
  variant: "Low",
  dailyMillicents: 143_750,
  kwhMillicents: 13_060,
  bundle: [],
});
