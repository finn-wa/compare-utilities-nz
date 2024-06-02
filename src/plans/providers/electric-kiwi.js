import { daily, hours, weekdays, weekends } from "../utils.js";

const provider = "Electric Kiwi";

const moveMasterPeak = {
  name: "Peak",
  days: weekdays,
  hours: [hours(7, 9), hours(17, 21)],
};
const moveMasterShoulderWeekdays = {
  name: "Off-peak shoulder (weekdays)",
  days: weekdays,
  hours: [hours(9, 17), hours(21, 23)],
};
const moveMasterShoulderWeekends = {
  name: "Off-peak shoulder (weekends)",
  days: weekends,
  hours: [hours(7, 23)],
};
const moveMasterOffPeak = {
  name: "Off-peak night",
  days: daily,
  hours: [hours(23, 24), hours(0, 7)],
};
const hourOfPower = {
  name: "Hour of Power",
  days: daily,
  hours: [hours(21, 22)],
  millicents: 0,
  special: true,
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
  provider,
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
