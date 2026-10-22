import test from 'node:test';
import assert from 'node:assert/strict';
import { marketingAccounts } from '../src/performance/marketingAccount.ts';
import { latestMarketingPosts, marketingObservations } from '../src/performance/marketing.ts';

test('a later cumulative post snapshot replaces its predecessor without adding or filling nulls', () => {
  const first = { platform: 'threads', url: 'https://www.threads.com/@posli.makes/post/example', content: 'same', publishedAt: '2026-10-01T10:00:00Z', observedAt: '2026-10-02T10:00:00Z', metrics: { views: 4, shares: null } };
  const revised = { ...first, observedAt: '2026-10-03T10:00:00Z', metrics: { views: 6, shares: null } };
  const result = latestMarketingPosts('threads', [revised, first, { ...first, platform: 'instagram' }]);
  assert.equal(result.length, 1);
  assert.equal(result[0].metrics.views, 6);
  assert.equal(result[0].metrics.shares, null);
});
test('public marketing observations preserve actual dates, units and public post URLs', () => {
  assert.ok(marketingObservations.length > 0);
  for (const item of marketingObservations) {
    assert.ok(Date.parse(item.observedAt) >= Date.parse(item.publishedAt));
    const url = new URL(item.url);
    assert.ok(['www.instagram.com', 'www.threads.com'].includes(url.hostname));
    assert.equal(url.search, '');
    for (const value of Object.values(item.metrics)) assert.ok(value === null || (Number.isFinite(value) && value >= 0));
  }
});

test('account summaries preserve unknown period boundaries and actual daily points', () => {
  for (const account of marketingAccounts) {
    if (account.periodDates) {
      assert.ok(account.periodDates.start <= account.periodDates.end);
      assert.ok(account.periodDates.end <= account.observedAt.slice(0, 10));
    }
    assert.ok(Date.parse(account.dailyObservedAt) <= Date.parse(account.observedAt));
    assert.ok(Number.isFinite(Date.parse(account.observedAt)));
    for (const points of Object.values(account.daily)) {
      assert.equal(new Set(points.map(point => point.date)).size, points.length);
      if (!account.chartRange) assert.equal(points.length, 0);
      for (const point of points) {
        assert.ok(Number.isFinite(point.value));
        assert.ok(point.date >= account.chartRange.start && point.date <= account.chartRange.end);
      }
    }
  }
});
