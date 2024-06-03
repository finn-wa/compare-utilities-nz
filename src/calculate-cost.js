/**
 * Returns the rate with the lowest millicent value.
 * @param {import("./plans/types.js").Rate[]} rates a non-empty array of rates
 * @returns {import("./plans/types.js").Rate} the best rate
 */
function getBestRate(rates) {
  if (rates.length === 1) {
    return rates[0];
  }
  /** @type {(import("./plans/types.js").Rate | null)} */
  let bestRate = null;
  for (const rate of rates) {
    if (bestRate === null || rate.millicents < bestRate.millicents) {
      bestRate = rate;
    }
  }
  if (bestRate === null) {
    throw new Error("Received an empty array of rates!");
  }
  return bestRate;
}

/**
 * @param {import("./plans/types.js").ElectricityPlan} plan
 * @param {import("./parse-data.js").UsageEntry} entry
 * @returns {number} cost in millicents
 */
export function calculateHourlyUsageEntryCost(entry, plan) {
  const { dayOfWeek, hour } = entry.startDate;
  const applicableRates = plan.rates.filter((rate) => {
    /** @type {number[]} */
    const days = rate.days;
    return (
      days.includes(dayOfWeek) &&
      rate.hours.some(({ start, end }) => start <= hour && hour < end)
    );
  });
  // Make sure that there aren't any overlapping non-special rates
  const nonSpecialRates = applicableRates.filter((rate) => !rate.special);
  if (nonSpecialRates.length !== 1) {
    let errorMsg = `(Plan: ${plan.id}) There must only be one applicable rate, but ${nonSpecialRates.length} were found for entry with start date ${entry.startDate}`;
    if (nonSpecialRates.length > 1) {
      const rateNames = nonSpecialRates
        .map((rate) => rate.name ?? "unnamed")
        .join(", ");
      errorMsg += `: (${rateNames})`;
    }
    throw new Error(errorMsg);
  }
  const bestRate = getBestRate(applicableRates);
  const variableCost = Math.round(bestRate.millicents * entry.usage);
  const fixedCost = plan.dailyMillicents / entry.startDate.hoursInDay;
  return variableCost + fixedCost;
}

/**
 * @param {import("./parse-data.js").UsageDetails} usageDetails
 * @param {import("./plans/types.js").ElectricityPlan} plan
 */
export function calculateCost({ intervalType, usage }, plan) {
  if (intervalType !== "hourly") {
    throw new Error(
      `Unsupported intervalType: "${intervalType}" (must be "hourly")`
    );
  }
  const cost = usage.reduce(
    (acc, entry) => acc + calculateHourlyUsageEntryCost(entry, plan),
    0
  );
  return cost;
}
