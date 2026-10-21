import { useState } from 'react';
import { StatisticGroup, Timeline } from '@hjmds/react';
import { Link } from '@hjmds/react/actions';
import { Badge, Card, Tag } from '@hjmds/react/display';
import { EmptyState } from '@hjmds/react/feedback';
import { Heading } from '@hjmds/react/heading';
import { Grid, Section, Stack, Text } from '@hjmds/react/layout';
import { Tabs, TabPanel } from '@hjmds/react/navigation';
import { SegmentedControl } from '@hjmds/react/selection';
import { ChartLegend, LineChart } from '@hjmds/react/chart';
import { useHjmTheme } from '@hjmds/react/provider';
import { resolveDatavizSeriesColor } from '@hjmds/design-contracts/dataviz';
import { chartRecipe } from '@hjmds/design-contracts/components/chart';
import { DataTable } from '@hjmds/react/data-table';
import { Collapsible } from '@hjmds/react/collapsible';
import { getCopy } from './i18n';
import { apps } from './siteData';
import { accountRevenueTotal, capturedAt, comparison, datesBetween, forApp, latest, metricSeries, periodEnd, valuesForDates, type Metric, type MetricSeries } from './performance/data';

const c = getCopy();
// Outcome reporting covers the seven active products; archived products and the
// portfolio website were explicitly excluded by the user on 2026-10-21.
const products = apps;
const metrics: { id: Metric; label: string }[] = [{ id: 'dau', label: c.performanceDau }, { id: 'new', label: c.performanceNew }, { id: 'visitors', label: c.performanceVisitors }, { id: 'revenue', label: c.performanceRevenue }];
const number = new Intl.NumberFormat('ko-KR', { maximumFractionDigits: 1 });
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const dateLabel = (date: string) => date.replaceAll('-', '.');
const collectedLabel = new Date(capturedAt).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul', hour12: false });
const appName = (id: string) => products.find(app => app.id === id)?.name ?? id;
const formatValue = (metric: Metric, value: number) => metric === 'revenue' ? money.format(value) : number.format(value);
function sourceLabel(series: MetricSeries) {
  const scopes = { android: c.performancePlayScope, 'ios-kr-banner': c.performanceIosBanner, 'admob-account': c.performanceAccountScope, 'ga4-all': c.performanceGa4Scope, 'ios-observed': c.performanceIosObserved, 'android-observed': c.performanceAndroidObserved,
    'apple-store-all': c.performanceAppleStoreScope, 'play-store-all': c.performancePlayStoreScope, 'play-installed-all': c.performancePlayInstalledScope, 'play-active-all': c.performancePlayActiveScope };
  return `${series.source} · ${scopes[series.scope]} · ${series.timeZone ?? c.performanceUnknownZone}`;
}
const unitLabel = (series: MetricSeries) => series.unit === 'views' ? c.performanceViewsUnit : series.unit === 'devices' ? c.performanceDevicesUnit : c.performancePeopleUnit;
function metricSummary(app: string, metric: Metric) {
  const series = forApp(app, metric);
  const point = series && latest(series);
  const label = metric === 'visitors' && series?.source === 'App Store Connect' ? c.performanceProductPageViews : metrics.find(item => item.id === metric)?.label ?? c.performanceInstalled;
  if (!point || !series) return { id: metric, label, value: '—', hint: c.performanceMissing };
  const diff = metric !== 'revenue' ? comparison(series, 1) : null;
  const delta = diff ? `${c.performancePreviousDay} ${diff.delta > 0 ? '+' : ''}${number.format(diff.delta)}${diff.percent === null ? '' : ` (${diff.percent > 0 ? '+' : ''}${number.format(diff.percent)}%)`}` : '';
  return { id: metric, label, value: formatValue(metric, point.value), suffix: metric === 'revenue' ? undefined : unitLabel(series), hint: `${dateLabel(point.date)} · ${metric === 'revenue' ? `${sourceLabel(series)} · ${c.performanceEstimatedRounded}` : series.source}${point.provisional ? ` · ${c.performanceProvisional}` : ''}${delta ? ` · ${delta}` : ''}` };
}
function AppSummary({ app }: { app: typeof products[number] }) {
  const available = metrics.filter(metric => forApp(app.id, metric.id));
  return <Card title={app.name} headingLevel={3} padding="lg"
    badges={['utilverse', 'spint'].includes(app.id) ? <Badge variant="outline">{c.performanceClosedTest}</Badge> : undefined}
    actions={<Link href={`#performance/${app.id}`} variant="standalone" tone="neutral">{c.performanceViewApp} →</Link>}>
    <StatisticGroup label={`${app.name} ${c.performanceKeyMetrics}`} descriptor={{ columns: 2, items: available.map(metric => metricSummary(app.id, metric.id)) }} />
  </Card>;
}
function Trends({ app }: { app: string | null }) {
  const { environment } = useHjmTheme();
  const [metric, setMetric] = useState<Metric>('dau');
  const [period, setPeriod] = useState('month');
  const [source, setSource] = useState<string>(app ? forApp(app, 'dau')?.source ?? 'GA4' : 'Google Play');
  const candidates = metricSeries.filter(item => item.metric === metric && (app === null ? metric === 'revenue' ? item.app === null : item.app !== null && products.some(product => product.id === item.app) : item.app === app));
  const sources = [...new Set(candidates.filter(item => item.points.length).map(item => item.source))];
  const activeSource = sources.includes(source as MetricSeries['source']) ? source : sources[0];
  // GA4 active users and Play DAU have distinct definitions: source selection
  // changes the whole plot rather than joining incompatible observations.
  const series = candidates.filter(item => item.source === activeSource && item.points.length > 0);
  const points = series.flatMap(item => item.points);
  const weekStart = new Date(`${periodEnd}T00:00:00Z`);
  weekStart.setUTCDate(weekStart.getUTCDate() - (period === 'week' ? 6 : 29));
  const start = period === 'all' ? points.map(point => point.date).sort()[0] ?? periodEnd : weekStart.toISOString().slice(0, 10);
  const dates = datesBetween(start, periodEnd);
  const chartSeries = series.map((item, index) => ({ id: item.id,
    label: `${item.app ? appName(item.app) : c.performanceAccountScope}${item.testTraffic === 'closed-test' ? ` · ${c.performanceClosedTest}` : ''}${item.source === 'AdMob' && item.app ? ` · ${item.scope === 'ios-kr-banner' ? c.performanceIosBanner : item.scope === 'android-observed' ? c.performanceAndroidObserved : c.performanceIosObserved}` : ''}`,
    values: valuesForDates(item, dates), color: resolveDatavizSeriesColor(environment.theme, index) }));
  const hasValues = series.some(item => valuesForDates(item, dates).some(value => value !== null));
  return <Card title={c.performanceTrend} headingLevel={2} padding="lg"><Stack gap="lg">
    <Text variant="caption" tone="muted">{c.performanceSnapshotNote}</Text>
    <StatisticGroup label={c.performanceOverview} presentation="surface" descriptor={{ columns: 2, items: app ? [
      metricSummary(app, 'dau'), metricSummary(app, 'new'),
      metricSummary(app, 'visitors'),
      metricSummary(app, 'revenue'),
    ] : [
      { id: 'coverage', label: c.performanceObservedProducts, value: `${products.filter(product => metricSeries.some(item => item.app === product.id)).length} / ${products.length}`, hint: c.performanceCoverageHint },
      { id: 'revenue', label: c.performanceAccountRevenue, value: money.format(accountRevenueTotal.value), hint: `${dateLabel(accountRevenueTotal.start)} — ${dateLabel(accountRevenueTotal.end)} · ${c.performanceEstimated}` },
    ] }} />
    <Tabs id="performance-metric" label={c.performanceKeyMetrics} value={metric} onValueChange={value => setMetric(value as Metric)}
      indicator="solid" items={metrics.map(item => ({ id: item.id, label: item.label }))} renderPanels={false} />
    {sources.length > 1 && <SegmentedControl label={c.performanceSource} value={activeSource} onValueChange={setSource} presentation="pills"
      items={sources.map(value => ({ value, label: value === 'GA4' ? c.performanceGa4Source : value === 'App Store Connect' ? c.performanceAppleSource : metric === 'visitors' ? c.performancePlayVisitorsSource : c.performancePlaySource }))} />}
    <SegmentedControl label={c.performancePeriod} value={period} onValueChange={setPeriod} presentation="pills"
      items={[{ value: 'week', label: c.performanceWeek }, { value: 'month', label: c.performanceMonth }, { value: 'all', label: c.performanceAllPeriod }]} />
    <TabPanel tabsId="performance-metric" activeValue={metric} value={metric} mode="keyed" key={metric}>
      {hasValues ? <Stack gap="md">
        <Text variant="caption" tone="muted">{dateLabel(start)} — {dateLabel(periodEnd)} · {metric === 'revenue' ? c.performanceRevenueUnit : unitLabel(series[0])}</Text>
        <LineChart categories={dates.map(date => date.slice(start.slice(0, 4) === periodEnd.slice(0, 4) ? 5 : 2).replaceAll('-', '.'))}
          series={chartSeries}
          accessibilityLabel={`${app ? appName(app) : c.performanceAll} ${metrics.find(item => item.id === metric)!.label} ${c.performanceTrend}`}
          formatValue={value => formatValue(metric, value)} missingLabel={c.performanceMissing} height={chartRecipe.heights.tall} curve="linear" area={false} showAxis missingConnection="none" />
        <ChartLegend items={chartSeries.map(({ id, label, color }) => ({ id, label, color }))} />
        <Collapsible trigger={c.performanceCollectionNotes}><Stack gap="sm">
          {[...new Set(series.map(sourceLabel))].map(label => <Text key={label} variant="caption" tone="muted">{label}</Text>)}
          <Text as="p" variant="caption" tone="muted">{metric === 'revenue' ? c.performanceRevenueCaveat : metric === 'visitors' ? c.performanceVisitorsCaveat : activeSource === 'GA4' ? c.performanceGa4Caveat : c.performanceUsersCaveat}</Text>
          <Text as="p" variant="caption" tone="muted">{c.performanceGapNote}</Text>
        </Stack></Collapsible>
      </Stack> : <EmptyState density="compact" title={c.performanceMissing} description={c.performanceMissingBody} />}
    </TabPanel>
  </Stack></Card>;
}
function Overview() {
  const observed = products.filter(app => metricSeries.some(series => series.app === app.id));
  const missing = products.filter(app => !observed.includes(app));
  return <Stack gap="xl">
    <Trends app={null} />
    <Section title={c.performanceByApp} description={c.performanceSnapshotNote}>
      <Grid columns={{ compact: 1, expanded: 2 }} gap={{ compact: 'lg' }}>
        {observed.map(app => <AppSummary app={app} key={app.id} />)}
      </Grid>
    </Section>
    <Collapsible trigger={c.performanceCoverage}><Stack gap="md">
      <DataTable columns={[{ id: 'app', header: c.performanceProduct }, { id: 'dau', header: c.performanceDau }, { id: 'installed', header: c.performanceInstalled }, { id: 'revenue', header: c.performanceRevenue }]}
        rows={products.map(app => ({ id: app.id }))} labels={{ table: c.performanceCoverage, selectAll: c.performanceAll, selectRow: appName, sortColumn: label => label }}
        renderCell={(id, column) => column === 'app' ? <Link href={`#performance/${id}`} variant="standalone" tone="neutral">{appName(id)}</Link> : (() => {
          const summary = metricSummary(id, column as Metric);
          return <Stack gap="xxs"><Text>{summary.value}</Text><Text variant="caption" tone="muted">{summary.hint}</Text></Stack>;
        })()} />
      {missing.length > 0 && <Text as="p" tone="muted" variant="caption">{missing.map(app => app.name).join(' · ')} — {c.performanceNotCollected}</Text>}
    </Stack></Collapsible>
  </Stack>;
}
function Milestones({ app }: { app: string }) {
  const items = [
    { id: 'baseballrecords', app: 'yajalal', date: '2026-10-16', title: c.evolutionBaseballrecordsTitle, description: c.performanceMilestoneData },
    { id: 'toolbox', app: 'utilverse', date: '2026-10-01', title: c.evolutionToolboxTitle, description: c.performanceMilestoneNoBefore },
    { id: 'expo', app: 'choose-window', date: '2026-10-18', title: c.evolutionExpoTitle, description: c.performanceMilestoneNoRevenue },
    { id: 'handwriting', app: 'diairy', date: '2026-10-05', title: c.evolutionHandwritingTitle, description: c.performanceMilestoneNoRevenue },
    { id: 'runnablefeed', app: 'burntok', date: '2026-09-26', title: c.evolutionRunnablefeedTitle, description: c.performanceMilestoneNoBefore },
    { id: 'meadow', app: 'spint', date: '2026-10-13', title: c.evolutionMeadowTitle, description: c.performanceMilestoneAfter },
    { id: 'flightlookup', app: 'unairplane', date: '2026-10-08', title: c.evolutionFlightlookupTitle, description: c.performanceMilestoneNoRevenue },
  ].filter(item => item.app === app);
  return <Card title={c.performanceDevelopment} headingLevel={2} padding="lg"><Stack gap="lg">
    {items.length ? <Timeline items={items.map(item => ({ id: item.id, label: item.title, timestamp: dateLabel(item.date), dateTime: item.date, description: item.description }))}
      composeAccessibleName={({ position, total, label }) => `${position}/${total} ${label}`}
      renderActions={() => <Link href="#history" variant="standalone" tone="neutral">{c.performanceHistoryLink} →</Link>} /> : <Text as="p" tone="muted">{c.performanceMilestoneMissing}</Text>}
    <Text as="p" variant="caption" tone="muted">{c.performanceNoCausality}</Text>
  </Stack></Card>;
}
export function PerformancePanel() {
  const route = window.location.hash.split('/')[1];
  const selected = products.some(app => app.id === route) ? route : 'all';
  return <Stack gap="xl">
    <Stack gap="md" layoutStyle={{ maxWidth: 760 }}>
      <Text variant="caption" fontRole="code" tone="muted">04 / OUTCOMES</Text>
      <Heading level="level1">{c.performanceTitle}</Heading>
      <Text as="p" variant="bodyLarge" tone="muted">{c.performanceIntro}</Text>
      <Stack axis="inline" gap="xs" wrap><Tag>{`${c.performanceCaptured} ${collectedLabel} KST`}</Tag><Tag>{c.performanceSnapshot}</Tag></Stack>
    </Stack>
    <Tabs id="performance-products" label={c.performanceProductSelect} value={selected} onValueChange={value => { window.location.hash = value === 'all' ? 'performance' : `performance/${value}`; }}
      overflow="scroll" indicator="solid" items={[{ id: 'all', label: c.performanceAll }, ...products.map(app => ({ id: app.id, label: app.name }))]} renderPanels={false} />
    <TabPanel tabsId="performance-products" value={selected} activeValue={selected} mode="keyed" key={selected}>
      {selected === 'all' ? <Overview /> : <Stack gap="xl">
        <Trends app={selected} />
        {['utilverse', 'spint'].includes(selected) && <Badge variant="outline">{c.performanceClosedTestNote}</Badge>}
        <Milestones app={selected} />
      </Stack>}
    </TabPanel>
    <Text as="p" tone="muted" variant="caption">{c.performanceDefinitions}</Text>
  </Stack>;
}
