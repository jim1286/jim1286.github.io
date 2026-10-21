import { useState } from 'react';
import { StatisticGroup } from '@hjmds/react';
import { Link } from '@hjmds/react/actions';
import { Card } from '@hjmds/react/display';
import { BarChart, LineChart } from '@hjmds/react/chart';
import { Collapsible } from '@hjmds/react/collapsible';
import { Stack, Text } from '@hjmds/react/layout';
import { Tabs, TabPanel } from '@hjmds/react/navigation';
import { useHjmTheme } from '@hjmds/react/provider';
import { resolveDatavizSeriesColor } from '@hjmds/design-contracts/dataviz';
import { getCopy } from './i18n';
import { marketingAccounts, type AccountMarketingMetric } from './performance/marketingAccount';
import { datesBetween } from './performance/data';
import { latestMarketingPosts, type MarketingMetric, type MarketingPlatform } from './performance/marketing';

const c = getCopy();
const count = new Intl.NumberFormat('ko-KR');
const time = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
const day = (value: string) => new Date(value).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit' });
const metrics: { id: MarketingMetric; label: string }[] = [
  { id: 'views', label: c.performanceMarketingViews }, { id: 'likes', label: c.performanceMarketingLikes },
  { id: 'comments', label: c.performanceMarketingComments }, { id: 'profileVisits', label: c.performanceMarketingProfile },
];
function AccountPerformance({ platform }: { platform: MarketingPlatform }) {
  const { environment } = useHjmTheme();
  const [metric, setMetric] = useState<AccountMarketingMetric>('views');
  const account = marketingAccounts.find(item => item.platform === platform)!;
  const options = [{ id: 'views', label: c.performanceMarketingViews }, { id: 'interactions', label: c.performanceMarketingInteractions }, { id: 'viewers', label: c.performanceMarketingViewers }];
  const label = options.find(item => item.id === metric)!.label;
  const dates = account.chartRange ? datesBetween(account.chartRange.start, account.chartRange.end) : [];
  const values = new Map(account.daily[metric].map(point => [point.date, point.value]));
  const items = [
    { id: 'views', label: c.performanceMarketingViews, value: count.format(account.views) },
    { id: 'interactions', label: c.performanceMarketingInteractions, value: count.format(account.interactions) },
    { id: 'viewers', label: c.performanceMarketingViewers, value: count.format(account.viewers) },
    { id: 'followers', label: c.performanceMarketingFollowers, value: count.format(account.followers), hint: account.followersAsOf },
    ...(account.profileActivity === null ? [] : [{ id: 'profile', label: c.performanceMarketingProfileActivity, value: count.format(account.profileActivity) }]),
    ...(account.netFollowers === null ? [] : [{ id: 'net', label: c.performanceMarketingNetFollowers, value: count.format(account.netFollowers) }]),
  ];
  return <Card title={c.performanceMarketingAccount} headingLevel={2} padding="lg"><Stack gap="md">
    <Text variant="caption" tone="muted">{account.windowLabel} · {c.performanceMarketingObserved} {time(account.observedAt)} KST</Text>
    {dates.length > 0 && <>
      <Tabs id="marketing-account-metric" label={c.performanceMarketingDaily} value={metric} onValueChange={value => setMetric(value as AccountMarketingMetric)} items={options} renderPanels={false} />
      <LineChart categories={dates.map(date => date.slice(5).replace('-', '.'))}
        series={[{ id: metric, label, color: resolveDatavizSeriesColor(environment.theme, 0), values: dates.map(date => values.get(date) ?? null) }]}
        accessibilityLabel={`${platform} ${c.performanceMarketingDaily} ${label}`} height={240} curve="linear" area={false} showAxis missingConnection="none"
        formatValue={value => count.format(value)} missingLabel={c.performanceMissing} />
    </>}
    <StatisticGroup label={c.performanceMarketingAccount} density="compact" descriptor={{ columns: 2, items }} />
    <Text as="p" variant="caption" tone="muted">{account.chartRange ? c.performanceMarketingThreadsRange : c.performanceMarketingNoDaily}</Text>
    <Collapsible trigger={c.performanceMarketingNotes}><Text as="p" variant="caption" tone="muted">{c.performanceMarketingWindowNote}</Text></Collapsible>
  </Stack></Card>;
}
export function MarketingPanel() {
  const { environment } = useHjmTheme();
  const [platform, setPlatform] = useState<MarketingPlatform>('instagram');
  const [metric, setMetric] = useState<MarketingMetric>('views');
  const posts = latestMarketingPosts(platform);
  const last = posts.at(-1)!;
  const platformName = platform === 'instagram' ? 'Instagram' : 'Threads';
  const label = metrics.find(item => item.id === metric)!.label;
  return <Stack gap="lg">
    <Text as="p" variant="caption" tone="muted">{c.performanceMarketingIntro}</Text>
    <Tabs id="marketing-channel" label={c.performanceMarketing} value={platform} onValueChange={value => setPlatform(value as MarketingPlatform)}
      items={[{ id: 'instagram', label: 'Instagram' }, { id: 'threads', label: 'Threads' }]} renderPanels={false} />
    <TabPanel tabsId="marketing-channel" value={platform} activeValue={platform} mode="keyed">
      <Stack gap="lg">
        <AccountPerformance platform={platform} key={platform} />
        <Collapsible trigger={c.performanceMarketingPosts}><Stack gap="lg">
        <Card title={`${platformName} · ${c.performanceMarketingChart}`} headingLevel={2} padding="lg"><Stack gap="md">
          <Tabs id="marketing-metric" label={c.performanceKeyMetrics} value={metric} onValueChange={value => setMetric(value as MarketingMetric)}
            items={metrics.map(item => ({ id: item.id, label: item.label }))} renderPanels={false} />
          <BarChart categories={posts.map((post, index) => `${index + 1} · ${day(post.publishedAt)}`)}
            series={[{ id: metric, label, values: posts.map(post => post.metrics[metric]), color: resolveDatavizSeriesColor(environment.theme, 0) }]}
            accessibilityLabel={`${platformName} ${label} · ${c.performanceMarketingSnapshot}`} height={240}
            formatValue={value => count.format(value)} missingLabel={c.performanceMissing} showAxis showValues />
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingChartNote}</Text>
        </Stack></Card>
        <Card title={c.performanceMarketingLatest} headingLevel={2} padding="lg"><Stack gap="md">
          <Text variant="caption" tone="muted">{c.performanceMarketingPublished} {time(last.publishedAt)} / {c.performanceMarketingObserved} {time(last.observedAt)} KST</Text>
          <StatisticGroup label={`${platformName} ${c.performanceMarketingLatest}`} density="compact" descriptor={{ columns: 2, items: metrics.map(item => ({ id: item.id, label: item.label, value: last.metrics[item.id] === null ? '—' : count.format(last.metrics[item.id]!) })) }} />
          <Link href={last.url} variant="standalone" tone="neutral">{c.performanceMarketingPostLink} ↗</Link>
        </Stack></Card>
        <Collapsible trigger={c.performanceMarketingReference}><Stack gap="md">
          {posts.map((post, index) => <Card key={post.url} title={`${index + 1} · ${day(post.publishedAt)}`} headingLevel={3} padding="md"><Stack gap="sm">
            <Text variant="caption" tone="muted">{c.performanceMarketingPublished} {time(post.publishedAt)} / {c.performanceMarketingObserved} {time(post.observedAt)} KST</Text>
            <StatisticGroup label={`${platformName} ${index + 1}`} density="compact" descriptor={{ columns: 2, items: [
              ...metrics, { id: 'saves' as const, label: c.performanceMarketingSaves }, { id: 'shares' as const, label: c.performanceMarketingShares },
            ].map(item => ({ id: item.id, label: item.label, value: post.metrics[item.id] === null ? '—' : count.format(post.metrics[item.id]!) })) }} />
            <Link href={post.url} variant="standalone" tone="neutral">{c.performanceMarketingPostLink} ↗</Link>
          </Stack></Card>)}
        </Stack></Collapsible>
        </Stack></Collapsible>
        <Collapsible trigger={c.performanceMarketingNotes}><Stack gap="sm">
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingScope}</Text>
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingCaveat}</Text>
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingAttribution}</Text>
        </Stack></Collapsible>
      </Stack>
    </TabPanel>
  </Stack>;
}
