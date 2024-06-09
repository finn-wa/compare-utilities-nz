import {
  allDay,
  dailyRate,
  electricityPlan,
  hours,
  weekdays,
  weekends,
} from "../utils.js";

const provider = "Flick";

export const flickFlatLow = electricityPlan({
  id: "flickFlatLow",
  provider,
  name: "Flat",
  variant: "Low",
  bundle: [],
  dailyMillicents: 105_800,
  rates: [dailyRate(24_140)],
});

export const flickFlatStandard = electricityPlan({
  id: "flickFlatStandard",
  provider,
  name: "Flat",
  variant: "Std",
  bundle: [],
  dailyMillicents: 270_250,
  rates: [dailyRate(16_640)],
});

const rates = {
  peak: {
    days: weekdays,
    hours: [hours(7, 11), hours(17, 21)],
  },
  offPeakWeekdays: {
    days: weekdays,
    hours: [hours(0, 7), hours(11, 17), hours(21, 24)],
  },
  offPeakWeekends: {
    days: weekends,
    hours: allDay,
  },
};

export const flickOffPeakLow = electricityPlan({
  id: "flickOffPeakLow",
  provider,
  name: "Off Peak",
  variant: "Low",
  bundle: [],
  dailyMillicents: 105_800,
  rates: [
    { ...rates.peak, millicents: 31_010 },
    { ...rates.offPeakWeekdays, millicents: 20_920 },
    { ...rates.offPeakWeekends, millicents: 20_920 },
  ],
});

export const flickOffPeakStandard = electricityPlan({
  id: "flickOffPeakStandard",
  provider,
  name: "Off Peak",
  variant: "Std",
  bundle: [],
  dailyMillicents: 270_250,
  rates: [
    { ...rates.peak, millicents: 23_520 },
    { ...rates.offPeakWeekdays, millicents: 13_430 },
    { ...rates.offPeakWeekends, millicents: 13_430 },
  ],
});
