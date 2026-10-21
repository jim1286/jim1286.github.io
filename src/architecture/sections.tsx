import { Collapsible } from '@hjmds/react/collapsible';
import { Card, Tag } from '@hjmds/react/display';
import { Section, Stack, Text } from '@hjmds/react/layout';
import { ArchitectureDiagram, type ArchitectureLayout } from '../ArchitectureDiagram';
import { BrandProvider } from '../BrandProvider';
import { AreaFlow, MarketingFlow } from '../FlowDiagram';
import { ModuleGuides } from '../ModuleGuides';
import { DevelopmentFlow, WorkflowMap } from '../WorkflowMap';
import { getCopy } from '../i18n';
import { ExternalLink, Notes } from '../shared';

const c = getCopy();

// Content moved from the former operations and QA tabs (2026-10-21) so the design
// drill-down is the single way to explore how the portfolio is built and run.
export function GuideSection() {
  return <Stack gap="lg">
    <Text as="p" tone="muted">{c.operationsGuideBody}</Text>
    <Collapsible trigger={c.developmentDetail}><DevelopmentFlow /></Collapsible>
    <Collapsible trigger={c.moduleSupplement}><ModuleGuides /></Collapsible>
    <Collapsible trigger={c.operationsGuideExpand} defaultOpen={window.location.hash === '#guidance'}><WorkflowMap /></Collapsible>
  </Stack>;
}

export function MarketingSection() {
  return <Stack gap="xl">
    <Text as="p" tone="muted">{c.operationsMarketingBody}</Text>
    <MarketingDetails />
  </Stack>;
}

function MarketingDetails() {
  return <Stack gap="xl">
    <MarketingFlow />
    <Notes items={[{ title: c.marketingSearchTitle, body: c.marketingSearchBody }, { title: c.marketingDiscoveryTitle, body: c.marketingDiscoveryBody }]} />
    <BrandProvider><Card title={c.marketingPosliTitle} headingLevel={3} padding="xl" tone="sunken" actions={<Stack axis="inline" gap="md" wrap>
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

export function QaSection() {
  return <Stack gap="xl">
    <Text as="p" tone="muted">{c.qaIntro}</Text>
    <Section title={c.qaScopeTitle} headingLevel={4}><Notes items={[
      { title:c.qaUiTitle,body:c.qaUiBody }, { title:c.qaLogicTitle,body:c.qaLogicBody },
      { title:c.qaJourneyTitle,body:c.qaJourneyBody }, { title:c.qaNativeTitle,body:c.qaNativeBody },
    ]} /></Section>
    <QaFlow />
    <Card title={c.qaExploreTitle} headingLevel={4} padding="lg"><Text as="p" tone="muted">{c.qaExploreBody}</Text></Card>
    <Card title={c.workflowQaTitle} headingLevel={4} padding="lg" tone="raised"><Text as="p" tone="muted">{c.workflowQaBody}</Text></Card>
    <Card title={c.qaEvidenceTitle} headingLevel={4} padding="lg"><Text as="p" tone="muted">{c.qaEvidenceBody}</Text></Card>
  </Stack>;
}
