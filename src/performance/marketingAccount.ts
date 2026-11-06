// Account Insights are separate from post-level cumulative snapshots.
// Summary windows and retained daily observations have independent provenance.
import type { MarketingPlatform } from './marketing';
export type AccountMarketingMetric = 'views' | 'viewers' | 'interactions';
export type MarketingAccount = { platform: MarketingPlatform; observedAt: string; windowLabel: string; periodDates: { start: string; end: string } | null; dailyObservedAt: string; chartRange: { start: string; end: string } | null; views: number; viewers: number; interactions: number; profileActivity: number | null; followers: number; followersAsOf: string; netFollowers: number | null; daily: Record<AccountMarketingMetric, {date: string; value: number}[]> };
export const marketingAccounts: MarketingAccount[] = [
  {
    "platform": "instagram",
    "observedAt": "2026-11-05T23:39:38.032Z",
    "windowLabel": "최근 30일",
    "periodDates": null,
    "chartRange": null,
    "views": 2415,
    "viewers": 243,
    "interactions": 607,
    "profileActivity": 466,
    "followers": 211,
    "followersAsOf": "2026-11-06",
    "netFollowers": null,
    "daily": {
      "views": [],
      "viewers": [],
      "interactions": []
    },
    "dailyObservedAt": "2026-10-21T16:03:18+09:00"
  },
  {
    "platform": "threads",
    "observedAt": "2026-11-05T23:38:29.158Z",
    "windowLabel": "최근 30일",
    "periodDates": {
      "start": "2026-10-07",
      "end": "2026-11-05"
    },
    "chartRange": {
      "start": "2026-09-26",
      "end": "2026-11-05"
    },
    "views": 4806,
    "viewers": 2111,
    "interactions": 561,
    "profileActivity": null,
    "followers": 82,
    "followersAsOf": "2026-11-06",
    "netFollowers": 76,
    "daily": {
      "views": [
        {
          "date": "2026-09-26",
          "value": 63
        },
        {
          "date": "2026-09-27",
          "value": 247
        },
        {
          "date": "2026-09-28",
          "value": 409
        },
        {
          "date": "2026-09-29",
          "value": 317
        },
        {
          "date": "2026-09-30",
          "value": 62
        },
        {
          "date": "2026-10-01",
          "value": 136
        },
        {
          "date": "2026-10-02",
          "value": 38
        },
        {
          "date": "2026-10-03",
          "value": 33
        },
        {
          "date": "2026-10-04",
          "value": 15
        },
        {
          "date": "2026-10-05",
          "value": 26
        },
        {
          "date": "2026-10-06",
          "value": 8
        },
        {
          "date": "2026-10-07",
          "value": 15
        },
        {
          "date": "2026-10-08",
          "value": 10
        },
        {
          "date": "2026-10-09",
          "value": 4
        },
        {
          "date": "2026-10-10",
          "value": 8
        },
        {
          "date": "2026-10-11",
          "value": 7
        },
        {
          "date": "2026-10-12",
          "value": 158
        },
        {
          "date": "2026-10-13",
          "value": 138
        },
        {
          "date": "2026-10-14",
          "value": 107
        },
        {
          "date": "2026-10-15",
          "value": 98
        },
        {
          "date": "2026-10-16",
          "value": 198
        },
        {
          "date": "2026-10-17",
          "value": 347
        },
        {
          "date": "2026-10-18",
          "value": 79
        },
        {
          "date": "2026-10-19",
          "value": 35
        },
        {
          "date": "2026-10-20",
          "value": 13
        },
        {
          "date": "2026-10-21",
          "value": 17
        },
        {
          "date": "2026-10-22",
          "value": 12
        },
        {
          "date": "2026-10-23",
          "value": 13
        },
        {
          "date": "2026-10-24",
          "value": 9
        },
        {
          "date": "2026-10-25",
          "value": 27
        },
        {
          "date": "2026-10-26",
          "value": 16
        },
        {
          "date": "2026-10-27",
          "value": 32
        },
        {
          "date": "2026-10-28",
          "value": 22
        },
        {
          "date": "2026-10-29",
          "value": 26
        },
        {
          "date": "2026-10-30",
          "value": 312
        },
        {
          "date": "2026-10-31",
          "value": 355
        },
        {
          "date": "2026-11-01",
          "value": 518
        },
        {
          "date": "2026-11-02",
          "value": 1644
        },
        {
          "date": "2026-11-03",
          "value": 221
        },
        {
          "date": "2026-11-04",
          "value": 196
        },
        {
          "date": "2026-11-05",
          "value": 161
        }
      ],
      "viewers": [
        {
          "date": "2026-09-26",
          "value": 47
        },
        {
          "date": "2026-09-27",
          "value": 173
        },
        {
          "date": "2026-09-28",
          "value": 238
        },
        {
          "date": "2026-09-29",
          "value": 164
        },
        {
          "date": "2026-09-30",
          "value": 50
        },
        {
          "date": "2026-10-01",
          "value": 119
        },
        {
          "date": "2026-10-02",
          "value": 26
        },
        {
          "date": "2026-10-03",
          "value": 21
        },
        {
          "date": "2026-10-04",
          "value": 13
        },
        {
          "date": "2026-10-05",
          "value": 12
        },
        {
          "date": "2026-10-06",
          "value": 7
        },
        {
          "date": "2026-10-07",
          "value": 8
        },
        {
          "date": "2026-10-08",
          "value": 8
        },
        {
          "date": "2026-10-09",
          "value": 4
        },
        {
          "date": "2026-10-10",
          "value": 7
        },
        {
          "date": "2026-10-11",
          "value": 7
        },
        {
          "date": "2026-10-12",
          "value": 45
        },
        {
          "date": "2026-10-13",
          "value": 34
        },
        {
          "date": "2026-10-14",
          "value": 43
        },
        {
          "date": "2026-10-15",
          "value": 23
        },
        {
          "date": "2026-10-16",
          "value": 74
        },
        {
          "date": "2026-10-17",
          "value": 159
        },
        {
          "date": "2026-10-18",
          "value": 55
        },
        {
          "date": "2026-10-19",
          "value": 16
        },
        {
          "date": "2026-10-20",
          "value": 7
        },
        {
          "date": "2026-10-21",
          "value": 11
        },
        {
          "date": "2026-10-22",
          "value": 8
        },
        {
          "date": "2026-10-23",
          "value": 8
        },
        {
          "date": "2026-10-24",
          "value": 7
        },
        {
          "date": "2026-10-25",
          "value": 11
        },
        {
          "date": "2026-10-26",
          "value": 11
        },
        {
          "date": "2026-10-27",
          "value": 8
        },
        {
          "date": "2026-10-28",
          "value": 7
        },
        {
          "date": "2026-10-29",
          "value": 14
        },
        {
          "date": "2026-10-30",
          "value": 108
        },
        {
          "date": "2026-10-31",
          "value": 87
        },
        {
          "date": "2026-11-01",
          "value": 199
        },
        {
          "date": "2026-11-02",
          "value": 1330
        },
        {
          "date": "2026-11-03",
          "value": 95
        },
        {
          "date": "2026-11-04",
          "value": 60
        },
        {
          "date": "2026-11-05",
          "value": 42
        }
      ],
      "interactions": [
        {
          "date": "2026-09-27",
          "value": 8
        },
        {
          "date": "2026-09-28",
          "value": 28
        },
        {
          "date": "2026-09-29",
          "value": 15
        },
        {
          "date": "2026-09-30",
          "value": 1
        },
        {
          "date": "2026-10-01",
          "value": 2
        },
        {
          "date": "2026-10-12",
          "value": 36
        },
        {
          "date": "2026-10-13",
          "value": 34
        },
        {
          "date": "2026-10-14",
          "value": 32
        },
        {
          "date": "2026-10-15",
          "value": 12
        },
        {
          "date": "2026-10-16",
          "value": 41
        },
        {
          "date": "2026-10-17",
          "value": 33
        },
        {
          "date": "2026-10-18",
          "value": 6
        },
        {
          "date": "2026-10-19",
          "value": 4
        },
        {
          "date": "2026-10-20",
          "value": 2
        },
        {
          "date": "2026-10-21",
          "value": 3
        },
        {
          "date": "2026-10-22",
          "value": 1
        },
        {
          "date": "2026-10-23",
          "value": 3
        },
        {
          "date": "2026-10-24",
          "value": 1
        },
        {
          "date": "2026-10-27",
          "value": 7
        },
        {
          "date": "2026-10-28",
          "value": 4
        },
        {
          "date": "2026-10-29",
          "value": 3
        },
        {
          "date": "2026-10-30",
          "value": 51
        },
        {
          "date": "2026-10-31",
          "value": 52
        },
        {
          "date": "2026-11-01",
          "value": 81
        },
        {
          "date": "2026-11-02",
          "value": 70
        },
        {
          "date": "2026-11-03",
          "value": 38
        },
        {
          "date": "2026-11-04",
          "value": 23
        },
        {
          "date": "2026-11-05",
          "value": 24
        }
      ]
    },
    "dailyObservedAt": "2026-11-05T23:41:06.094Z"
  }
];
