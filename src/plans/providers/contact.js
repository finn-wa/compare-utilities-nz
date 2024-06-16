import {
  $ToMc,
  daily,
  dailyRate,
  electricityPlan,
  gasPlan,
  hours,
  internetPlan,
  weekends,
} from "../utils.js";
/** @import { ElectricityPlan, Rate } from "../types.js" */

const provider = "Contact";

/** @type {Object.<string, Rate>} */
const rates = {
  standardUserDaily: dailyRate(21_574),
  lowUserDaily: dailyRate(27_669),
  goodWeekends: {
    days: weekends,
    hours: [hours(9, 17)],
    millicents: 0,
    special: true,
    name: "Good Weekends",
  },
  goodNights: {
    days: daily,
    hours: [hours(21, 24)],
    millicents: 0,
    special: true,
    name: "Good Nights",
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
/** @type {ElectricityPlan} */
export const contactGoodWeekendsStandardUserElectricity = {
  ...contactStandardUserElectricity,
  id: "contactGoodWeekendsStandardUserElectricity",
  name: "Electricity - Good Weekends",
  rates: [rates.standardUserDaily, rates.goodWeekends],
};
/** @type {ElectricityPlan} */
export const contactGoodWeekendsLowUserElectricity = {
  ...contactLowUserElectricity,
  id: "contactGoodWeekendsLowUserElectricity",
  name: "Electricity - Good Weekends",
  rates: [rates.lowUserDaily, rates.goodWeekends],
};

// Good Nights
/** @type {ElectricityPlan} */
export const contactGoodNightsStandardUserElectricity = {
  ...contactStandardUserElectricity,
  id: "contactGoodNightsStandardUserElectricity",
  name: "Electricity - Good Nights",
  rates: [rates.standardUserDaily, rates.goodNights],
};
/** @type {ElectricityPlan} */
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

// Internet
export const contactFastFibre = internetPlan({
  id: "contactFastFibre",
  provider,
  name: "Fast Fibre",
  bundle: ["electricity"],
  monthlyMillicents: $ToMc(70),
});
