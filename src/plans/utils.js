/** @type {import("./types.js").Day[]} */
export const weekdays = [1, 2, 3, 4, 5];
/** @type {import("./types.js").Day[]} */
export const weekends = [6, 7];
/** @type {import("./types.js").Day[]} */
export const daily = [1, 2, 3, 4, 5, 6, 7];
/** @type {import("./types.js").HourInterval[]} */
export const allDay = [{ start: 0, end: 24 }];

/**
 * Returns an array containing a single rate that applies all day, every day of
 * the week.
 *
 * @param {number} millicents price per kwH
 * @returns {import("./types.js").Rate[]}
 */
export function dailyRate(millicents) {
  return [{ days: daily, hours: allDay, millicents }];
}
