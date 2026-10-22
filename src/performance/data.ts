// Public, aggregate observations only. Provenance and revisions are documented in
// docs/PERFORMANCE.md; account totals must never be assigned to an individual app.
import { webCapturedAt, webSeries } from './webHistory.ts';
import { combinedCapturedAt, combinedSeries } from './combinedHistory.ts';
import { platformCapturedAt, platformSeries } from './platformHistory.ts';
import { iosCapturedAt, iosSeries } from './iosHistory.ts';
import { historicalSeries } from './history.ts';
import { storeCapturedAt, storeSeries } from './storeHistory.ts';
export type Metric = 'dau' | 'new' | 'installed' | 'revenue' | 'visitors' | 'activeDevices';
export type Observation = { date: string; value: number; observedOn?: string; provisional?: boolean; timeZone?: string | null };
export type MetricSeries = {
  id: string;
  app: string | null;
  metric: Metric;
  source: 'Google Play' | 'AdMob' | 'GA4' | 'App Store Connect';
  scope: 'android' | 'ios-kr-banner' | 'admob-account' | 'ga4-all' | 'ios-observed' | 'android-observed' | 'apple-store-all' | 'play-store-all' | 'play-installed-all' | 'play-active-all' | 'ga4-ios' | 'ga4-ios-app' | 'ga4-android-app' | 'ga4-web';
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
export const capturedAt = [storeCapturedAt, iosCapturedAt, platformCapturedAt, webCapturedAt, combinedCapturedAt].sort((a, b) => Date.parse(b) - Date.parse(a))[0];
const october = (values: [number, number][]): Observation[] => values.map(([day, value]) => ({ date: `2026-10-${String(day).padStart(2, '0')}`, value }));
export const metricSeries: MetricSeries[] = [
  { id: 'yajalal-installed', app: 'yajalal', metric: 'installed', source: 'Google Play', scope: 'android', timeZone: null, testTraffic: 'not-excluded',
    points: october([[4, 39], [5, 42], [6, 40], [7, 40], [8, 36], [9, 36], [10, 40], [11, 42], [12, 38], [13, 38], [14, 39], [15, 38], [16, 40], [17, 47], [18, 36], [19, 39]]) },
  { id: 'utilverse-dau', app: 'utilverse', metric: 'dau', source: 'Google Play', scope: 'android', timeZone: null, testTraffic: 'closed-test', points: october([[14, 21]]) },
  { id: 'utilverse-installed', app: 'utilverse', metric: 'installed', source: 'Google Play', scope: 'android', timeZone: null, testTraffic: 'closed-test', points: october([[16, 19], [17, 18], [18, 18], [19, 17]]) },
  { id: 'choose-revenue', app: 'choose-window', metric: 'revenue', source: 'AdMob', scope: 'ios-kr-banner', timeZone: 'Asia/Seoul', currency: 'USD', estimated: true, testTraffic: 'not-excluded', points: october([[20, 0]]) },
  // Fresh Date-only reports retain verified history under the same series ID;
  // the earlier snapshot must not become a second line for the same population.
  ...historicalSeries.filter(series => !combinedSeries.some(current => current.id === series.id)),
  ...combinedSeries,
  ...storeSeries,
  ...iosSeries,
  ...platformSeries,
  ...webSeries,
];
// New observations advance the date axis automatically. The corpus is nonempty
// and collection omits the current incomplete day.
export const periodEnd = metricSeries.flatMap(series => series.points.map(point => point.date)).sort().at(-1)!;
// Account-wide ad totals are retained in research only: their app scope has not
// been proven to exclude the products omitted from this public dashboard.

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
export function newestSeries(candidates: readonly MetricSeries[]) {
  // The full-country stock export covers the retained KR snapshot's same date.
  // Preserve both provenance series and prefer the broader stock observation.
  return [...candidates].sort((a, b) => (latest(b)?.date ?? '').localeCompare(latest(a)?.date ?? '') || Number(b.scope === 'play-installed-all') - Number(a.scope === 'play-installed-all'))[0];
}
export function forApp(app: string, metric: Metric) {
  // Source populations remain separate: select a snapshot without adding users
  // or joining observations from different provider definitions.
  return newestSeries(metricSeries.filter(series => series.app === app && series.metric === metric));
}
