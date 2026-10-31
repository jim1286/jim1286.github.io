// Public aggregate projection from the historical evidence listed in docs/PERFORMANCE.md.
// Original console links, property IDs and evidence rows are deliberately not imported.
import type { MetricSeries } from './data';
// Includes the latest independently observed AdMob Network report.
export const historicalCapturedAt = "2026-10-31T08:54:03+09:00";
export const historicalSeries: MetricSeries[] = [
  {
    "id": "choose-window-ga4-dau",
    "app": "choose-window",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 4,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 1,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 2,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 1,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 2,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "choose-window-ga4-new",
    "app": "choose-window",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 3,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "diairy-ga4-dau",
    "app": "diairy",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 6,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 7,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 2,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 1,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 11,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "diairy-ga4-new",
    "app": "diairy",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 6,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 7,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 2,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 1,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 10,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "burntok-ga4-dau",
    "app": "burntok",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 2,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 4,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 3,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "burntok-ga4-new",
    "app": "burntok",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 2,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 4,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 3,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "spint-ga4-dau",
    "app": "spint",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "closed-test",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 1,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 7,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 2,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "spint-ga4-new",
    "app": "spint",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "closed-test",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 1,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 6,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "unairplane-ga4-dau",
    "app": "unairplane",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": null,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 4,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 2,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "unairplane-ga4-new",
    "app": "unairplane",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": null,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-02",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-08",
        "value": 0,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-09",
        "value": 4,
        "observedOn": "2026-10-10"
      },
      {
        "date": "2026-10-10",
        "value": 2,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "utilverse-ga4-dau",
    "app": "utilverse",
    "metric": "dau",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "closed-test",
    "points": [
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-09",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-10",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "utilverse-ga4-new",
    "app": "utilverse",
    "metric": "new",
    "source": "GA4",
    "scope": "ga4-all",
    "timeZone": "Asia/Seoul",
    "testTraffic": "closed-test",
    "points": [
      {
        "date": "2026-10-03",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-04",
        "value": 1,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-05",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-09",
        "value": 0,
        "observedOn": "2026-10-11"
      },
      {
        "date": "2026-10-10",
        "value": 0,
        "observedOn": "2026-10-12"
      },
      {
        "date": "2026-10-11",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      },
      {
        "date": "2026-10-12",
        "value": 0,
        "observedOn": "2026-10-13",
        "provisional": true
      }
    ]
  },
  {
    "id": "yajalal-admob-iOS",
    "app": "yajalal",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "ios-observed",
    "timeZone": null,
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-01",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-02",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-03",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-04",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-05",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-07",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-08",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-09",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-10",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-11",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-12",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-13",
        "value": 0.01,
        "observedOn": "2026-10-19",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-14",
        "value": 0,
        "observedOn": "2026-10-19",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-15",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-16",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-17",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-18",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-19",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-23",
        "value": 0,
        "observedOn": "2026-10-24"
      }
    ],
    "missingReason": "20~21일 행 미제공. USD, 센트 단위 반올림."
  },
  {
    "id": "yajalal-admob-Android",
    "app": "yajalal",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "android-observed",
    "timeZone": null,
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-01",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-02",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-03",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-04",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-05",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-07",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-08",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-09",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-10",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-11",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-12",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-15",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-16",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-17",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-18",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      }
    ],
    "missingReason": "19~21일 행 미제공. USD, 센트 단위 반올림."
  },
  {
    "id": "choose-window-admob-iOS",
    "app": "choose-window",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "ios-observed",
    "timeZone": null,
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-01",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-02",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-04",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-05",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-07",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-08",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-09",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-11",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-13",
        "value": 0.01,
        "observedOn": "2026-10-19",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-15",
        "value": 0.01,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-18",
        "value": 0.01,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-20",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-21",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-23",
        "value": 0,
        "observedOn": "2026-10-24"
      },
      {
        "date": "2026-10-24",
        "value": 0.07,
        "observedOn": "2026-10-25"
      },
      {
        "date": "2026-10-25",
        "value": 0.0,
        "observedOn": "2026-10-26"
      },
      {
        "date": "2026-10-26",
        "value": 0.03,
        "observedOn": "2026-10-27"
      },
      {
        "date": "2026-10-27",
        "value": 0,
        "observedOn": "2026-10-30",
        "provisional": true,
        "timeZone": null
      },
      {
        "date": "2026-10-29",
        "value": 0,
        "observedOn": "2026-10-30",
        "provisional": true,
        "timeZone": null
      },
      {
        "date": "2026-10-30",
        "value": 0.0,
        "observedOn": "2026-10-31",
        "provisional": true,
        "timeZone": null
      }
    ],
    "missingReason": "16~17,19일 행은 미제공. USD, 센트 단위 반올림."
  },
  {
    "id": "choose-window-admob-Android",
    "app": "choose-window",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "android-observed",
    "timeZone": "Asia/Seoul",
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-27",
        "value": 0,
        "observedOn": "2026-10-30",
        "provisional": true,
        "timeZone": null
      },
      {
        "date": "2026-10-30",
        "value": 0.0,
        "observedOn": "2026-10-31",
        "provisional": true,
        "timeZone": null
      }
    ]
  },
  {
    "id": "unairplane-admob-iOS",
    "app": "unairplane",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "ios-observed",
    "timeZone": null,
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-10",
        "value": 0.0,
        "observedOn": "2026-10-13",
        "timeZone": "Asia/Seoul"
      },
      {
        "date": "2026-10-15",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-16",
        "value": 0,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-17",
        "value": 0.01,
        "observedOn": "2026-10-22",
        "timeZone": null
      },
      {
        "date": "2026-10-22",
        "value": 0,
        "observedOn": "2026-10-23",
        "provisional": true,
        "timeZone": null
      },
      {
        "date": "2026-10-23",
        "value": 0,
        "observedOn": "2026-10-24"
      },
      {
        "date": "2026-10-24",
        "value": 0,
        "observedOn": "2026-10-25"
      },
      {
        "date": "2026-10-25",
        "value": 0.0,
        "observedOn": "2026-10-26"
      },
      {
        "date": "2026-10-26",
        "value": 0.0,
        "observedOn": "2026-10-27"
      },
      {
        "date": "2026-10-27",
        "value": 0,
        "observedOn": "2026-10-30",
        "provisional": true,
        "timeZone": null
      },
      {
        "date": "2026-10-28",
        "value": 0,
        "observedOn": "2026-10-30",
        "provisional": true,
        "timeZone": null
      },
      {
        "date": "2026-10-30",
        "value": 0.0,
        "observedOn": "2026-10-31",
        "provisional": true,
        "timeZone": null
      }
    ],
    "missingReason": "보고서에 제공된 행만 기록. 18~21일 행은 미제공. USD, US$ 표기, 센트 단위 반올림."
  }
];
