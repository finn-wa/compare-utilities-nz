import { allDay, daily, hours, weekdays, weekends } from "../utils.js";

const provider = "Electric Kiwi";

const peak = {
  name: "Peak",
  days: weekdays,
  hours: [hours(7, 9), hours(17, 21)],
  usageFraction: 0.2848,
};
const hourOfPower = {
  name: "Hour of Power",
  days: daily,
  hours: [hours(21, 22)],
  millicents: 0,
  special: true,
  usageFraction: 0.103,
};

const moveMasterSchedule = {
  peak,
  shoulderWeekdays: {
    name: "Off-peak shoulder (weekdays)",
    days: weekdays,
    hours: [hours(9, 17), hours(21, 23)],
    usageFraction: 0.2782,
  },
  shoulderWeekends: {
    name: "Off-peak shoulder (weekends)",
    days: weekends,
    hours: [hours(7, 23)],
    usageFraction: 0.1,
  },
  offPeakNight: {
    name: "Off-peak night",
    days: daily,
    hours: [hours(23, 24), hours(0, 7)],
    usageFraction: 0.2339,
  },
};

const kiwiSchedule = {
  peak,
  offPeakWeekdays: {
    name: "Off-peak (weekdays)",
    days: weekdays,
    hours: [hours(9, 17), hours(21, 24), hours(0, 7)],
    usageFraction: 0.2782,
  },
  offPeakWeekends: {
    name: "Off-peak (weekends)",
    days: weekends,
    hours: allDay,
    usageFraction: 0.3339,
  },
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiMoveMasterLowUser = {
  id: "electricKiwiMoveMasterLowUser",
  provider,
  name: "MoveMaster",
  variant: "Low",
  bundle: [],
  dailyMillicents: 69000,
  rates: [
    {
      ...moveMasterSchedule.peak,
      millicents: 45500,
    },
    {
      ...moveMasterSchedule.shoulderWeekdays,
      millicents: 31850,
    },
    {
      ...moveMasterSchedule.shoulderWeekends,
      millicents: 31850,
    },
    {
      ...moveMasterSchedule.offPeakNight,
      millicents: 22750,
    },
    hourOfPower,
  ],
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiMoveMasterStandardUser = {
  id: "electricKiwiMoveMasterStandardUser",
  provider,
  name: "MoveMaster",
  variant: "Std",
  bundle: [],
  dailyMillicents: 254_000,
  rates: [
    {
      ...moveMasterSchedule.peak,
      millicents: 32_520,
    },
    {
      ...moveMasterSchedule.shoulderWeekdays,
      millicents: 22_770,
    },
    {
      ...moveMasterSchedule.shoulderWeekends,
      millicents: 22_770,
    },
    {
      ...moveMasterSchedule.offPeakNight,
      millicents: 16_260,
    },
    hourOfPower,
  ],
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiKiwiLowUser = {
  id: "electricKiwiKiwiLowUser",
  provider,
  name: "Kiwi",
  variant: "Low",
  bundle: [],
  dailyMillicents: 69_000,
  rates: [
    { ...kiwiSchedule.peak, millicents: 34_630 },
    { ...kiwiSchedule.offPeakWeekdays, millicents: 25_980 },
    { ...kiwiSchedule.offPeakWeekends, millicents: 25_980 },
  ],
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiKiwiStandardUser = {
  id: "electricKiwiKiwiStandardUser",
  provider,
  name: "Kiwi",
  variant: "Std",
  bundle: [],
  dailyMillicents: 254_000,
  rates: [
    { ...kiwiSchedule.peak, millicents: 46_070 },
    { ...kiwiSchedule.offPeakWeekdays, millicents: 34_550 },
    { ...kiwiSchedule.offPeakWeekends, millicents: 34_550 },
  ],
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiPrepay300LowUser = {
  id: "electricKiwiPrepay300LowUser",
  provider,
  name: "Prepay 300",
  variant: "Low",
  bundle: [],
  dailyMillicents: 103_000,
  rates: [
    { ...kiwiSchedule.peak, millicents: 30_059 },
    { ...kiwiSchedule.offPeakWeekdays, millicents: 22_940 },
    { ...kiwiSchedule.offPeakWeekends, millicents: 22_940 },
  ],
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiPrepay300StandardUser = {
  id: "electricKiwiPrepay300StandardUser",
  provider,
  name: "Prepay 300",
  variant: "Std",
  bundle: [],
  dailyMillicents: 250_000,
  rates: [
    { ...kiwiSchedule.peak, millicents: 21_590 },
    { ...kiwiSchedule.offPeakWeekdays, millicents: 16_200 },
    { ...kiwiSchedule.offPeakWeekends, millicents: 16_200 },
  ],
};

/**
 * @typedef {{ peak: number, shoulder: number, night: number, hourOfPower: number, startDay: string, days: number }} UsageByRate */
/** @type {UsageByRate[]} */
export const ekUsage2023 = [
  {
    startDay: "2023-12-25",
    days: 18,
    peak: 61.98,
    shoulder: 118.87,
    night: 72.46,
    hourOfPower: 14.08,
  },
  {
    startDay: "2023-11-26",
    days: 29,
    peak: 146.92,
    shoulder: 244.24,
    night: 130.37,
    hourOfPower: 40.74,
  },
  {
    startDay: "2023-10-29",
    days: 28,
    peak: 174.6,
    shoulder: 269.18,
    night: 159.16,
    hourOfPower: 62.74,
  },
  {
    startDay: "2023-09-26",
    days: 33,
    peak: 203.46,
    shoulder: 288.19,
    night: 209.55,
    hourOfPower: 106.1,
  },
  {
    startDay: "2023-08-28",
    days: 29,
    peak: 263.92,
    shoulder: 387.48,
    night: 231.82,
    hourOfPower: 130.87,
  },
  {
    startDay: "2023-07-27",
    days: 32,
    peak: 375.65,
    shoulder: 566.54,
    night: 311,
    hourOfPower: 154.98,
  },
  {
    startDay: "2023-06-26",
    days: 31,
    peak: 381.78,
    shoulder: 393.32,
    night: 280.98,
    hourOfPower: 144,
  },
  {
    startDay: "2023-05-29",
    days: 28,
    peak: 245.9,
    shoulder: 230.31,
    night: 235.18,
    hourOfPower: 112.17,
  },
  {
    startDay: "2023-04-26",
    days: 33,
    peak: 360.16,
    shoulder: 411.72,
    night: 222.93,
    hourOfPower: 127.34,
  },
  {
    startDay: "2023-03-27",
    days: 30,
    peak: 239.41,
    shoulder: 283.95,
    night: 164.69,
    hourOfPower: 46.7,
  },
  {
    startDay: "2023-03-08",
    days: 19,
    peak: 124.51,
    shoulder: 170.59,
    night: 82.08,
    hourOfPower: 25.31,
  },
  {
    startDay: "2023-02-26",
    days: 10,
    peak: 59.11,
    shoulder: 87.72,
    night: 52.44,
    hourOfPower: 13.26,
  },
  {
    startDay: "2023-01-29",
    days: 28,
    peak: 194.4,
    shoulder: 308.19,
    night: 172.73,
    hourOfPower: 45.67,
  },
];

function calculateUsageRatios() {
  const totals = ekUsage2023.reduce(
    (acc, { hourOfPower, night, peak, shoulder }) => ({
      hourOfPower: acc.hourOfPower + hourOfPower,
      night: acc.night + night,
      peak: acc.peak + peak,
      shoulder: acc.shoulder + shoulder,
    }),
    { hourOfPower: 0, night: 0, peak: 0, shoulder: 0 }
  );
  const total =
    totals.hourOfPower + totals.night + totals.peak + totals.shoulder;
  const ratios = {
    hourOfPower: totals.hourOfPower / total,
    night: totals.night / total,
    peak: totals.peak / total,
    shoulder: totals.shoulder / total,
  };
  console.table(ratios);
}
