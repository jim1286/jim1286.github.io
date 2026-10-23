// Actual Platform=web rows. An absent row is not a confirmed zero.
import type { MetricSeries } from './data.ts';
export const webCapturedAt = "2026-10-23T00:18:49.932731+00:00";
export const webSeries: MetricSeries[] = [
  {
    "id": "web-diairy-dau",
    "app": "diairy",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-web",
    "timeZone": null,
    "unit": "users",
    "unique": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-06",
        "value": 1
      },
      {
        "date": "2026-10-09",
        "value": 1
      },
      {
        "date": "2026-10-17",
        "value": 2
      },
      {
        "date": "2026-10-18",
        "value": 1
      },
      {
        "date": "2026-10-22",
        "value": 1,
        "observedOn": "2026-10-23"
      }
    ]
  },
  {
    "id": "web-diairy-new",
    "app": "diairy",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-web",
    "timeZone": null,
    "unit": "users",
    "unique": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-06",
        "value": 1
      },
      {
        "date": "2026-10-09",
        "value": 1
      },
      {
        "date": "2026-10-17",
        "value": 2
      },
      {
        "date": "2026-10-18",
        "value": 1
      },
      {
        "date": "2026-10-22",
        "value": 1,
        "observedOn": "2026-10-23"
      }
    ]
  },
  {
    "id": "web-burntok-dau",
    "app": "burntok",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-web",
    "timeZone": null,
    "unit": "users",
    "unique": true,
    "testTraffic": "not-excluded",
    "coverage": {
      "start": "2026-10-15",
      "end": "2026-10-22"
    },
    "points": [
      {
        "date": "2026-10-15",
        "value": 1,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-17",
        "value": 1,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-18",
        "value": 1,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-21",
        "value": 2,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-22",
        "value": 1,
        "observedOn": "2026-10-23"
      }
    ]
  },
  {
    "id": "web-burntok-new",
    "app": "burntok",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-web",
    "timeZone": null,
    "unit": "users",
    "unique": true,
    "testTraffic": "not-excluded",
    "coverage": {
      "start": "2026-10-15",
      "end": "2026-10-22"
    },
    "points": [
      {
        "date": "2026-10-15",
        "value": 1,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-17",
        "value": 1,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-18",
        "value": 0,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-21",
        "value": 2,
        "observedOn": "2026-10-22"
      },
      {
        "date": "2026-10-22",
        "value": 0,
        "observedOn": "2026-10-23"
      }
    ]
  }
];
