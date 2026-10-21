// Actual Platform=web rows. An absent row is not a confirmed zero.
import type { MetricSeries } from './data.ts';
export const webCapturedAt = "2026-10-21T15:53:52+09:00";
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
      }
    ]
  }
];
