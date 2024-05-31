/**
 * A start-inclusive, end-exclusive interval representing a period of time in a
 * day. Intervals cannot pass over midnight - instead use two intervals.
 * @typedef {Object} HourInterval
 * @property {number} start Starting hour (0-23). The time period starts at the
 *    first millisecond of this hour. Must be less than end.
 * @property {number} end End hour (1-24). The time period ends at the
 *    millisecond before the beginning of this hour. Must be greater than start.
 */
/** @typedef {(1|2|3|4|5|6|7)} Day A day of the week (1=Monday, 7=Sunday). */
/**
 * A price per kwH that applies at a certain time
 * @typedef {Object} Rate
 * @property {Day[]} days Days this rate applies.
 * @property {HourInterval[]} hours Periods of time in which this rate applies.
 * @property {number} millicents Cost per kwH in millicents. A millicent is a
 *    fictional unit of currency equal to 1/1000 of a cent, or 1/100,000 of a
 *    dollar. Electric Kiwi gives prices in 1/10,000ths of a dollar so this is
 *    what I came up with to avoid floating point errors.
 * @property {string} [name] Optional name for this rate
 */
/**
 * @typedef {('electricity'|'gas'|'internet')} ServiceType
 */
/**
 * An electricity plan
 * @typedef {Object} ElectricityPlan
 * @property {string} id unique identifier for the plan
 * @property {string} provider Name of the provider
 * @property {string} name Name of the plan
 * @property {Rate[]} rates Rates per kwH
 * @property {number} dailyMillicents Fixed cost in millicents
 * @property {ServiceType[]} bundle Required bundled services (may be empty)
 * @property {string} [variant] Optional variant (e.g. "Low User")
 */
/**
 * A piped gas plan
 * @typedef {Object} PipedGasPlan
 * @property {string} id unique identifier for the plan
 * @property {string} provider Name of the provider
 * @property {string} name Name of the plan
 * @property {number} kwhMillicents Cost per kwH in millicents
 * @property {number} dailyMillicents Fixed cost in millicents
 * @property {ServiceType[]} bundle Required bundled services (may be empty)
 * @property {string} [variant] Optional variant (e.g. "Low User") */

/**
 * @param {number} mc
 * @returns {number} dollar value
 */
function millicentsToDollars(mc) {
  return mc * 100_000;
}

/** @type {Day[]} */
const weekdays = [1, 2, 3, 4, 5];
/** @type {Day[]} */
const weekends = [6, 7];
/** @type {Day[]} */
const daily = [1, 2, 3, 4, 5, 6, 7];
/** @type {HourInterval[]} */
const allDay = [{ start: 0, end: 23 }];

/**
 * Returns an array containing a single rate that applies all day, every day of
 * the week.
 *
 * @param {number} millicents price per kwH
 * @returns {Rate[]}
 */
function dailyRate(millicents) {
  return [{ days: daily, hours: allDay, millicents }];
}

/** @type {ElectricityPlan[]}} */
export const electricityPlans = [
  {
    id: "electricKiwiMoveMasterLowUser",
    provider: "Electric Kiwi",
    name: "MoveMaster",
    variant: "Low User",
    bundle: [],
    dailyMillicents: 69_000,
    rates: [
      {
        name: "Peak",
        days: weekdays,
        hours: [
          { start: 7, end: 9 },
          { start: 17, end: 21 },
        ],
        millicents: 45_500,
      },
      {
        name: "Off-peak shoulder (weekdays)",
        days: weekdays,
        hours: [
          { start: 9, end: 17 },
          { start: 21, end: 23 },
        ],
        millicents: 31_850,
      },
      {
        name: "Off-peak shoulder (weekends)",
        days: weekends,
        hours: [{ start: 7, end: 23 }],
        millicents: 31_850,
      },
      {
        name: "Off-peak night",
        days: daily,
        hours: [
          { start: 23, end: 24 },
          { start: 0, end: 7 },
        ],
        millicents: 22_750,
      },
    ],
  },
  {
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
  },
  {
    id: "frankLowUser",
    provider: "Frank",
    name: "Electricity",
    variant: "Low User",
    dailyMillicents: 69_000,
    bundle: [],
    rates: dailyRate(26_220),
  },
  {
    id: "frankStandardUser",
    provider: "Frank",
    name: "Electricity",
    variant: "Standard User",
    dailyMillicents: 155_250,
    bundle: [],
    rates: dailyRate(22_310),
  },
];

/** @type {PipedGasPlan[]} */
export const gasPlans = [
  {
    id: "frankGasBundled",
    provider: "Frank",
    name: "Piped Gas",
    variant: "(with electricity)",
    dailyMillicents: 184_000,
    kwhMillicents: 8_970,
    bundle: ["electricity"],
  },
  {
    id: "frankGasUnbundled",
    provider: "Frank",
    name: "Piped Gas",
    variant: "(without electricity)",
    dailyMillicents: 284_000,
    kwhMillicents: 8_970,
    bundle: [],
  },
];
