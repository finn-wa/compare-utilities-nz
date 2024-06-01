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
 * @property {boolean} [special] signals that this is a rate that can apply
 *    instead of another rate in the same time-slot
 * @property {string} [name] Optional name for this rate
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
 * @property {string} [variant] Optional variant (e.g. "Low User")
 */
/**
 * @typedef {('electricity'|'gas'|'internet')} ServiceType
 */
