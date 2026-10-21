import { useState } from 'react';
import { StatisticGroup } from '@hjmds/react';
import { Link } from '@hjmds/react/actions';
import { Card, Tag } from '@hjmds/react/display';
import { BarChart } from '@hjmds/react/chart';
import { Collapsible } from '@hjmds/react/collapsible';
import { Stack, Text } from '@hjmds/react/layout';
import { Tabs, TabPanel } from '@hjmds/react/navigation';
import { useHjmTheme } from '@hjmds/react/provider';
import { resolveDatavizSeriesColor } from '@hjmds/design-contracts/dataviz';
import { getCopy } from './i18n';
import { latestMarketingPosts, type MarketingMetric, type MarketingPlatform } from './performance/marketing';

const c = getCopy();
const count = new Intl.NumberFormat('ko-KR');
const time = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
const day = (value: string) => new Date(value).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit' });
const metrics: { id: MarketingMetric; label: string }[] = [
  { id: 'views', label: c.performanceMarketingViews }, { id: 'likes', label: c.performanceMarketingLikes },
  { id: 'comments', label: c.performanceMarketingComments }, { id: 'profileVisits', label: c.performanceMarketingProfile },
];
export function MarketingPanel() {
  const { environment } = useHjmTheme();
  const [platform, setPlatform] = useState<MarketingPlatform>('instagram');
  const [metric, setMetric] = useState<MarketingMetric>('views');
  const posts = latestMarketingPosts(platform);
  const last = posts.at(-1)!;
  const platformName = platform === 'instagram' ? 'Instagram' : 'Threads';
  const label = metrics.find(item => item.id === metric)!.label;
  return <Stack gap="lg">
    <Text as="p">{c.performanceMarketingIntro}</Text>
    <Text as="p" variant="caption" tone="muted">{c.performanceMarketingScope}</Text>
    <Tabs id="marketing-channel" label={c.performanceMarketing} value={platform} onValueChange={value => setPlatform(value as MarketingPlatform)}
      items={[{ id: 'instagram', label: 'Instagram' }, { id: 'threads', label: 'Threads' }]} renderPanels={false} />
    <TabPanel tabsId="marketing-channel" value={platform} activeValue={platform} mode="keyed">
      <Stack gap="lg">
        <Card title={`${platformName} · ${c.performanceMarketingChart}`} headingLevel={2} padding="lg"><Stack gap="md">
          <Tag>{c.performanceMarketingSnapshot}</Tag>
          <Tabs id="marketing-metric" label={c.performanceKeyMetrics} value={metric} onValueChange={value => setMetric(value as MarketingMetric)}
            items={metrics.map(item => ({ id: item.id, label: item.label }))} renderPanels={false} />
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingChartNote}</Text>
          <BarChart categories={posts.map((post, index) => `${index + 1} · ${day(post.publishedAt)}`)}
            series={[{ id: metric, label, values: posts.map(post => post.metrics[metric]), color: resolveDatavizSeriesColor(environment.theme, 0) }]}
            accessibilityLabel={`${platformName} ${label} · ${c.performanceMarketingSnapshot}`} height={240}
            formatValue={value => count.format(value)} missingLabel={c.performanceMissing} showAxis showValues />
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
        <Collapsible trigger={c.performanceMarketingNotes}><Stack gap="sm">
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingCaveat}</Text>
          <Text as="p" variant="caption" tone="muted">{c.performanceMarketingAttribution}</Text>
        </Stack></Collapsible>
      </Stack>
    </TabPanel>
  </Stack>;
}
