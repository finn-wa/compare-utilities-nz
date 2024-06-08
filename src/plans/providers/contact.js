import {
  daily,
  dailyRate,
  electricityPlan,
  gasPlan,
  hours,
  weekends,
} from "../utils.js";

const provider = "Contact";

/** @type {Object.<string, import("../types.js").Rate>} */
const rates = {
  standardUserDaily: dailyRate(21_574),
  lowUserDaily: dailyRate(27_669),
  goodWeekends: {
    days: weekends,
    hours: [hours(9, 17)],
    millicents: 0,
    special: true,
  },
  goodNights: {
    days: daily,
    hours: [hours(21, 24)],
    millicents: 0,
    special: true,
  },
};

// Base electricity plans
const contactStandardUserElectricity = electricityPlan({
  id: "contactStandardUserElectricity",
  provider,
  name: "Electricity",
  variant: "Std",
  dailyMillicents: 237_400,
  rates: [rates.standardUserDaily],
  bundle: [],
});
const contactLowUserElectricity = electricityPlan({
  id: "contactLowUserElectricity",
  provider,
  name: "Electricity",
  variant: "Low",
  dailyMillicents: 103_500,
  rates: [rates.lowUserDaily],
  bundle: [],
});

// Good Weekends
/** @type {import("../types.js").ElectricityPlan} */
export const contactGoodWeekendsStandardUserElectricity = {
  ...contactStandardUserElectricity,
  id: "contactGoodWeekendsStandardUserElectricity",
  name: "Electricity - Good Weekends",
  rates: [rates.standardUserDaily, rates.goodWeekends],
};
/** @type {import("../types.js").ElectricityPlan} */
export const contactGoodWeekendsLowUserElectricity = {
  ...contactLowUserElectricity,
  id: "contactGoodWeekendsLowUserElectricity",
  name: "Electricity - Good Weekends",
  rates: [rates.lowUserDaily, rates.goodWeekends],
};

// Good Nights
/** @type {import("../types.js").ElectricityPlan} */
export const contactGoodNightsStandardUserElectricity = {
  ...contactStandardUserElectricity,
  id: "contactGoodNightsStandardUserElectricity",
  name: "Electricity - Good Nights",
  rates: [rates.standardUserDaily, rates.goodNights],
};
/** @type {import("../types.js").ElectricityPlan} */
export const contactGoodNightsLowUserElectricity = {
  ...contactLowUserElectricity,
  id: "contactGoodNightsLowUserElectricity",
  name: "Electricity - Good Nights",
  rates: [rates.lowUserDaily, rates.goodNights],
};

// Gas
export const contactLivingSmartGas = gasPlan({
  id: "contactLivingSmartGas",
  provider,
  name: "Gas - Living Smart",
  dailyMillicents: 176_874,
  kwhMillicents: 8_188,
  bundle: [],
});
