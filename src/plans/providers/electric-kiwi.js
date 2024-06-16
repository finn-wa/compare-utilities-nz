import {
  allDay,
  daily,
  electricityPlan,
  hours,
  internetPlan,
  weekdays,
  weekends,
} from "../utils.js";

const provider = "Electric Kiwi";

const peak = {
  name: "Peak",
  days: weekdays,
  hours: [hours(7, 9), hours(17, 21)],
};
const hourOfPower = {
  name: "Hour of Power",
  days: daily,
  hours: [hours(15, 16)],
  millicents: 0,
  special: true,
};

const moveMasterSchedule = {
  peak,
  shoulderWeekdays: {
    name: "Off-Peak Shoulder",
    days: weekdays,
    hours: [hours(9, 17), hours(21, 23)],
  },
  shoulderWeekends: {
    name: "Off-Peak Shoulder",
    days: weekends,
    hours: [hours(7, 23)],
  },
  offPeakNight: {
    name: "Off-Peak Night",
    days: daily,
    hours: [hours(23, 24), hours(0, 7)],
  },
};

const standardSchedule = {
  peak,
  offPeakWeekdays: {
    name: "Off-Peak",
    days: weekdays,
    hours: [hours(9, 17), hours(21, 24), hours(0, 7)],
  },
  offPeakWeekends: {
    name: "Off-Peak",
    days: weekends,
    hours: allDay,
  },
};

export const electricKiwiMoveMasterLowUser = electricityPlan({
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
});

export const electricKiwiMoveMasterStandardUser = electricityPlan({
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
});

export const electricKiwiKiwiLowUser = electricityPlan({
  id: "electricKiwiKiwiLowUser",
  provider,
  name: "Kiwi",
  variant: "Low",
  bundle: [],
  dailyMillicents: 69_000,
  rates: [
    { ...standardSchedule.peak, millicents: 34_630 },
    { ...standardSchedule.offPeakWeekdays, millicents: 25_980 },
    { ...standardSchedule.offPeakWeekends, millicents: 25_980 },
    hourOfPower,
  ],
});

export const electricKiwiKiwiStandardUser = electricityPlan({
  id: "electricKiwiKiwiStandardUser",
  provider,
  name: "Kiwi",
  variant: "Std",
  bundle: [],
  dailyMillicents: 254_000,
  rates: [
    { ...standardSchedule.peak, millicents: 46_070 },
    { ...standardSchedule.offPeakWeekdays, millicents: 34_550 },
    { ...standardSchedule.offPeakWeekends, millicents: 34_550 },
    hourOfPower,
  ],
});

export const electricKiwiPrepay300LowUser = electricityPlan({
  id: "electricKiwiPrepay300LowUser",
  provider,
  name: "Prepay 300",
  variant: "Low",
  bundle: [],
  dailyMillicents: 103_000,
  rates: [
    { ...standardSchedule.peak, millicents: 30_590 },
    { ...standardSchedule.offPeakWeekdays, millicents: 22_940 },
    { ...standardSchedule.offPeakWeekends, millicents: 22_940 },
    hourOfPower,
  ],
});

export const electricKiwiPrepay300StandardUser = electricityPlan({
  id: "electricKiwiPrepay300StandardUser",
  provider,
  name: "Prepay 300",
  variant: "Std",
  bundle: [],
  dailyMillicents: 250_000,
  rates: [
    { ...standardSchedule.peak, millicents: 21_590 },
    { ...standardSchedule.offPeakWeekdays, millicents: 16_200 },
    { ...standardSchedule.offPeakWeekends, millicents: 16_200 },
    hourOfPower,
  ],
});

export const electricKiwiPowerShifterLowUser = electricityPlan({
  id: "electricKiwiPowerShifterLowUser",
  provider,
  name: "PowerShifter",
  variant: "Low",
  bundle: ["internet"],
  dailyMillicents: 103_000,
  rates: [
    { ...standardSchedule.peak, millicents: 30_260 },
    { ...standardSchedule.offPeakWeekdays, millicents: 22_690 },
    { ...standardSchedule.offPeakWeekends, millicents: 22_690 },
    hourOfPower,
  ],
});

export const electricKiwiPowerShifterStandardUser = electricityPlan({
  id: "electricKiwiPowerShifterStandardUser",
  provider,
  name: "powerShifter",
  variant: "Std",
  bundle: ["internet"],
  dailyMillicents: 250_000,
  rates: [
    { ...standardSchedule.peak, millicents: 21_260 },
    { ...standardSchedule.offPeakWeekdays, millicents: 15_950 },
    { ...standardSchedule.offPeakWeekends, millicents: 15_950 },
    hourOfPower,
  ],
});

export const electricKiwiInternet = internetPlan({
  id: "electricKiwiInternet",
  provider,
  name: "Sweet Fibre",
  bundle: ["electricity"],
  monthlyMillicents: 265_000 * 30, // It's a daily rate... so roughly $79.50
});

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
