import { daily, weekdays, weekends } from "../utils.js";

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
      name: "Peak",
      days: weekdays,
      hours: [
        { start: 7, end: 9 },
        { start: 17, end: 21 },
      ],
      millicents: 45500,
    },
    {
      name: "Off-peak shoulder (weekdays)",
      days: weekdays,
      hours: [
        { start: 9, end: 17 },
        { start: 21, end: 23 },
      ],
      millicents: 31850,
    },
    {
      name: "Off-peak shoulder (weekends)",
      days: weekends,
      hours: [{ start: 7, end: 23 }],
      millicents: 31850,
    },
    {
      name: "Off-peak night",
      days: daily,
      hours: [
        { start: 23, end: 24 },
        { start: 0, end: 7 },
      ],
      millicents: 22750,
    },
    {
      name: "Hour of Power",
      days: daily,
      hours: [{ start: 21, end: 22 }],
      millicents: 0,
      special: true,
    },
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
      name: "Peak",
      days: weekdays,
      hours: [
        { start: 7, end: 9 },
        { start: 17, end: 21 },
      ],
      millicents: 32_520,
    },
    {
      name: "Off-peak shoulder (weekdays)",
      days: weekdays,
      hours: [
        { start: 9, end: 17 },
        { start: 21, end: 23 },
      ],
      millicents: 22_770,
    },
    {
      name: "Off-peak shoulder (weekends)",
      days: weekends,
      hours: [{ start: 7, end: 23 }],
      millicents: 22_770,
    },
    {
      name: "Off-peak night",
      days: daily,
      hours: [
        { start: 23, end: 24 },
        { start: 0, end: 7 },
      ],
      millicents: 16_260,
    },
  ],
};
