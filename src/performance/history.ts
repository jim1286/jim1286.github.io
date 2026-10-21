// Public aggregate projection from the historical evidence listed in docs/PERFORMANCE.md.
// Original console links, property IDs and evidence rows are deliberately not imported.
import type { MetricSeries } from './data';
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
    "timeZone": "Asia/Seoul",
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-01",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-02",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-03",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-04",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-05",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-07",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-08",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-09",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-10",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-11",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-12",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-13",
        "value": 0.01,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-14",
        "value": 0,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-15",
        "value": 0,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-16",
        "value": 0,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-17",
        "value": 0,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-18",
        "value": 0,
        "observedOn": "2026-10-19"
      }
    ]
  },
  {
    "id": "yajalal-admob-Android",
    "app": "yajalal",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "android-observed",
    "timeZone": "Asia/Seoul",
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-01",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-02",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-03",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-04",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-05",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-07",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-08",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-09",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-10",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-11",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-12",
        "value": 0.0,
        "observedOn": "2026-10-13"
      }
    ]
  },
  {
    "id": "choose-window-admob-iOS",
    "app": "choose-window",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "ios-observed",
    "timeZone": "Asia/Seoul",
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-01",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-02",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-04",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-05",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-06",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-07",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-08",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-09",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-11",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-13",
        "value": 0.01,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-15",
        "value": 0.01,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-18",
        "value": 0.01,
        "observedOn": "2026-10-19"
      }
    ]
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
      }
    ]
  },
  {
    "id": "unairplane-admob-iOS",
    "app": "unairplane",
    "metric": "revenue",
    "source": "AdMob",
    "scope": "ios-observed",
    "timeZone": "Asia/Seoul",
    "currency": "USD",
    "estimated": true,
    "testTraffic": "not-excluded",
    "points": [
      {
        "date": "2026-10-10",
        "value": 0.0,
        "observedOn": "2026-10-13"
      },
      {
        "date": "2026-10-15",
        "value": 0,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-16",
        "value": 0,
        "observedOn": "2026-10-19"
      },
      {
        "date": "2026-10-17",
        "value": 0.01,
        "observedOn": "2026-10-19"
      }
    ]
  }
];
