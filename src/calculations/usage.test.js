import { Temporal } from "temporal-polyfill";

// describe()

/**
 * @returns {import("./types.js").UsageEntry[]}
 */
function getSampleUsageEntries() {
  return [
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T00:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T01:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.2,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T02:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T03:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.19,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T04:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.19,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T05:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T06:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T07:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.67,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T08:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.52,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T09:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 1.25,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T10:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T11:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.19,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T12:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.19,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T13:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T14:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.2,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T15:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T16:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.2,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T17:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.18,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T18:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.19,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T19:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.63,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T20:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.53,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T21:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.5,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T22:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.53,
    },
    {
      startDate: Temporal.ZonedDateTime.from(
        "2024-06-01T23:00:00+12:00[Pacific/Auckland]"
      ),
      usage: 0.19,
    },
  ];
}
