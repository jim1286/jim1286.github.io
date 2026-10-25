import { ImageViewer } from '@hjmds/react/image-viewer';
import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react';
import { HjmProvider } from '@hjmds/react/provider';
import { Link } from '@hjmds/react/actions';
import { Container, Grid, Section, Stack, Surface, Text } from '@hjmds/react/layout';
import { Badge, Card, Tag } from '@hjmds/react/display';
import { Heading } from '@hjmds/react/heading';
import { Asset } from '@hjmds/react/asset';
import { TopBar } from '@hjmds/react/top-bar';
import { ScreenLayout } from '@hjmds/react/screens';
import { SkipNav } from '@hjmds/react/skip-nav';
import { Tabs, TabPanel } from '@hjmds/react/navigation';
import { Collapsible } from '@hjmds/react/collapsible';
import { Top } from '@hjmds/react/top';
import { CodeBlock } from '@hjmds/react/code-block';
import { AndroidFilled, AppleFilled, ExportOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import '@hjmds/react/styles.css';
import { getCopy } from './i18n';
import { siteCopy, appCopy } from './copy';
import { apps, discontinuedApps, legalDocuments, portfolioSummary, storybookUrl, type PortfolioApp } from './siteData';
import './styles/site.css';
import { EvolutionHistory } from './EvolutionHistory';
import { PerformancePanel } from './PerformancePanel';
import { ReleaseNotesPanel } from './ReleaseNotesPanel';
import { DrillArchitecture } from './architecture/DrillArchitecture';
import { ExternalLink, Notes } from './shared';

const c = getCopy();
const developerEmail = 'jimin1286@gmail.com';
const tabItems = [
  { id: 'about', label: c.navOverview }, { id: 'structure', label: c.navStructure },
  { id: 'design', label: c.navArchitecture }, { id: 'apps', label: c.navProducts },
  { id: 'performance', label: c.performanceNav }, { id: 'history', label: c.historyNav }, { id: 'support', label: c.navContact },
];
// Preserve links already shared by the single-page portfolio. Hash changes also
// restore the right panel on browser Back/Forward and locale direct entry.
function tabForHash(hash: string) {
  // Sub-routes such as #design/arch/ci keep their topic; the panel reads the rest of the path.
  const id = hash.slice(1).split('/')[0];
  // 2026-10-21: operations and QA moved into the design drill-down; their old links open it.
  const aliases: Record<string, string> = { releases: 'apps', top: 'about', main: 'about', developer: 'about', discontinued: 'apps', legal: 'support', guidelines: 'design', operations: 'design', workflow: 'design', strategy: 'design', marketing: 'design', guidance: 'design', qa: 'design' };
  return aliases[id] ?? (tabItems.some(item => item.id === id) ? id : 'about');
}
// Each topic panel is mounted alone (keyed TabPanel), so its HJM Top is the page's only h1.
// The reading measure stays a layout-only width (2026-10-18: replaced the .panel-intro wrapper).
function Intro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <Top descriptor={{ eyebrow, title, description }} layoutStyle={{ maxWidth: 760 }} />;
}
function Diagram({ name, title, caption }: { name: string; title: string; caption: string }) {
  return <Card title={title} headingLevel={2} padding="lg" actions={<ExternalLink href={`/diagrams/${name}.html?theme=light`}>{c.diagramOpen} <ExportOutlined aria-hidden /></ExternalLink>}>
    <Stack gap="lg">
      {/* These are product-owned technical illustrations. HJM retains the card,
          heading and action structure; the renderer owns diagram geometry. */}
      <div className="diagram-scroll" role="region" aria-label={title} tabIndex={0}>
        <img className="diagram-image" src={`/diagrams/${name}.svg`} alt={caption} loading="lazy" />
      </div>
      <Text as="p" variant="caption" tone="muted">{caption}</Text>
      <span className="diagram-mobile-hint"><Text variant="caption" tone="muted">{c.diagramScroll}</Text></span>
    </Stack>
  </Card>;
}
function AppLinks({ app }: { app: PortfolioApp }) {
  return <Stack axis="inline" gap="sm" wrap role="group" aria-label={appCopy.open(app.name)}>
    {app.webUrl && <ExternalLink href={app.webUrl} label={appCopy.web(app.name)}><ExportOutlined aria-hidden /> {siteCopy.web}</ExternalLink>}
    {app.iosUrl && <ExternalLink href={app.iosUrl} label={appCopy.ios(app.name)}><AppleFilled aria-hidden /> {siteCopy.appStore}</ExternalLink>}
    {app.androidUrl && <ExternalLink href={app.androidUrl} label={appCopy.android(app.name)}><AndroidFilled aria-hidden /> {siteCopy.googlePlay}</ExternalLink>}
    {app.sourceAccess === 'public' && <ExternalLink href={app.githubUrl}><GithubOutlined aria-hidden /> {siteCopy.source}</ExternalLink>}
    {!app.webUrl && !app.iosUrl && !app.androidUrl && app.sourceAccess === 'private' && <Text variant="caption" tone="muted">{siteCopy.privateSource}</Text>}
  </Stack>;
}
const designNotes: Record<string, string> = {
  yajalal: c.appDesignYajalal, 'choose-window': c.appDesignChoose, burntok: c.appDesignBurntok,
  unairplane: c.appDesignUnairplane, diairy: c.appDesignDiairy, spint: c.appDesignSpint, utilverse: c.appDesignUtilverse,
};
function ProductCard({ app }: { app: PortfolioApp }) {
  return <Card title={app.name} headingLevel={3} description={app.englishName === app.name ? undefined : app.englishName}
    leading={<Asset descriptor={{ kind: 'image', size: 'large', shape: 'rounded', decorative: true }}><img src={app.icon} alt="" /></Asset>}
    badges={<Badge variant={app.statusTone === 'live' ? 'filled' : 'outline'}>{app.status}</Badge>}
    padding="lg" tone={app.statusTone === 'archived' ? 'sunken' : 'raised'} actions={app.statusTone !== 'archived' ? <AppLinks app={app} /> : undefined}>
    <Stack gap="md">
      <Stack gap="xs"><Text variant="caption" emphasis="strong">{app.statusTone === 'archived' ? c.pastProducts : c.productPurpose}</Text><Text as="p">{app.description}</Text></Stack>
      {designNotes[app.id] && <Stack gap="xs"><Text variant="caption" emphasis="strong">{c.productDecision}</Text><Text as="p" variant="body" tone="muted">{designNotes[app.id]}</Text></Stack>}
      {app.tags.length > 0 && <Stack axis="inline" gap="xs" wrap aria-label={appCopy.technologies(app.name)}>{app.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</Stack>}
    </Stack>
  </Card>;
}
function AboutPanel() {
  const [photoOpen, setPhotoOpen] = useState(false);
  const journey = [[c.journey1, c.journey1Body], [c.journey2, c.journey2Body], [c.journey3, c.journey3Body], [c.journey4, c.journey4Body]];
  return <Stack gap="xl">
    <div className="chapter-block">
      <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }}>
        <Surface padding="xl" radius="lg"><Stack gap="xl">
          <Text variant="caption" fontRole="code" tone="muted">{c.heroRole}</Text>
          <Heading level="level1"><span className="hero-title">{c.heroTitle}</span></Heading>
          <Text as="p" variant="bodyLarge" tone="muted">{c.heroBody}</Text>
          <Stack axis="inline" gap="xs" wrap><Link href="#apps" variant="standalone" tone="neutral">{c.heroAction} →</Link><Link href="#design" variant="standalone" tone="neutral">{c.heroSecondary} →</Link></Stack>
        </Stack></Surface>
        <Surface padding="lg"><Stack gap="lg">
          <button type="button" className="profile-photo-trigger" aria-label={siteCopy.developerAlt} onClick={() => setPhotoOpen(true)}><img className="profile-photo" src="/profile.jpg" alt="" /></button>
          <ImageViewer open={photoOpen} onClose={() => setPhotoOpen(false)} items={[{ id: 'profile', uri: '/profile.jpg', label: siteCopy.developerAlt }]}
            closeLabel={c.photoClose} previousLabel={c.photoPrevious} nextLabel={c.photoNext} loadingLabel={c.photoLoading} errorLabel={c.photoError} retryLabel={c.photoRetry} />
          <Heading level="level2">{c.portfolioName} · {c.portfolioRole}</Heading>
          <Text as="p" tone="muted">{c.profileBody}</Text>
          <Stack axis="inline" gap="sm" wrap><Tag>React · TypeScript</Tag><Tag>{c.personalProductCount.replace('{count}', String(portfolioSummary.appCount))}</Tag></Stack>
          <Link href={`mailto:${developerEmail}`} variant="standalone" tone="neutral"><MailOutlined aria-hidden /> {developerEmail}</Link>
        </Stack></Surface>
      </Grid>
    </div>
    <div className="chapter-block"><Section title={c.overviewScope} description={c.overviewScopeBody}>
      <Grid columns={{ compact: 1, medium: 2, expanded: 4 }} gap={{ compact: 'md' }}>
        {journey.map(([title, body], i) => <Card key={title} title={title} headingLevel={3} padding="lg" tone="sunken"><Stack gap="md"><Text variant="caption" fontRole="code" tone="muted">0{i + 1}</Text><Text as="p">{body}</Text></Stack></Card>)}
      </Grid>
    </Section></div>
    <div className="chapter-block"><Section title={c.overviewEvidence} description={c.overviewEvidenceBody}>
      <Grid columns={{ compact: 1, expanded: 3 }} gap={{ compact: 'lg' }}>
        {[[c.overviewHubble, c.overviewHubbleBody, '#apps', c.nextProducts], [c.overviewHjm, c.overviewHjmBody, '#design', c.nextDesign], [c.overviewProducts, c.overviewProductsBody, '#apps', c.nextProducts]].map(([title, body, href, label]) => <Card key={title} title={title} headingLevel={3} padding="lg" actions={<Link href={href} variant="standalone" tone="neutral">{label}</Link>}><Text as="p" tone="muted">{body}</Text></Card>)}
      </Grid>
    </Section></div>
    <Surface padding="xl" tone="sunken" radius="lg"><Stack gap="md"><Heading level="level2">{c.overviewAi}</Heading><Text as="p" tone="muted">{c.overviewAiBody}</Text></Stack></Surface>

  </Stack>;
}
function WorkCases() {
  return <Section title={c.workCases} description={c.workCasesBody}><Stack gap="lg">
    {[
      { title: c.hubbleTitle, problem: c.hubbleProblem, role: c.hubbleLead, detail: c.hubbleDetail, result: c.hubbleResult, boundary: c.hubbleBoundary, diagram: 'hubble' },
      { title: c.exploreTitle, problem: c.exploreProblem, role: c.exploreLead, detail: c.exploreDetail, result: c.exploreResult, boundary: c.exploreBoundary, diagram: 'exploreqa' },
    ].map(item => <Card key={item.title} title={item.title} description={c.hubbleCategory} headingLevel={3} padding="xl"><Stack gap="lg">
      <Text as="p" variant="bodyLarge">{item.role}</Text>
      <Grid columns={{ compact: 1, expanded: 3 }} gap={{ compact: 'lg' }}>
        {[[c.caseProblem, item.problem], [c.caseRole, item.detail], [c.caseOutcome, item.result]].map(([title, body]) => <Stack key={title} gap="sm"><Text emphasis="strong">{title}</Text><Text as="p" tone="muted">{body}</Text></Stack>)}
      </Grid>
      <Text variant="caption" tone="muted">{item.boundary}</Text>
      <Collapsible trigger={c.caseDetail}><Diagram name={item.diagram} title={item.title} caption={item.boundary} /></Collapsible>
    </Stack></Card>)}
  </Stack></Section>;
}
function AppsPanel() {
  const route = window.location.hash.slice(1).split('/');
  // Previously shared release links now open the same app inside Products.
  const legacyRelease = route[0] === 'releases';
  const selected = apps.find(app => app.id === route[1]);
  const appId = selected?.id ?? (legacyRelease ? apps[0].id : 'all');
  const view = legacyRelease || route[2] === 'releases' ? 'releases' : 'intro';
  return <Stack gap="xl">
    <Tabs id="product-apps" label={c.productsAppTabs} value={appId}
      onValueChange={value => { window.location.hash = value === 'all' ? 'apps' : `apps/${value}/${view}`; }}
      indicator="solid" items={[{ id: 'all', label: c.productsAll }, ...apps.map(app => ({ id: app.id, label: app.name }))]} renderPanels={false} />
    <TabPanel tabsId="product-apps" value={appId} activeValue={appId} mode="keyed">
      {appId === 'all' ? <Stack gap="xl">
        <Intro eyebrow="03 / PRODUCTS" title={c.productsTitle} description={c.productsIntro} />
    <div className="chapter-block"><WorkCases /></div>
    <div className="chapter-block"><Section title={c.personalProducts} description={c.personalProductsBody}>
      <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }} minColumnWidth={{ compact: 280 }}>{apps.map(app => <ProductCard key={app.id} app={app} />)}</Grid>
    </Section></div>
    <Section id="discontinued" tabIndex={-1} title={c.pastProducts} description={c.discontinuedDescription}>
      <Collapsible trigger={c.discontinuedTitle} defaultOpen={window.location.hash === '#discontinued'}><Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }}>{discontinuedApps.map(app => <ProductCard key={app.id} app={app} />)}</Grid></Collapsible>
    </Section>
      </Stack> : <Stack gap="lg">
        <Tabs id="product-content" label={c.productsContentTabs} value={view}
          onValueChange={value => { window.location.hash = `apps/${appId}/${value}`; }}
          indicator="solid" items={[{ id: 'intro', label: c.productsAppIntro }, { id: 'releases', label: c.releaseNotesNav }]} renderPanels={false} />
        <TabPanel tabsId="product-content" value={view} activeValue={view} mode="keyed">
          {view === 'releases' ? <ReleaseNotesPanel appId={appId} /> : <ProductCard app={apps.find(app => app.id === appId)!} />}
        </TabPanel>
      </Stack>}
    </TabPanel>
  </Stack>;
}
function StructurePanel() {
  return <Stack gap="xl">
    <Intro eyebrow="01 / WORKSPACE STRUCTURE" title={c.structureTitle} description={c.structureIntro} />
    <Card title={c.structureTreeTitle} headingLevel={2} padding="lg"><Stack gap="md">
      <Text as="p" tone="muted">{c.structureTreeCaption}</Text>
      {/* CodeBlock shows its label as the visible head line (no language here) and as the region name, so it names
          the format, not the Card's h2 again (2026-10-23 web check: the title appeared twice). */}
      <CodeBlock code={c.structureTree} label={c.structureTreeLabel} />
      <span className="diagram-mobile-hint"><Text variant="caption" tone="muted">{c.structureTreeHint}</Text></span>
    </Stack></Card>
    <Section title={c.structureBoundaryTitle}><Notes items={[
      {title:c.structureRepoTitle,body:c.structureRepoBody}, {title:c.structureSharedTitle,body:c.structureSharedBody},
      {title:c.structureRulesTitle,body:c.structureRulesBody}, {title:c.structureLifecycleTitle,body:c.structureLifecycleBody},
    ]} /></Section>

  </Stack>;
}
function DesignPanel() {
  // 2026-10-21: the code-structure stages moved into the drill-down (code-* views) so the
  // tab has one way to navigate; the former five-step list duplicated it.
  return <Stack gap="xl">
    <Intro eyebrow="02 / SYSTEM ARCHITECTURE" title={c.designTopTitle} description={c.designTopIntro} />
    <div className="chapter-block"><DrillArchitecture /></div>

  </Stack>;
}
function HistoryPanel() {
  return <Stack gap="xl"><Intro eyebrow="05 / IMPROVEMENTS" title={c.historyTitle} description={c.historyIntro} />
    <EvolutionHistory />

  </Stack>;
}
function SupportPanel() {
  return <Stack gap="xl"><Intro eyebrow="06 / CONTACT" title={c.contactNewTitle} description={c.contactNewIntro} />
    <Card title={c.contactTitle} headingLevel={2} padding="xl" actions={<Link href={`mailto:${developerEmail}`} variant="standalone"><MailOutlined aria-hidden /> {developerEmail}</Link>} />
    <Section title={c.contactPolicies}><Collapsible trigger={c.contactPoliciesExpand}><Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'md' }} minColumnWidth={{ compact: 260 }}>
      {legalDocuments.map(document => <Card key={document.id} title={document.name} description={document.note} headingLevel={3} padding="lg" actions={<Stack axis="inline" gap="sm" wrap>
        <ExternalLink href={document.privacyUrl}>{siteCopy.privacy}</ExternalLink>
        {document.deletionUrl && <ExternalLink href={document.deletionUrl}>{siteCopy.deletion}</ExternalLink>}
        <ExternalLink href={document.supportUrl}>{siteCopy.support}</ExternalLink>
      </Stack>} />)}
    </Grid></Collapsible></Section>
    <Text variant="caption" tone="muted">{siteCopy.legalNote}</Text>
  </Stack>;
}
const panels: Record<string, ReactNode> = { about: <AboutPanel />, structure: <StructurePanel />, apps: <AppsPanel />, design: <DesignPanel />, performance: <PerformancePanel />, history: <HistoryPanel />, support: <SupportPanel /> };
export default function App() {
  const [hash, setHash] = useState(() => window.location.hash);
  const active = tabForHash(hash);
  useEffect(() => {
    // SkipNav owns native focus and the #main anchor; it must not change topics.
    const update = () => { if (window.location.hash !== '#main') setHash(window.location.hash); };
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  useLayoutEffect(() => {
    // Legacy deep links need the newly mounted panel before locating their target.
    // Scroll the non-sticky panel start: the sticky tab bar is already visible
    // even when the previous panel was scrolled far down. HJM retains focus.
    if (hash === '#discontinued') document.getElementById('discontinued')?.scrollIntoView({ block: 'start', behavior: 'instant' });
    else if (hash) document.getElementById('panel-start')?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }, [hash]);
  // 2026-10-25 user decision: product defaults to light.
  return <HjmProvider theme="light" host="contents">
    <SkipNav targetId="main" label={siteCopy.skip} />
    <div className="portfolio-host"><ScreenLayout title={siteCopy.home} contentInset="none" layoutStyle={{ maxWidth: 'none' }} header={
      <header className="site-header"><Container size="content" gutter="none"><TopBar
        leading={<Link href="#about" aria-label={siteCopy.home} variant="standalone" tone="neutral"><Text emphasis="strong">{c.portfolioName}</Text><span className="header-role"><Text variant="caption" tone="muted"> / {c.portfolioRole}</Text></span></Link>}
        trailing={<Stack axis="inline" gap="xxs"><ExternalLink href="https://github.com/jim1286"><GithubOutlined aria-hidden /> {siteCopy.github}</ExternalLink><span className="header-storybook"><ExternalLink href={storybookUrl}>{siteCopy.storybook} ↗</ExternalLink></span></Stack>}
      /></Container></header>
    }>
      <div id="main" tabIndex={-1}>
        <div className="tabs-bar"><Container size="content" gutter="regular"><Tabs id="portfolio-tabs" overflow="scroll" indicator="underline" label={c.portfolioTabs} value={active} onValueChange={value => { window.location.hash = value; }} items={tabItems} renderPanels={false} /></Container></div>
        <div className="panel-wrap" id="panel-start"><Container size="content" gutter="regular">
          <TabPanel tabsId="portfolio-tabs" activeValue={active} value={active} mode="keyed" key={`${active}:${hash}`}>{panels[active]}</TabPanel>
        </Container></div>
      </div>
      <footer className="site-footer"><Container size="content" gutter="regular"><Stack axis="inline" gap="md" wrap justify="between">
        <Stack gap="xs"><Text emphasis="strong">{c.portfolioName} · {c.portfolioRole}</Text><Text variant="caption" tone="muted">{c.footerNote}</Text></Stack>
        <Stack axis="inline" gap="xs" wrap><Link href="#support" variant="standalone" tone="neutral">{siteCopy.legalNav}</Link><Link href={`mailto:${developerEmail}`} variant="standalone" tone="neutral">{siteCopy.contact} ↗</Link></Stack>
      </Stack></Container></footer>
    </ScreenLayout></div>
  </HjmProvider>;
}
