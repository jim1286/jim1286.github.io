// Public, aggregate observations only. Provenance and revisions are documented in
// docs/PERFORMANCE.md; account totals must never be assigned to an individual app.
import { historicalSeries } from './history.ts';
import { storeCapturedAt, storeSeries } from './storeHistory.ts';
export type Metric = 'dau' | 'new' | 'installed' | 'revenue' | 'visitors' | 'activeDevices';
export type Observation = { date: string; value: number; observedOn?: string; provisional?: boolean };
export type MetricSeries = {
  id: string;
  app: string | null;
  metric: Metric;
  source: 'Google Play' | 'AdMob' | 'GA4' | 'App Store Connect';
  scope: 'android' | 'ios-kr-banner' | 'admob-account' | 'ga4-all' | 'ios-observed' | 'android-observed' | 'apple-store-all' | 'play-store-all' | 'play-installed-all' | 'play-active-all';
  timeZone: string | null;
  currency?: 'USD';
  estimated?: boolean;
  unit?: 'users' | 'views' | 'devices';
  unique?: boolean;
  coverage?: { start: string; end: string };
  firstPositive?: string;
  missingReason?: string;
  testTraffic: 'not-excluded' | 'closed-test';
  points: Observation[];
};
export const capturedAt = storeCapturedAt;
export const periodEnd = '2026-10-20';
const october = (values: [number, number][]): Observation[] => values.map(([day, value]) => ({ date: `2026-10-${String(day).padStart(2, '0')}`, value }));
export const metricSeries: MetricSeries[] = [
  { id: 'yajalal-installed', app: 'yajalal', metric: 'installed', source: 'Google Play', scope: 'android', timeZone: null, testTraffic: 'not-excluded',
    points: october([[4, 39], [5, 42], [6, 40], [7, 40], [8, 36], [9, 36], [10, 40], [11, 42], [12, 38], [13, 38], [14, 39], [15, 38], [16, 40], [17, 47], [18, 36], [19, 39]]) },
  { id: 'utilverse-dau', app: 'utilverse', metric: 'dau', source: 'Google Play', scope: 'android', timeZone: null, testTraffic: 'closed-test', points: october([[14, 21]]) },
  { id: 'utilverse-installed', app: 'utilverse', metric: 'installed', source: 'Google Play', scope: 'android', timeZone: null, testTraffic: 'closed-test', points: october([[16, 19], [17, 18], [18, 18], [19, 17]]) },
  { id: 'choose-revenue', app: 'choose-window', metric: 'revenue', source: 'AdMob', scope: 'ios-kr-banner', timeZone: 'Asia/Seoul', currency: 'USD', estimated: true, testTraffic: 'not-excluded', points: october([[20, 0]]) },
  // Only the 10/20 app breakdown is known. Earlier days remain account-scoped.
  { id: 'account-revenue', app: null, metric: 'revenue', source: 'AdMob', scope: 'admob-account', timeZone: 'Asia/Seoul', currency: 'USD', estimated: true, testTraffic: 'not-excluded',
    points: october([[1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, .01], [7, 0], [8, 0], [9, 0], [10, 0], [11, 0], [12, 0], [13, .01], [14, 0], [15, .01], [16, 0], [17, .01], [18, .01], [19, 0], [20, 0]]) },
  ...historicalSeries,
  ...storeSeries,
];
// Use the provider's period total: rounded daily labels do not reconstruct it.
export const accountRevenueTotal = { start: '2026-09-21', end: periodEnd, value: .10, currency: 'USD', estimated: true } as const;

export function datesBetween(start: string, end: string): string[] {
  const dates: string[] = [];
  for (let date = new Date(`${start}T00:00:00Z`); date.toISOString().slice(0, 10) <= end; date.setUTCDate(date.getUTCDate() + 1)) dates.push(date.toISOString().slice(0, 10));
  return dates;
}
export function valuesForDates(series: MetricSeries, dates: string[]): (number | null)[] {
  const values = new Map(series.points.map(point => [point.date, point.value]));
  return dates.map(date => values.get(date) ?? null);
}
export function latest(series: MetricSeries): Observation | undefined {
  return [...series.points].sort((a, b) => b.date.localeCompare(a.date))[0];
}
export function comparison(series: MetricSeries, days: number) {
  const current = latest(series);
  if (!current) return null;
  const date = new Date(`${current.date}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  const previous = series.points.find(point => point.date === date.toISOString().slice(0, 10));
  if (!previous) return null;
  const delta = current.value - previous.value;
  return { previous, current, delta, percent: previous.value === 0 ? null : delta / previous.value * 100 };
}
export function forApp(app: string, metric: Metric) {
  // Choose one actual source's latest observation; never splice GA4 and Play
  // into one series or sum OS-level, rounded revenue display values.
  return metricSeries.filter(series => series.app === app && series.metric === metric)
    .sort((a, b) => (latest(b)?.date ?? '').localeCompare(latest(a)?.date ?? ''))[0];
}
