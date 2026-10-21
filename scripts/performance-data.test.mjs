import test from 'node:test';
import assert from 'node:assert/strict';
import { comparison, datesBetween, forApp, latest, metricSeries, newestSeries, valuesForDates } from '../src/performance/data.ts';

const fixture = (overrides = {}) => ({ id: 'sample', app: 'sample', metric: 'dau', source: 'GA4', scope: 'ga4-all', timeZone: null, testTraffic: 'not-excluded', points: [], ...overrides });

test('a confirmed zero and an unobserved day remain different', () => {
  const series = fixture({ points: [{ date: '2026-09-30', value: 0 }, { date: '2026-10-02', value: 2 }] });
  assert.deepEqual(valuesForDates(series, ['2026-09-30', '2026-10-01', '2026-10-02']), [0, null, 2]);
});
test('source selection chooses the newest zero without adding the older population', () => {
  const play = fixture({ id: 'play', source: 'Google Play', scope: 'android', points: [{ date: '2026-10-01', value: 21 }] });
  const ios = fixture({ id: 'ios', scope: 'ga4-ios', points: [{ date: '2026-10-02', value: 0 }] });
  assert.equal(newestSeries([play, ios]), ios);
  assert.equal(latest(newestSeries([play, ios])).value, 0);
  assert.equal(forApp('not-a-product', 'dau'), undefined);
  for (const app of new Set(metricSeries.map(series => series.app))) {
    const selected = forApp(app, 'dau');
    if (selected) { assert.equal(selected.app, app); assert.equal(selected.metric, 'dau'); }
  }
});
test('daily comparisons require the exact preceding date and preserve a zero denominator', () => {
  const series = fixture({ points: [{ date: '2026-10-13', value: 3 }, { date: '2026-10-14', value: 6 }] });
  assert.deepEqual(comparison(series, 1), { previous: series.points[0], current: series.points[1], delta: 3, percent: 100 });
  assert.equal(comparison(fixture({ points: [{ date: '2026-10-10', value: 2 }, { date: '2026-10-12', value: 3 }] }), 1), null);
  assert.equal(comparison(fixture({ points: [{ date: '2026-10-11', value: 0 }, { date: '2026-10-12', value: 3 }] }), 1).percent, null);
});
test('observations have valid unique date keys and finite nonnegative values', () => {
  assert.equal(new Set(metricSeries.map(series => series.id)).size, metricSeries.length);
  for (const series of metricSeries) {
    assert.equal(new Set(series.points.map(point => point.date)).size, series.points.length, series.id);
    for (const point of series.points) {
      assert.match(point.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.equal(new Date(`${point.date}T00:00:00Z`).toISOString().slice(0, 10), point.date);
      assert.ok(Number.isFinite(point.value) && point.value >= 0, series.id);
      if (point.observedOn) assert.ok(point.observedOn >= point.date, series.id);
    }
  }
});
test('the date axis includes missing dates across month boundaries', () => {
  assert.deepEqual(datesBetween('2026-09-29', '2026-10-02'), ['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
});
test('the long Play installed audience export cannot become DAU', () => {
  const installed = metricSeries.filter(series => series.scope === 'play-installed-all');
  assert.ok(installed.length > 0);
  assert.ok(installed.every(series => series.metric === 'installed' && series.source === 'Google Play' && series.unit === 'users'));
  const narrow = fixture({ metric: 'installed', source: 'Google Play', scope: 'android', points: [{ date: '2026-10-01', value: 1 }] });
  const full = { ...narrow, id: 'full', scope: 'play-installed-all' };
  assert.equal(newestSeries([narrow, full]), full);
});
test('Apple page views and Play visitor users retain separate units', () => {
  const apple = metricSeries.filter(series => series.scope === 'apple-store-all');
  const play = metricSeries.filter(series => series.scope === 'play-store-all');
  assert.ok(apple.length > 0 && play.length > 0);
  assert.ok(apple.every(series => series.metric === 'visitors' && series.unit === 'views' && series.unique === false));
  assert.ok(play.every(series => series.metric === 'visitors' && series.unit === 'users' && series.unique === true));
});
test('legacy product history remains available before the recent reporting period', () => {
  const today = metricSeries.find(series => series.app === 'yajalal' && series.scope === 'play-active-all');
  const choice = metricSeries.find(series => series.app === 'choose-window' && series.scope === 'play-active-all');
  assert.ok(today.points.some(point => point.date <= '2025-08-10'));
  assert.ok(today.points.length > 300);
  assert.ok(choice.points.some(point => point.date <= '2026-02-14'));
});
test('iOS GA4 users are not Apple devices, downloads, or Android observations', () => {
  const ios = metricSeries.filter(series => series.source === 'GA4' && series.scope.includes('ios'));
  assert.ok(ios.length > 0);
  assert.ok(ios.every(series => ['dau', 'new'].includes(series.metric) && series.unit === 'users'));
  assert.ok(!metricSeries.some(series => series.source === 'App Store Connect' && ['dau', 'new'].includes(series.metric)));
  assert.ok(metricSeries.some(series => series.source === 'Google Play' && series.metric === 'dau'));
});
test('public observations include only the seven requested products', () => {
  const allowed = new Set(['yajalal', 'choose-window', 'burntok', 'unairplane', 'diairy', 'spint', 'utilverse']);
  assert.ok(metricSeries.every(series => allowed.has(series.app)));
});
