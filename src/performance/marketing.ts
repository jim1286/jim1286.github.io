// Native Insights snapshots; not a complete account total or exact 24-hour result.
export type MarketingPlatform = 'instagram' | 'threads';
export type MarketingMetric = 'views' | 'likes' | 'comments' | 'saves' | 'shares' | 'profileVisits' | 'follows' | 'viewers' | 'reach';
export type MarketingObservation = { content: string; platform: MarketingPlatform; url: string; publishedAt: string; observedAt: string; metrics: Record<MarketingMetric, number | null>; sourceFile: string };
export const marketingObservations: MarketingObservation[] = [
  {
    "content": "2026-10-13-charger-mark-part2",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DebmX10j-mK/",
    "publishedAt": "2026-10-13T19:32:25+09:00",
    "observedAt": "2026-10-15T10:18:05.488458+09:00",
    "metrics": {
      "views": 5,
      "likes": 0,
      "comments": 0,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 0,
      "viewers": 2,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-15-insights-charger-part2.json"
  },
  {
    "content": "2026-10-10-cup-ring-pond",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DegwB15DzpN/",
    "publishedAt": "2026-10-15T10:33:00+00:00",
    "observedAt": "2026-10-17T02:40:31.097262+00:00",
    "metrics": {
      "views": 57,
      "likes": 9,
      "comments": 6,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 1,
      "viewers": 17,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-17-insights.json"
  },
  {
    "content": "2026-10-10-cup-ring-pond",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/Def8kG_gXiS",
    "publishedAt": "2026-10-15T03:02:15+00:00",
    "observedAt": "2026-10-17T02:41:23.998058+00:00",
    "metrics": {
      "views": 9,
      "likes": 1,
      "comments": 0,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 0,
      "viewers": 9,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-17-insights.json"
  },
  {
    "content": "2026-10-16-water-detour",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/DeihSIxgTlM",
    "publishedAt": "2026-10-16T03:02:37+00:00",
    "observedAt": "2026-10-17T03:13:54.311161+00:00",
    "metrics": {
      "views": 16,
      "likes": null,
      "comments": 0,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 0,
      "viewers": 13,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-17-insights.json"
  },
  {
    "content": "2026-10-16-water-detour",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DejUwi1kiuO/",
    "publishedAt": "2026-10-16T10:31:23+00:00",
    "observedAt": "2026-10-18T01:12:21.471651+00:00",
    "metrics": {
      "views": 26,
      "likes": 4,
      "comments": 0,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 1,
      "viewers": 12,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-18-insights.json"
  },
  {
    "content": "2026-10-16-tiny-mitten",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DejfNJzjyzS/",
    "publishedAt": "2026-10-16T12:03:50+00:00",
    "observedAt": "2026-10-18T01:13:25.788024+00:00",
    "metrics": {
      "views": 30,
      "likes": 5,
      "comments": 0,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 0,
      "viewers": 10,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-18-insights.json"
  },
  {
    "content": "2026-10-16-tiny-mitten",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/DejfMZ6gfsl",
    "publishedAt": "2026-10-16T12:03:43+00:00",
    "observedAt": "2026-10-18T01:13:25.788024+00:00",
    "metrics": {
      "views": 69,
      "likes": 9,
      "comments": 2,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 13,
      "viewers": 57,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-18-insights.json"
  },
  {
    "content": "2026-10-18-apple-sticker-tab",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DeoebuIgVde/",
    "publishedAt": "2026-10-18T19:33:09+09:00",
    "observedAt": "2026-10-20T00:00:49.130+00:00",
    "metrics": {
      "views": 29,
      "likes": 6,
      "comments": 1,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 2,
      "viewers": 12,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-20-insights.json"
  },
  {
    "content": "2026-10-18-apple-sticker-tab",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/Denq2BKAev7",
    "publishedAt": "2026-10-18T12:01:19+09:00",
    "observedAt": "2026-10-20T00:01:18.078+00:00",
    "metrics": {
      "views": 19,
      "likes": 4,
      "comments": 0,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 6,
      "viewers": 18,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-20-insights.json"
  },
  {
    "content": "2026-10-18-sneeze-gone",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DeoooCmDyCr/",
    "publishedAt": "2026-10-18T21:02:20+09:00",
    "observedAt": "2026-10-20T00:01:57.365+00:00",
    "metrics": {
      "views": 32,
      "likes": 4,
      "comments": 0,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 0,
      "viewers": 12,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-20-insights.json"
  },
  {
    "content": "2026-10-18-sneeze-gone",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/DeoowNgAQew",
    "publishedAt": "2026-10-18T21:03:27+09:00",
    "observedAt": "2026-10-20T00:02:05.873+00:00",
    "metrics": {
      "views": 34,
      "likes": 6,
      "comments": 0,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 7,
      "viewers": 30,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-20-insights.json"
  },
  {
    "content": "내 쪽은 끝났어! 🧺",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DewMpt0AZHv/",
    "publishedAt": "2026-10-21T10:31:42Z",
    "observedAt": "2026-10-23T00:06:23.961Z",
    "metrics": {
      "views": 16,
      "likes": 3,
      "comments": 0,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 0,
      "viewers": null,
      "reach": 5
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-23-insights.json"
  },
  {
    "content": "내 쪽은 끝났어! 🧺",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/DevZTXpgfBj",
    "publishedAt": "2026-10-21T03:03:00Z",
    "observedAt": "2026-10-23T00:06:37.157Z",
    "metrics": {
      "views": 8,
      "likes": 1,
      "comments": 0,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 0,
      "viewers": null,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-23-insights.json"
  },
  {
    "content": "너부터였구나 🍵",
    "platform": "instagram",
    "url": "https://www.instagram.com/p/DewW92agcn2/",
    "publishedAt": "2026-10-21T12:00:48Z",
    "observedAt": "2026-10-23T00:06:52.080Z",
    "metrics": {
      "views": 22,
      "likes": 4,
      "comments": 0,
      "saves": 0,
      "shares": 0,
      "follows": 0,
      "profileVisits": 1,
      "viewers": null,
      "reach": 6
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-23-insights.json"
  },
  {
    "content": "너부터였구나 🍵",
    "platform": "threads",
    "url": "https://www.threads.com/@posli.makes/post/DewXGh_AWxa",
    "publishedAt": "2026-10-21T12:03:02Z",
    "observedAt": "2026-10-23T00:08:09.213Z",
    "metrics": {
      "views": 7,
      "likes": 2,
      "comments": 0,
      "saves": null,
      "shares": null,
      "follows": 0,
      "profileVisits": 0,
      "viewers": null,
      "reach": null
    },
    "sourceFile": "control-plane/app-release-hub/marketing/operations/2026-10/2026-10-23-insights.json"
  }
];
// Replace the same post's earlier cumulative snapshot rather than adding it.
export function latestMarketingPosts(platform: MarketingPlatform, observations: readonly MarketingObservation[] = marketingObservations) {
  const posts = new Map<string, MarketingObservation>();
  for (const item of observations.filter(item => item.platform === platform)) {
    const previous = posts.get(item.url);
    if (!previous || Date.parse(item.observedAt) > Date.parse(previous.observedAt)) posts.set(item.url, item);
  }
  return [...posts.values()].sort((a,b) => Date.parse(a.publishedAt) - Date.parse(b.publishedAt));
}
