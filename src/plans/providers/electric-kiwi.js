import { daily, weekdays, weekends } from "../utils.js";

const moveMasterPeak = {
  name: "Peak",
  days: weekdays,
  hours: [
    { start: 7, end: 9 },
    { start: 17, end: 21 },
  ],
};
const moveMasterShoulderWeekdays = {
  name: "Off-peak shoulder (weekdays)",
  days: weekdays,
  hours: [
    { start: 9, end: 17 },
    { start: 21, end: 23 },
  ],
};
const moveMasterShoulderWeekends = {
  name: "Off-peak shoulder (weekends)",
  days: weekends,
  hours: [{ start: 7, end: 23 }],
};
const moveMasterOffPeak = {
  name: "Off-peak night",
  days: daily,
  hours: [
    { start: 23, end: 24 },
    { start: 0, end: 7 },
  ],
};
const hourOfPower = {
  name: "Hour of Power",
  days: daily,
  hours: [{ start: 21, end: 22 }],
  millicents: 0,
  special: true,
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiMoveMasterLowUser = {
  id: "electricKiwiMoveMasterLowUser",
  provider: "Electric Kiwi",
  name: "MoveMaster",
  variant: "Low User",
  bundle: [],
  dailyMillicents: 69000,
  rates: [
    {
      ...moveMasterPeak,
      millicents: 45500,
    },
    {
      ...moveMasterShoulderWeekdays,
      millicents: 31850,
    },
    {
      ...moveMasterShoulderWeekends,
      millicents: 31850,
    },
    {
      ...moveMasterOffPeak,
      millicents: 22750,
    },
    hourOfPower,
  ],
};

/** @type {import("../types.js").ElectricityPlan} */
export const electricKiwiMoveMasterStandardUser = {
  id: "electricKiwiMoveMasterStandardUser",
  provider: "Electric Kiwi",
  name: "MoveMaster",
  variant: "Standard User",
  bundle: [],
  dailyMillicents: 254_000,
  rates: [
    {
      ...moveMasterPeak,
      millicents: 32_520,
    },
    {
      ...moveMasterShoulderWeekdays,
      millicents: 22_770,
    },
    {
      ...moveMasterShoulderWeekends,
      millicents: 22_770,
    },
    {
      ...moveMasterOffPeak,
      millicents: 16_260,
    },
    hourOfPower,
  ],
};
