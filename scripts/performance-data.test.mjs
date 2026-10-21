import test from 'node:test';
import assert from 'node:assert/strict';
import { comparison, datesBetween, forApp, metricSeries, valuesForDates } from '../src/performance/data.ts';

test('historical counts retain observed zero and missing days separately', () => {
  const series = metricSeries.find(item => item.id === 'diairy-ga4-dau');
  assert.deepEqual(valuesForDates(series, ['2026-10-02', '2026-10-06', '2026-10-12', '2026-10-13']), [0, null, 11, null]);
  assert.equal(forApp('diairy', 'new').points.find(point => point.date === '2026-10-12').value, 10);
});
test('GA4 and Play stay separate, and newest source is identified rather than added', () => {
  const selected = forApp('utilverse', 'dau');
  assert.equal(selected.source, 'Google Play');
  assert.equal(selected.points[0].value, 21);
  assert.equal(metricSeries.find(item => item.id === 'utilverse-ga4-dau').points.at(-1).value, 0);
  assert.equal(forApp('choose-window', 'revenue').app, 'choose-window');
  assert.equal(forApp('burntok', 'revenue'), undefined);
});
test('daily comparisons use the exact preceding date and do not divide by zero', () => {
  const series = forApp('yajalal', 'dau');
  assert.deepEqual(comparison(series, 1), { previous: { date: '2026-10-13', value: 3 }, current: { date: '2026-10-14', value: 6 }, delta: 3, percent: 100 });
  assert.equal(comparison({ ...series, points: [{ date: '2026-10-10', value: 2 }, { date: '2026-10-12', value: 3 }] }, 1), null);
  assert.equal(comparison({ ...series, points: [{ date: '2026-10-11', value: 0 }, { date: '2026-10-12', value: 3 }] }, 1).percent, null);
});
test('installation revisions are stored at the original date', () => {
  const series = forApp('yajalal', 'installed');
  assert.deepEqual(valuesForDates(series, ['2026-10-13', '2026-10-15', '2026-10-17', '2026-10-19']), [38, 38, 47, 39]);
});
test('the full date axis contains missing dates across month boundaries', () => {
  assert.deepEqual(datesBetween('2026-09-29', '2026-10-02'), ['2026-09-29', '2026-09-30', '2026-10-01', '2026-10-02']);
});

test('the long Play ACTIVE_USERS export is installed audience, never DAU', () => {
  const long = metricSeries.find(item => item.scope === 'play-installed-all');
  assert.equal(long.metric, 'installed');
  assert.equal(long.firstPositive, '2025-08-10');
  assert.ok(long.points.length > 1000);
  assert.ok(!metricSeries.some(item => item.scope === 'play-installed-all' && item.metric === 'dau'));
});

test('Apple page views and Play visitor users retain distinct units and missing dates', () => {
  const apple = forApp('yajalal', 'visitors');
  const play = metricSeries.find(item => item.app === 'yajalal' && item.scope === 'play-store-all');
  assert.equal(apple.source, 'App Store Connect');
  assert.equal(apple.unit, 'views');
  assert.equal(apple.unique, false);
  assert.equal(play.unit, 'users');
  assert.equal(play.unique, true);
  assert.deepEqual(valuesForDates(play, ['2026-10-19']), [null]);
});

test('legacy product history retains true daily users without inventing missing dates', () => {
  const today = metricSeries.find(item => item.app === 'yajalal' && item.scope === 'play-active-all');
  const choice = metricSeries.find(item => item.app === 'choose-window' && item.scope === 'play-active-all');
  assert.equal(today.firstPositive, '2025-08-10');
  assert.ok(today.points.length > 300);
  assert.deepEqual(valuesForDates(choice, ['2026-02-14', '2026-03-04', '2026-10-14']), [17, 21, null]);
  assert.equal(metricSeries.filter(item => item.app === 'yajalal' && item.source === 'Google Play' && item.metric === 'dau').length, 1);
});
