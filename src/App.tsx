import { ArchitectureDiagram, type ArchitectureLayout } from './ArchitectureDiagram';
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
import { Tabs, TabPanel, Steps } from '@hjmds/react/navigation';
import { Collapsible } from '@hjmds/react/collapsible';
import { AndroidFilled, AppleFilled, ExportOutlined, GithubOutlined, MailOutlined } from '@ant-design/icons';
import '@hjmds/react/styles.css';
import { BrandProvider } from './BrandProvider';
import { getCopy } from './i18n';
import { siteCopy, appCopy } from './copy';
import { apps, discontinuedApps, legalDocuments, portfolioSummary, storybookUrl, type PortfolioApp } from './siteData';
import './styles/site.css';
import { EvolutionHistory } from './EvolutionHistory';
import { DevelopmentFlow, WorkflowMap } from './WorkflowMap';
import { ClientContracts } from './ClientContracts';
import { ServerContracts } from './ServerContracts';
import { SystemArchitecture } from './SystemArchitecture';
import { ModuleGuides } from './ModuleGuides';
import { AreaFlow, MarketingFlow } from './FlowDiagram';

const c = getCopy();
const developerEmail = 'jimin1286@gmail.com';
const tabItems = [
  { id: 'about', label: c.navOverview }, { id: 'structure', label: c.navStructure },
  { id: 'design', label: c.navArchitecture }, { id: 'operations', label: c.navOperations },
  { id: 'qa', label: c.navQa }, { id: 'apps', label: c.navProducts },
  { id: 'history', label: c.historyNav }, { id: 'support', label: c.navContact },
];
// Preserve links already shared by the single-page portfolio. Hash changes also
// restore the right panel on browser Back/Forward and locale direct entry.
function tabForHash(hash: string) {
  const id = hash.slice(1);
  const aliases: Record<string, string> = { top: 'about', main: 'about', developer: 'about', discontinued: 'apps', workflow: 'operations', strategy: 'operations', legal: 'support', guidelines: 'design', marketing: 'operations', guidance: 'operations' };
  return aliases[id] ?? (tabItems.some(item => item.id === id) ? id : 'about');
}
function ExternalLink({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return <Link href={href} aria-label={label} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{children}</Link>;
}
// The panel Stack owns the gap above and below; the reading measure is a layout-only width
// (2026-10-18: replaced the .panel-intro wrapper's ad-hoc padding).
function Intro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <Stack gap="md" layoutStyle={{ maxWidth: 760 }}>
    <Text variant="caption" fontRole="code" tone="muted">{eyebrow}</Text>
    <Heading level="level1">{title}</Heading>
    <Text as="p" variant="bodyLarge" tone="muted">{description}</Text>
  </Stack>;
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
function ChapterNext({ href, label }: { href: string; label: string }) {
  return <div className="chapter-next"><Stack gap="sm">
    <Text variant="caption" tone="muted">{c.nextLabel}</Text>
    <Link href={href} variant="standalone" tone="neutral">{label}</Link>
  </Stack></div>;
}
function AboutPanel() {
  const journey = [[c.journey1, c.journey1Body], [c.journey2, c.journey2Body], [c.journey3, c.journey3Body], [c.journey4, c.journey4Body]];
  return <Stack gap="xl">
    <div className="chapter-block">
      <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }}>
        <BrandProvider surface="forest"><Surface padding="xl" radius="lg"><Stack gap="xl">
          <Text variant="caption" fontRole="code" tone="muted">{c.heroRole}</Text>
          <Heading level="level1"><span className="hero-title">{c.heroTitle}</span></Heading>
          <Text as="p" variant="bodyLarge" tone="muted">{c.heroBody}</Text>
          <Stack axis="inline" gap="lg" wrap><Link href="#apps" variant="standalone" tone="neutral">{c.heroAction} →</Link><Link href="#design" variant="standalone" tone="neutral">{c.heroSecondary} →</Link></Stack>
        </Stack></Surface></BrandProvider>
        <Surface padding="lg"><Stack gap="lg">
          <img className="profile-photo" src="/profile.jpg" alt={siteCopy.developerAlt} />
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
    <ChapterNext href="#structure" label={c.nextStructure} />
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
  return <Stack gap="xl"><Intro eyebrow="05 / PRODUCTS" title={c.productsTitle} description={c.productsIntro} />
    <div className="chapter-block"><WorkCases /></div>
    <div className="chapter-block"><Section title={c.personalProducts} description={c.personalProductsBody}>
      <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }} minColumnWidth={{ compact: 280 }}>{apps.map(app => <ProductCard key={app.id} app={app} />)}</Grid>
    </Section></div>
    <Section id="discontinued" tabIndex={-1} title={c.pastProducts} description={c.discontinuedDescription}>
      <Collapsible trigger={c.discontinuedTitle} defaultOpen={window.location.hash === '#discontinued'}><Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }}>{discontinuedApps.map(app => <ProductCard key={app.id} app={app} />)}</Grid></Collapsible>
    </Section>
    <ChapterNext href="#history" label={c.historyNext} />
  </Stack>;
}
function StructurePanel() {
  return <Stack gap="xl">
    <Intro eyebrow="01 / WORKSPACE STRUCTURE" title={c.structureTitle} description={c.structureIntro} />
    <Card title={c.structureTreeTitle} headingLevel={2} padding="lg"><Stack gap="md">
      <Text as="p" tone="muted">{c.structureTreeCaption}</Text>
      <pre className="workspace-tree" tabIndex={0} role="region" aria-label={c.structureTreeTitle}><code>{c.structureTree}</code></pre>
      <span className="diagram-mobile-hint"><Text variant="caption" tone="muted">{c.structureTreeHint}</Text></span>
    </Stack></Card>
    <Section title={c.structureBoundaryTitle}><Notes items={[
      {title:c.structureRepoTitle,body:c.structureRepoBody}, {title:c.structureSharedTitle,body:c.structureSharedBody},
      {title:c.structureRulesTitle,body:c.structureRulesBody}, {title:c.structureLifecycleTitle,body:c.structureLifecycleBody},
    ]} /></Section>
    <ChapterNext href="#design" label={c.nextDesign} />
  </Stack>;
}
const designReadingSteps = [
  {id:'overall',label:c.designStepOverall}, {id:'client',label:c.designStepClient},
  {id:'server',label:c.designStepServer}, {id:'state',label:c.designStepState}, {id:'change',label:c.designStepChange},
];
function ReadingSteps({ current, onChange, steps = designReadingSteps }: { current:string; onChange:(id:string)=>void; steps?:{id:string;label:string}[] }) {
  // This cursor locates an explanation, not task completion or measured reading progress.
  return <Steps descriptor={{steps,currentStepId:current,navigationMode:"free"}} onStepPress={onChange}
    statusLabels={{pending:c.designStepPending,current:c.designStepCurrent,complete:c.designStepComplete,error:c.designStepError}}
    renderMark={(_,position)=>position}
    composeAccessibleName={({position,total,label})=>c.designStepName.replace('{position}',String(position)).replace('{total}',String(total)).replace('{label}',label)} />;
}
function ReadingFlow({ title, flow, caption }: { title:string; flow:string; caption:string }) {
  const steps = flow.split('→').map(step => step.trim());
  const layout: ArchitectureLayout = {
    // Size the canvas to the final node so empty space does not trail the flow.
    height: 35 + (steps.length - 1) * 120 + 60 + 20,
    points: steps.map((_, i) => [330, 35 + i * 120]), regions: [],
    edges: steps.slice(1).map((_, i) => ({path:`M450 ${95+i*120}V${155+i*120}`,label:'',x:0,y:0})),
  };
  return <ArchitectureDiagram title={title} caption={caption} diagramKey="operations" layout={layout}
    boxes={steps.map((step,i)=>({id:String(i),title:step,detail:''}))} />;
}
function DesignPanel() {
  const [current,setCurrent] = useState("overall");
  return <Stack gap="xl">
    <Intro eyebrow="02 / SYSTEM ARCHITECTURE" title={c.designTopTitle} description={c.designTopIntro} />
    <ReadingSteps current={current} onChange={setCurrent} />
    <div className="chapter-block"><SystemArchitecture stage={current} /></div>
    {current === 'client' && <Collapsible trigger={c.archExpandClients}><ClientContracts /></Collapsible>}
    {current === 'server' && <Collapsible trigger={c.archExpandServer}><ServerContracts /></Collapsible>}
    <ChapterNext href="#operations" label={c.nextOperations} />
  </Stack>;
}
// Successful or unavailable checks can go straight to the report; only failures
// enter the repair loop. A linear diagram incorrectly implied every QA run failed.
function QaFlow() {
  const layout: ArchitectureLayout = {
    height: 850, points: [[330,35],[330,205],[330,375],[60,575],[60,735],[600,575]], regions: [],
    edges: [
      {path:'M450 121V205',label:'',x:0,y:0},
      {path:'M450 291V375',label:'',x:0,y:0},
      {path:'M450 461V515H720V575',label:c.qaDirectPath,x:660,y:502},
      {path:'M450 515H180V575',label:c.qaFailurePath,x:240,y:502,dashed:true},
      {path:'M180 661V735',label:'',x:0,y:0,dashed:true},
      {path:'M300 778H490V461',label:c.qaRetryPath,x:490,y:700,dashed:true},
    ],
  };
  return <ArchitectureDiagram title={c.qaFlowTitle} caption={c.qaFlowCaption} diagramKey="qa" layout={layout} legend={c.qaDiagramLegend}
    boxes={[[c.qaStep1,c.qaDetail1],[c.qaStep2,c.qaDetail2],[c.qaStep3,c.qaDetail3],[c.qaStep4,c.qaDetail4],[c.qaStep5,c.qaDetail5],[c.qaStep6,c.qaDetail6]].map(([title,detail],i)=>({id:String(i),title,detail}))} />;
}
const operationsReadingSteps = [
  {id:'release',label:c.opsReadingRelease}, {id:'observe',label:c.opsReadingObserve},
  {id:'recover',label:c.opsReadingRecover}, {id:'improve',label:c.opsReadingImprove},
];
function OperationsPanel() {
  const [current,setCurrent] = useState(["#marketing", "#guidance"].includes(window.location.hash) ? "improve" : "release");
  return <Stack gap="xl"><Intro eyebrow="03 / OPERATIONS" title={c.operationsTitle} description={c.operationsIntro} />
    <ReadingSteps current={current} onChange={setCurrent} steps={operationsReadingSteps} />
    {current === "release" && <div className="chapter-block"><Stack gap="lg">
      <Section title={c.opsReading1Title} description={c.opsReading1Intro}><Stack gap="lg">
        <ReadingFlow title={c.opsReleaseTitle} flow={c.opsReading1Flow} caption={c.opsReleaseBody} />
      </Stack></Section>
    </Stack></div>}
    {current === "observe" && <div className="chapter-block"><Stack gap="lg">
      <Section title={c.opsReading2Title} description={c.opsReading2Intro}><Stack gap="lg">
        <ReadingFlow title={c.opsObserveTitle} flow={c.opsReading2Flow} caption={c.opsObserveBody} />
      </Stack></Section>
    </Stack></div>}
    {current === "recover" && <div className="chapter-block"><Stack gap="lg">
      <Section title={c.opsReading3Title} description={c.opsReading3Intro}><Stack gap="lg">
        <ReadingFlow title={c.opsRetryTitle} flow={c.opsReading3Flow} caption={c.opsRetryBody} />
        <Card title={c.opsRecoveryTitle} headingLevel={3} padding="lg"><Text as="p" tone="muted">{c.opsRecoveryBody}</Text></Card>
      </Stack></Section>
    </Stack></div>}
    {current === "improve" && <div className="chapter-block"><Stack gap="lg">
      <Section title={c.opsReading4Title} description={c.opsReading4Intro}><Stack gap="lg">
        <ReadingFlow title={c.operationsLoop} flow={c.opsReading4Flow} caption={c.opsReading4Caption} />
        <Card title={c.operationsGuide} headingLevel={3} padding="lg"><Stack gap="lg">
          <Text as="p" tone="muted">{c.operationsGuideBody}</Text>
          <Collapsible trigger={c.developmentDetail}><DevelopmentFlow /></Collapsible>
          <Collapsible trigger={c.moduleSupplement}><ModuleGuides /></Collapsible>
          <Collapsible trigger={c.operationsGuideExpand} defaultOpen={window.location.hash === "#guidance"}><WorkflowMap /></Collapsible>
        </Stack></Card>
        <Card title={c.operationsMarketing} headingLevel={3} padding="lg"><Stack gap="lg">
          <Text as="p" tone="muted">{c.operationsMarketingBody}</Text>
          <Collapsible trigger={c.operationsMarketingExpand} defaultOpen={window.location.hash === '#marketing'}><MarketingDetails /></Collapsible>
        </Stack></Card>
      </Stack></Section>
    </Stack></div>}
    <ChapterNext href="#qa" label={c.nextQa} />
  </Stack>;
}
function QaPanel() {
  return <Stack gap="xl"><Intro eyebrow="04 / QUALITY ASSURANCE" title={c.qaTitle} description={c.qaIntro} />
    <div className="chapter-block"><Section title={c.qaScopeTitle}><Notes items={[
      { title:c.qaUiTitle,body:c.qaUiBody }, { title:c.qaLogicTitle,body:c.qaLogicBody },
      { title:c.qaJourneyTitle,body:c.qaJourneyBody }, { title:c.qaNativeTitle,body:c.qaNativeBody },
    ]} /></Section></div>
    <QaFlow />
    <Card title={c.qaExploreTitle} headingLevel={2} padding="lg"><Text as="p" tone="muted">{c.qaExploreBody}</Text></Card>
    <Card title={c.workflowQaTitle} headingLevel={2} padding="lg" tone="raised"><Text as="p" tone="muted">{c.workflowQaBody}</Text></Card>
    <Card title={c.qaEvidenceTitle} headingLevel={2} padding="lg"><Text as="p" tone="muted">{c.qaEvidenceBody}</Text></Card>
    <ChapterNext href="#apps" label={c.nextProducts} />
  </Stack>;
}
function MarketingDetails() {
  return <Stack gap="xl">
    <MarketingFlow />
    <Notes items={[{ title: c.marketingSearchTitle, body: c.marketingSearchBody }, { title: c.marketingDiscoveryTitle, body: c.marketingDiscoveryBody }]} />
    <BrandProvider surface="forest"><Card title={c.marketingPosliTitle} headingLevel={3} padding="xl" tone="sunken" actions={<Stack axis="inline" gap="md" wrap>
      <ExternalLink href="https://www.instagram.com/posli.makes/">{c.marketingInstagram} ↗</ExternalLink>
      <ExternalLink href="https://www.threads.net/@posli.makes">{c.marketingThreads} ↗</ExternalLink>
    </Stack>}><Stack gap="md"><Text as="p">{c.marketingPosliBody}</Text><Text as="p" tone="muted">{c.marketingPosliBoundary}</Text></Stack></Card></BrandProvider>
    <Notes items={[{ title: c.marketingStoryTitle, body: c.marketingStoryBody }, { title: c.marketingMeasureTitle, body: c.marketingMeasureBody }, { title: c.marketingImproveTitle, body: c.marketingImproveBody }]} />
    <Section title={c.dotsTitle}><Stack gap="lg">
      <div><Tag>{c.dotsLabel}</Tag></div>
      <Text as="p" tone="muted">{c.dotsIntro}</Text>
      <Card padding="lg" tone="sunken"><AreaFlow title={c.dotsTitle} flow={c.dotsFlow} /></Card>
      <Notes items={[{ title: c.dotsResearchTitle, body: c.dotsResearchBody }, { title: c.dotsPlanTitle, body: c.dotsPlanBody }, { title: c.dotsLearnTitle, body: c.dotsLearnBody }]} />
      <Text as="p" variant="caption" tone="muted">{c.dotsBoundary}</Text>
      <ExternalLink href="https://learn.chatgpt.com/docs/dots">{c.dotsSource} ↗</ExternalLink>
    </Stack></Section>
  </Stack>;
}
function HistoryPanel() {
  return <Stack gap="xl"><Intro eyebrow="06 / EVOLUTION LOG" title={c.historyTitle} description={c.historyIntro} />
    <EvolutionHistory />
    <ChapterNext href="#support" label={c.nextContact} />
  </Stack>;
}
function SupportPanel() {
  return <Stack gap="xl"><Intro eyebrow="07 / CONTACT" title={c.contactNewTitle} description={c.contactNewIntro} />
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
const panels: Record<string, ReactNode> = { about: <AboutPanel />, structure: <StructurePanel />, apps: <AppsPanel />, operations: <OperationsPanel />, qa: <QaPanel />, design: <DesignPanel />, history: <HistoryPanel />, support: <SupportPanel /> };
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
        <div className="tabs-bar"><Container size="content" gutter="regular"><Tabs id="portfolio-tabs" overflow="scroll" indicator="filled" label={c.portfolioTabs} value={active} onValueChange={value => { window.location.hash = value; }} items={tabItems} renderPanels={false} /></Container></div>
        <div className="panel-wrap" id="panel-start"><Container size="content" gutter="regular">
          <TabPanel tabsId="portfolio-tabs" activeValue={active} value={active} mode="keyed" key={`${active}:${hash}`}>{panels[active]}</TabPanel>
        </Container></div>
      </div>
      <footer className="site-footer"><Container size="content" gutter="regular"><Stack axis="inline" gap="md" wrap justify="between">
        <Stack gap="xs"><Text emphasis="strong">{c.portfolioName} · {c.portfolioRole}</Text><Text variant="caption" tone="muted">{c.footerNote}</Text></Stack>
        <Stack axis="inline" gap="md" wrap><Link href="#support" variant="standalone" tone="neutral">{siteCopy.legalNav}</Link><Link href={`mailto:${developerEmail}`} variant="standalone" tone="neutral">{siteCopy.contact} ↗</Link></Stack>
      </Stack></Container></footer>
    </ScreenLayout></div>
  </BrandProvider></HjmProvider>;
}
