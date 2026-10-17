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
import { AndroidFilled, AppleFilled, ExportOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import '@hjmds/react/styles.css';
import { BrandProvider } from './BrandProvider';
import { getCopy } from './i18n';
import { siteCopy, appCopy } from './copy';
import { apps, discontinuedApps, legalDocuments, portfolioSummary, storybookUrl, type PortfolioApp } from './siteData';
import './styles/site.css';

const c = getCopy();
const developerEmail = 'jimin1286@gmail.com';
const tabItems = [
  { id: 'about', label: c.tabAbout }, { id: 'apps', label: c.tabApps },
  { id: 'workflow', label: c.tabWorkflow }, { id: 'design', label: c.tabDesign },
  { id: 'guidelines', label: c.tabGuidelines }, { id: 'marketing', label: c.tabMarketing }, { id: 'support', label: c.tabSupport },
];
// Preserve links already shared by the single-page portfolio. Hash changes also
// restore the right panel on browser Back/Forward and locale direct entry.
function tabForHash(hash: string) {
  const id = hash.slice(1);
  const aliases: Record<string, string> = { top: 'about', main: 'about', developer: 'about', discontinued: 'apps', strategy: 'workflow', legal: 'support' };
  return aliases[id] ?? (tabItems.some(item => item.id === id) ? id : 'about');
}
function ExternalLink({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return <Link href={href} aria-label={label} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{children}</Link>;
}
function Intro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="panel-intro"><Stack gap="md">
    <Text variant="caption" fontRole="code" tone="muted">{eyebrow}</Text>
    <Heading level="level1">{title}</Heading>
    <Text as="p" variant="bodyLarge" tone="muted">{description}</Text>
  </Stack></div>;
}
function Notes({ items }: { items: { title: string; body: string }[] }) {
  return <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'md' }} minColumnWidth={{ compact: 260 }}>
    {items.map((item, index) => <Card key={item.title} title={item.title} headingLevel={3} padding="lg" tone="sunken">
      <Stack gap="md"><Text variant="caption" fontRole="code" tone="muted">{String(index + 1).padStart(2, '0')}</Text><Text as="p" tone="muted">{item.body}</Text></Stack>
    </Card>)}
  </Grid>;
}
function Diagram({ name, title, caption }: { name: string; title: string; caption: string }) {
  return <Card title={title} headingLevel={2} padding="lg" actions={<ExternalLink href={`/diagrams/${name}.html?theme=light`}>{c.diagramOpen} <ExportOutlined aria-hidden /></ExternalLink>}>
    <Stack gap="md">
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
  return <Card title={app.name} headingLevel={app.statusTone === 'archived' ? 3 : 2} description={app.englishName === app.name ? undefined : app.englishName}
    leading={<Asset descriptor={{ kind: 'image', size: 'large', shape: 'rounded', decorative: true }}><img src={app.icon} alt="" /></Asset>}
    padding="lg" tone={app.statusTone === 'archived' ? 'sunken' : 'default'} actions={app.statusTone !== 'archived' ? <AppLinks app={app} /> : undefined}>
    <Stack gap="md">
      <Stack axis="inline" gap="sm" wrap><Badge variant={app.statusTone === 'live' ? 'filled' : 'outline'}>{app.status}</Badge></Stack>
      <Text as="p">{app.description}</Text>
      {designNotes[app.id] && <Stack gap="xs"><Text variant="caption" emphasis="strong">{c.appDesignLabel}</Text><Text as="p" variant="body" tone="muted">{designNotes[app.id]}</Text></Stack>}
      {app.tags.length > 0 && <Stack axis="inline" gap="xs" wrap aria-label={appCopy.technologies(app.name)}>{app.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</Stack>}
    </Stack>
  </Card>;
}
function AboutPanel() {
  return <Stack gap="xl">
    <div className="intro-grid">
      <BrandProvider surface="forest"><Surface padding="xl" radius="lg"><Stack gap="xl">
        <Text variant="caption" fontRole="code" tone="muted">{c.aboutEyebrow}</Text>
        <Heading level="level1">{c.aboutTitle}</Heading>
        <Text as="p" variant="bodyLarge" tone="muted">{c.portfolioIntro}</Text>
        <Stack axis="inline" gap="md" wrap><Link href="#apps" variant="standalone" tone="neutral">{c.viewApps} →</Link><Link href="#workflow" variant="standalone" tone="neutral">{c.viewWorkflow} →</Link></Stack>
        <Text variant="caption" fontRole="code" tone="muted">{c.techCaption}</Text>
      </Stack></Surface></BrandProvider>
      <Card padding="lg" title={c.portfolioName} description={c.portfolioRole} headingLevel={2}>
        <Stack gap="lg"><img className="profile-photo" src="/profile.jpg" alt={siteCopy.developerAlt} />
          <Text as="p" tone="muted">{c.aboutNote}</Text>
          <Stack axis="inline" gap="sm" wrap><Tag>{`${portfolioSummary.appCount} ${c.tabApps}`}</Tag><Tag>React · TypeScript</Tag></Stack>
          <Link href={`mailto:${developerEmail}`} variant="standalone"><MailOutlined aria-hidden /> {siteCopy.contact}</Link>
        </Stack>
      </Card>
    </div>
    <Section title={c.aboutExperience} description={c.aboutExperienceDescription}>
      <Stack gap="lg">
        <Card title={c.hubbleTitle} description={c.hubbleCategory} headingLevel={3} padding="lg">
          <Stack gap="lg"><Text as="p">{c.hubbleLead}</Text><Collapsible trigger={c.caseMore}>
            <Stack gap="lg"><Notes items={[{ title: c.caseImplementation, body: c.hubbleDetail }, { title: c.caseVerification, body: c.hubbleResult }]} />
              <Diagram name="hubble" title={c.hubbleTitle} caption={c.hubbleBoundary} />
            </Stack>
          </Collapsible></Stack>
        </Card>
        <Card title={c.exploreTitle} description={c.hubbleCategory} headingLevel={3} padding="lg">
          <Stack gap="lg"><Text as="p">{c.exploreLead}</Text><Collapsible trigger={c.caseMore}>
            <Stack gap="lg"><Notes items={[{ title: c.caseImplementation, body: c.exploreDetail }, { title: c.caseVerification, body: c.exploreResult }]} />
              <Diagram name="exploreqa" title={c.exploreTitle} caption={c.exploreBoundary} />
            </Stack>
          </Collapsible></Stack>
        </Card>
      </Stack>
    </Section>
    <Section title={c.skillsTitle}><Notes items={[
      { title: c.skillsCore, body: 'React · TypeScript · Canvas · TanStack Query' },
      { title: c.skillsRuntime, body: 'Electron · Python / FastAPI · C# / Avalonia' },
      { title: c.skillsProducts, body: 'Next.js · Expo / React Native · NestJS · Flutter · Storybook' },
    ]} /></Section>
  </Stack>;
}
function AppsPanel() {
  return <Stack gap="xl"><Intro eyebrow="SELECTED PRODUCTS" title={c.appsLead} description={c.appsIntro} />
    <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }} minColumnWidth={{ compact: 280 }}>{apps.map(app => <ProductCard key={app.id} app={app} />)}</Grid>
    <Section id="discontinued" tabIndex={-1} title={c.discontinuedTitle} description={c.discontinuedDescription}>
      <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }} minColumnWidth={{ compact: 280 }}>{discontinuedApps.map(app => <ProductCard key={app.id} app={app} />)}</Grid>
    </Section>
  </Stack>;
}
function WorkflowPanel() {
  return <Stack gap="xl"><Intro eyebrow={c.workflowEyebrow} title={c.workflowTitle} description={c.workflowIntro} />
    <Diagram name="workflow" title={c.workflowDiagramTitle} caption={c.workflowDiagramCaption} />
    <Notes items={[{ title: c.workflowPlanTitle, body: c.workflowPlanBody }, { title: c.workflowReuseTitle, body: c.workflowReuseBody }, { title: c.workflowVerifyTitle, body: c.workflowVerifyBody }, { title: c.workflowDeliveryTitle, body: c.workflowDeliveryBody }]} />
    <Card title={c.workflowQaTitle} headingLevel={3} padding="lg"><Text as="p" tone="muted">{c.workflowQaBody}</Text></Card>
  </Stack>;
}
function DesignPanel() {
  return <Stack gap="xl"><Intro eyebrow={c.designEyebrow} title={c.designTitle} description={c.designIntro} />
    <Diagram name="design-system" title={c.designDiagramTitle} caption={c.designDiagramCaption} />
    <Notes items={[{ title: c.designTokensTitle, body: c.designTokensBody }, { title: c.designCompositionTitle, body: c.designCompositionBody }, { title: c.designBrandTitle, body: c.designBrandBody }]} />
    <BrandProvider surface="forest"><Card title={c.designStorybookTitle} headingLevel={3} padding="xl" tone="sunken" actions={<ExternalLink href={storybookUrl}>{c.designStorybookAction} <ExportOutlined aria-hidden /></ExternalLink>}><Text as="p" tone="muted">{c.designStorybookBody}</Text></Card></BrandProvider>
    <Collapsible trigger={c.designSharedTitle}><Diagram name="shared-contracts" title={c.designSharedTitle} caption={c.designSharedCaption} /></Collapsible>
  </Stack>;
}
function GuidelinesPanel() {
  return <Stack gap="xl"><Intro eyebrow={c.guidelinesEyebrow} title={c.guidelinesTitle} description={c.guidelinesIntro} />
    <Diagram name="guidelines" title={c.guidelinesDiagramTitle} caption={c.guidelinesDiagramCaption} />
    <Notes items={[{ title: c.guidelinesEntryTitle, body: c.guidelinesEntryBody }, { title: c.guidelinesOwnerTitle, body: c.guidelinesOwnerBody }, { title: c.guidelinesProductTitle, body: c.guidelinesProductBody }, { title: c.guidelinesEvidenceTitle, body: c.guidelinesEvidenceBody }]} />
    <Section title={c.principlesTitle}><Notes items={[{ title: c.principleRoot, body: c.principleRootBody }, { title: c.principleScope, body: c.principleScopeBody }, { title: c.principleBoundary, body: c.principleBoundaryBody }]} /></Section>
  </Stack>;
}
function MarketingPanel() {
  return <Stack gap="xl"><Intro eyebrow={c.marketingEyebrow} title={c.marketingTitle} description={c.marketingIntro} />
    <Diagram name="marketing" title={c.marketingDiagramTitle} caption={c.marketingDiagramCaption} />
    <Notes items={[{ title: c.marketingSearchTitle, body: c.marketingSearchBody }, { title: c.marketingDiscoveryTitle, body: c.marketingDiscoveryBody }]} />
    <BrandProvider surface="forest"><Card title={c.marketingPosliTitle} headingLevel={3} padding="xl" tone="sunken" actions={<Stack axis="inline" gap="md" wrap>
      <ExternalLink href="https://www.instagram.com/posli.makes/">{c.marketingInstagram} ↗</ExternalLink>
      <ExternalLink href="https://www.threads.net/@posli.makes">{c.marketingThreads} ↗</ExternalLink>
    </Stack>}><Stack gap="md"><Text as="p">{c.marketingPosliBody}</Text><Text as="p" tone="muted">{c.marketingPosliBoundary}</Text></Stack></Card></BrandProvider>
    <Notes items={[{ title: c.marketingStoryTitle, body: c.marketingStoryBody }, { title: c.marketingMeasureTitle, body: c.marketingMeasureBody }, { title: c.marketingImproveTitle, body: c.marketingImproveBody }]} />
    <Section title={c.dotsTitle}><Stack gap="lg">
      <div><Tag>{c.dotsLabel}</Tag></div>
      <Text as="p" tone="muted">{c.dotsIntro}</Text>
      <Card padding="lg" tone="sunken"><Text as="p">{c.dotsFlow}</Text></Card>
      <Notes items={[{ title: c.dotsResearchTitle, body: c.dotsResearchBody }, { title: c.dotsPlanTitle, body: c.dotsPlanBody }, { title: c.dotsLearnTitle, body: c.dotsLearnBody }]} />
      <Text as="p" variant="caption" tone="muted">{c.dotsBoundary}</Text>
      <ExternalLink href="https://learn.chatgpt.com/docs/dots">{c.dotsSource} ↗</ExternalLink>
    </Stack></Section>
  </Stack>;
}
function SupportPanel() {
  return <Stack gap="xl"><Intro eyebrow={c.supportEyebrow} title={c.supportTitle} description={c.supportIntro} />
    <Card title={c.contactTitle} description={c.contactDescription} headingLevel={2} padding="xl" actions={<Link href={`mailto:${developerEmail}`} variant="standalone"><MailOutlined aria-hidden /> {developerEmail}</Link>} />
    <Section title={siteCopy.legalTitle}><Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'md' }} minColumnWidth={{ compact: 260 }}>
      {legalDocuments.map(document => <Card key={document.id} title={document.name} description={document.note} headingLevel={3} padding="lg" actions={<Stack axis="inline" gap="sm" wrap>
        <ExternalLink href={document.privacyUrl}>{siteCopy.privacy}</ExternalLink>
        {document.deletionUrl && <ExternalLink href={document.deletionUrl}>{siteCopy.deletion}</ExternalLink>}
        <ExternalLink href={document.supportUrl}>{siteCopy.support}</ExternalLink>
      </Stack>} />)}
    </Grid></Section>
    <Text variant="caption" tone="muted">{siteCopy.legalNote}</Text>
  </Stack>;
}
const panels: Record<string, ReactNode> = { about: <AboutPanel />, apps: <AppsPanel />, workflow: <WorkflowPanel />, design: <DesignPanel />, guidelines: <GuidelinesPanel />, marketing: <MarketingPanel />, support: <SupportPanel /> };
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
  return <HjmProvider theme="system" host="contents"><BrandProvider>
    <SkipNav targetId="main" label={siteCopy.skip} />
    <div className="portfolio-host"><ScreenLayout title={siteCopy.home} contentInset="none" layoutStyle={{ maxWidth: 'none' }} header={
      <header className="site-header"><Container size="content" gutter="none"><TopBar
        leading={<Link href="#about" aria-label={siteCopy.home} variant="standalone" tone="neutral"><Text emphasis="strong">{c.portfolioName}</Text><span className="header-role"><Text variant="caption" tone="muted"> / {c.portfolioRole}</Text></span></Link>}
        trailing={<Stack axis="inline" gap="md"><ExternalLink href="https://github.com/jim1286"><GithubOutlined aria-hidden /> {siteCopy.github}</ExternalLink><span className="header-storybook"><ExternalLink href={storybookUrl}>{siteCopy.storybook} ↗</ExternalLink></span></Stack>}
      /></Container></header>
    }>
      <div id="main" tabIndex={-1}>
        <div className="tabs-bar"><Container size="content" gutter="regular"><Tabs id="portfolio-tabs" label={c.portfolioTabs} value={active} onValueChange={value => { window.location.hash = value; }} items={tabItems} renderPanels={false} /></Container></div>
        <div className="panel-wrap" id="panel-start"><Container size="content" gutter="regular">
          <TabPanel tabsId="portfolio-tabs" activeValue={active} value={active} mode="keyed" key={active}>{panels[active]}</TabPanel>
        </Container></div>
      </div>
      <footer className="site-footer"><Container size="content" gutter="regular"><Stack axis="inline" gap="md" wrap justify="between">
        <Stack gap="xs"><Text emphasis="strong">{c.portfolioName} · {c.portfolioRole}</Text><Text variant="caption" tone="muted">{c.footerNote}</Text></Stack>
        <Stack axis="inline" gap="md" wrap><Link href="#support" variant="standalone" tone="neutral">{siteCopy.legalNav}</Link><Link href={`mailto:${developerEmail}`} variant="standalone" tone="neutral">{siteCopy.contact} ↗</Link></Stack>
      </Stack></Container></footer>
    </ScreenLayout></div>
  </BrandProvider></HjmProvider>;
}
