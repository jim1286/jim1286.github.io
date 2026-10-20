import { useId } from 'react';
import { Card } from '@hjmds/react/display';
import { Stack, Text } from '@hjmds/react/layout';
import { getCopy } from './i18n';

const c = getCopy();
type Box = { id: string; x: number; y: number; title: string; detail: string; accent?: boolean };
// These diagrams describe product processes; HJM still owns their surrounding card,
// typography tokens and theme. Coordinates are diagram geometry, not application layout.
export function FlowCanvas({title, caption, height, boxes, paths, optionalPaths = []}: {title: string; caption: string; height: number; boxes: Box[]; paths: string[]; optionalPaths?: string[]}) {
  const marker = `flow-${useId().replaceAll(':', '')}`;
  return <Card title={title} headingLevel={3} padding="lg"><Stack gap="md">
    <div className="process-diagram" role="region" aria-label={title} tabIndex={0}>
      <svg viewBox={`0 0 740 ${height}`} role="img" aria-labelledby={`${marker}-title ${marker}-desc`}>
        <title id={`${marker}-title`}>{title}</title><desc id={`${marker}-desc`}>{caption}</desc>
        <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="var(--hjm-color-primary)" /></marker></defs>
        {[...paths, ...optionalPaths].map((d, i) => <path key={i} d={d} fill="none" stroke="var(--hjm-color-primary)" strokeWidth="1.6" strokeDasharray={i >= paths.length ? "6 5" : undefined} markerEnd={`url(#${marker})`} />)}
        {boxes.map(box => <g key={box.id}>
          <rect x={box.x} y={box.y} width="210" height="78" rx="12" fill={box.accent ? 'var(--hjm-color-surface-accent)' : 'var(--hjm-color-surface)'} stroke="var(--hjm-color-border-control)" />
          <text x={box.x + 105} y={box.y + 31} textAnchor="middle" fill="var(--hjm-color-text)" fontSize="16" fontWeight="600">{box.title}</text>
          <text x={box.x + 105} y={box.y + 55} textAnchor="middle" fill="var(--hjm-color-text-muted)" fontSize="12">{box.detail}</text>
        </g>)}
      </svg>
    </div>
    <Text as="p" tone="muted">{caption}</Text>
    <span className="diagram-mobile-hint"><Text variant="caption" tone="muted">{c.diagramScroll}</Text></span>
  </Stack></Card>;
}
export function OverallFlow() {
  const boxes: Box[] = [
    {id:'request',x:265,y:20,title:c.mapRequest,detail:c.mapRequestDetail},
    {id:'entry',x:265,y:138,title:c.workMapStart,detail:c.mapEntryDetail},
    ...[[c.mapBuild,c.mapBuildDetail],[c.mapProduct,c.mapProductDetail],[c.mapOperate,c.mapOperateDetail]].map(([title,detail],i)=>({id:`branch${i}`,x:20+i*245,y:290,title,detail,accent:true})),
    {id:'prepare',x:265,y:440,title:c.mapPrepare,detail:c.mapPrepareDetail},
    {id:'verify',x:265,y:558,title:c.mapVerify,detail:c.mapVerifyDetail},
    {id:'finish',x:265,y:676,title:c.workMapFinish,detail:c.mapFinishDetail},
  ];
  return <FlowCanvas title={c.workMapDiagramTitle} caption={c.mapOverallCaption} height={780} boxes={boxes} paths={[
    'M370 98V138','M370 216V254H125V290','M370 216V290','M370 254H615V290',
    'M125 368V408H370V440','M370 368V440','M615 368V408H370V440','M370 518V558','M370 636V676',
  ]} />;
}
export function HjmFlow() {
  const rows = [
    [c.hjmNeed,c.hjmNeedDetail],[c.hjmVersion,c.hjmVersionDetail],[c.hjmSelect,c.hjmSelectDetail],
  ];
  const boxes: Box[] = rows.map(([title,detail],i)=>({id:`entry${i}`,x:265,y:20+i*118,title,detail}));
  boxes.push(
    {id:'reuse',x:20,y:390,title:c.hjmReuse,detail:c.hjmReuseDetail,accent:true},
    {id:'extend',x:510,y:390,title:c.hjmExtend,detail:c.hjmExtendDetail,accent:true},
    {id:'connect',x:265,y:530,title:c.hjmConnect,detail:c.hjmConnectDetail},
    {id:'web',x:20,y:670,title:c.hjmWeb,detail:c.hjmWebDetail,accent:true},
    {id:'app',x:510,y:670,title:c.hjmApp,detail:c.hjmAppDetail,accent:true},
    {id:'check',x:265,y:810,title:c.hjmCheck,detail:c.hjmCheckDetail},
    {id:'publish',x:265,y:928,title:c.hjmPublish,detail:c.hjmPublishDetail},
  );
  return <FlowCanvas title={c.hjmFlowTitle} caption={c.hjmFlowCaption} height={1030} boxes={boxes} paths={[
    'M370 98V138','M370 216V256','M370 334V360H125V390','M370 360H615V390',
    'M125 468V500H370V530','M615 468V500H370V530',
    'M370 608V640H125V670','M370 640H615V670',
    'M125 748V780H370V810','M615 748V780H370V810','M370 888V928',
  ]} />;
}

// Area flows stay vertical so every step remains readable inside a mobile accordion.
export function AreaFlow({ title, flow }: { title: string; flow: string }) {
  const marker = `area-${useId().replaceAll(':', '')}`;
  const steps = flow.split('→').map(step => step.trim());
  return <svg className="area-flow" viewBox={`0 0 360 ${steps.length * 100 - 20}`} role="img" aria-labelledby={`${marker}-title ${marker}-desc`}>
    <title id={`${marker}-title`}>{title}</title>
    <desc id={`${marker}-desc`}>{flow}</desc>
    <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="var(--hjm-color-primary)" /></marker></defs>
    {steps.map((step, index) => <g key={index}>
      {index > 0 && <path d={`M180 ${index * 100 - 24}v24`} fill="none" stroke="var(--hjm-color-primary)" strokeWidth="1.6" markerEnd={`url(#${marker})`} />}
      <rect x="4" y={index * 100 + 2} width="352" height="74" rx="12" fill="var(--hjm-color-surface)" stroke="var(--hjm-color-border-control)" />
      <text x="28" y={index * 100 + 46} fontSize="14" fill="var(--hjm-color-primary)">{String(index + 1).padStart(2, '0')}</text>
      <text x="200" y={index * 100 + 46} textAnchor="middle" fontSize="16" fontWeight="600" fill="var(--hjm-color-text)">{step}</text>
    </g>)}
  </svg>;
}

export function MarketingFlow() {
  return <FlowCanvas title={c.marketingDiagramTitle} caption={c.marketingDiagramCaption} height={780} boxes={[
    { id: 'problem', x: 265, y: 20, title: c.marketingProblem, detail: c.marketingFlowProblem },
    { id: 'search', x: 20, y: 170, title: c.marketingSearch, detail: c.marketingFlowSearch, accent: true },
    { id: 'discovery', x: 510, y: 170, title: c.marketingDiscover, detail: c.marketingFlowDiscovery, accent: true },
    { id: 'value', x: 265, y: 320, title: c.marketingValue, detail: c.marketingFlowValue },
    { id: 'review', x: 265, y: 438, title: c.marketingFlowReview, detail: c.marketingFlowReviewDetail },
    { id: 'reaction', x: 265, y: 556, title: c.marketingReaction, detail: c.marketingFlowReaction },
    { id: 'improvement', x: 265, y: 674, title: c.marketingImprovement, detail: c.marketingFlowImprove },
  ]} paths={[
    'M370 98V134H125V170', 'M370 134H615V170',
    'M125 248V284H370V320', 'M615 248V284H370V320',
    'M370 398V438', 'M370 516V556', 'M370 634V674',
    'M265 713H245V59H265',
  ]} />;
}

export function ArchitectureOverview() {
  return <FlowCanvas title={c.archSummaryTitle} caption={c.archSummaryCaption} height={530} boxes={[
    { id: 'web', x: 20, y: 20, title: c.archSummaryWeb, detail: c.archSummaryWebDetail },
    { id: 'app', x: 510, y: 20, title: c.archSummaryApp, detail: c.archSummaryAppDetail },
    { id: 'shared', x: 265, y: 152, title: c.archSummaryShared, detail: c.archSummarySharedDetail, accent: true },
    { id: 'api', x: 265, y: 284, title: c.archSummaryApi, detail: c.archSummaryApiDetail },
    { id: 'data', x: 20, y: 430, title: c.archSummaryData, detail: c.archSummaryDataDetail, accent: true },
    { id: 'worker', x: 510, y: 430, title: c.archSummaryWorker, detail: c.archSummaryWorkerDetail, accent: true },
  ]} paths={[
    'M125 98V124H370V152', 'M615 98V124H370V152', 'M370 230V284',
    'M370 362V400H125V430', 'M370 400H615V430', 'M510 469H230',
  ]} />;
}
