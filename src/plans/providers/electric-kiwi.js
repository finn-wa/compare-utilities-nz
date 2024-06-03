import { allDay, daily, hours, weekdays, weekends } from "../utils.js";

const provider = "Electric Kiwi";

const peak = {
  name: "Peak",
  days: weekdays,
  hours: [hours(7, 9), hours(17, 21)],
};
const hourOfPower = {
  name: "Hour of Power",
  days: daily,
  hours: [hours(21, 22)],
  millicents: 0,
  special: true,
};

const moveMasterSchedule = {
  peak,
  shoulderWeekdays: {
    name: "Off-peak shoulder (weekdays)",
    days: weekdays,
    hours: [hours(9, 17), hours(21, 23)],
  },
  shoulderWeekends: {
    name: "Off-peak shoulder (weekends)",
    days: weekends,
    hours: [hours(7, 23)],
  },
  offPeakNight: {
    name: "Off-peak night",
    days: daily,
    hours: [hours(23, 24), hours(0, 7)],
  },
};

const kiwiSchedule = {
  peak,
  offPeakWeekdays: {
    name: "Off-peak (weekdays)",
    days: weekdays,
    hours: [hours(9, 17), hours(21, 24), hours(0, 7)],
  },
  offPeakWeekends: {
    name: "Off-peak (weekends)",
    days: weekends,
    hours: allDay,
  },
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiMoveMasterLowUser = {
  id: "electricKiwiMoveMasterLowUser",
  provider,
  name: "MoveMaster",
  variant: "Low User",
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
  variant: "Standard User",
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
  variant: "Low User",
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
  variant: "Standard User",
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
  variant: "Low User",
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
  variant: "Standard User",
  bundle: [],
  dailyMillicents: 250_000,
  rates: [
    { ...kiwiSchedule.peak, millicents: 21_590 },
    { ...kiwiSchedule.offPeakWeekdays, millicents: 16_200 },
    { ...kiwiSchedule.offPeakWeekends, millicents: 16_200 },
  ],
};
