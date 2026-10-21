import { getCopy } from '../i18n';
import type { ArchCard, ArchEdge, ArchNode, ArchView } from './archData';

const c = getCopy();

// Diagram data moved from the former design-tab stages, contract panels, work guides, QA and
// marketing sections (2026-10-21). Boxes, routes and copy keys are unchanged; the drill-down
// renders them with the same node map as the rest of the architecture.
type Edge = { path: string; label: string; x: number; y: number; dashed?: boolean };
type Region = { x: number; y: number; w: number; h: number; title: string };
export type ArchitectureLayout = { height: number; points: number[][]; edges: Edge[]; regions: Region[] };
const edge = (path: string, label: string, x: number, y: number, dashed = false): Edge => ({ path, label, x, y, dashed });
// Explicit routes keep labels in the space between nodes. Dependency maps do not
// invent a sequential execution order between independent product packages.
const layouts: Record<string, ArchitectureLayout> = {
  overall: { height: 760, points: [[90,100],[570,100],[570,330],[90,330],[90,560],[570,560]],
    regions: [{x:30,y:25,w:360,h:690,title:c.architectureLabel1},{x:510,y:25,w:360,h:690,title:c.architectureLabel2}],
    edges: [edge('M210 186V330',c.architectureLabel3,210,258),edge('M210 416V560',c.architectureLabel4,210,488),edge('M570 143H330',c.architectureLabel5,450,129,true),edge('M570 373H470V164H330',c.architectureLabel6,470,290,true),edge('M570 603H430V179H330',c.architectureLabel7,430,510,true)] },
  client: {height:650,points:[[40,60],[700,60],[370,60],[370,260],[40,460],[700,460]],
    regions:[], edges:[]},
  server: {height:900, points:[[330,50],[330,245],[30,455],[330,455],[630,455],[630,710],[330,710]], regions:[],
    edges:[edge('M450 136V245',c.architectureLabel11,450,195),
      edge('M330 288H150V455',c.architectureLabel12,150,390),
      edge('M450 331V455',c.architectureLabel13,450,395,true),
      edge('M570 288H750V455',c.architectureLabel14,750,390,true),
      edge('M750 541V710',c.architectureLabel15,750,630,true),
      edge('M570 315H885V753H870',c.architectureDirectWork,810,670,true),
      edge('M750 796V850H150V541',c.architectureLabel16,150,665,true),
      edge('M330 315H290V753H330',c.architectureExternalEdge,290,620,true),
      edge('M630 753H570',c.architectureExternalEdge,600,735,true)]},
  'state-0':{height:650,points:[[330,60],[90,285],[570,285],[330,510]],regions:[],
    edges:[edge('M450 146V220H210V285',c.architectureLabel17,210,250),edge('M450 220H690V285',c.architectureLabel18,690,250),edge('M210 371V445H450V510',c.architectureLabel19,210,430),edge('M690 371V445H450',c.architectureLabel20,690,430)]},
  'state-1':{height:650,points:[[330,60],[90,285],[570,285],[90,510],[570,510]],regions:[],
    edges:[edge('M450 146V220H210V285',c.architectureLabel21,210,250),edge('M450 220H690V285',c.architectureLabel22,690,250),edge('M210 371V510',c.architectureLabel23,210,445),edge('M690 371V510',c.architectureLabel24,690,445)]},
  'state-2':{height:650,points:[[330,60],[330,285],[330,510]],regions:[],
    edges:[edge('M450 146V285',c.architectureLabel25,450,222),edge('M450 371V510',c.architectureLabel26,450,447)]},
  change: {height:760,points:[[60,65],[600,65],[600,290],[60,290],[60,540],[600,540]],regions:[],
    edges:[edge('M300 108H600',c.architectureLabel27,450,94),
      edge('M720 151V290',c.architectureLabel28,720,225),
      edge('M600 333H300',c.architectureLabel29,450,319),
      edge('M180 376V540',c.architectureLabel30,180,460),
      edge('M60 583H20V108H60',c.architectureLabel31,105,480),
      edge('M600 355H430V583H300',c.architectureLabel32,430,475),
      edge('M720 376V540',c.architectureLabel33,720,458,true),
      edge('M720 626V700H330V355H300',c.architectureLabel16,510,686,true)]},
};

const stages = [
{id:"overall",title:c.systemArch15,intro:c.systemArch16,diagrams:[{title:c.systemArch1,caption:c.systemArch2,boxes:[{id:"0",title:c.systemArch3,detail:c.systemArch4},{id:"1",title:c.systemArch5,detail:c.systemArch6},{id:"2",title:c.systemArch7,detail:c.systemArch8},{id:"3",title:c.systemArch9,detail:c.systemArch10},{id:"4",title:c.systemArch11,detail:c.systemArch12},{id:"5",title:c.systemArch13,detail:c.systemArch14}]}],roles:[{name:c.systemArch17,role:c.systemArch18,contract:c.systemArch19,reason:c.systemArch20},{name:c.systemArch21,role:c.systemArch22,contract:c.systemArch23,reason:c.systemArch24},{name:c.systemArch25,role:c.systemArch26,contract:c.systemArch27,reason:c.systemArch28}]},
{id:"client",title:c.systemArch43,intro:c.systemArch44,diagrams:[{title:c.systemArch29,caption:c.systemArch30,boxes:[{id:"0",title:c.systemArch31,detail:c.systemArch32},{id:"1",title:c.systemArch33,detail:c.systemArch34},{id:"2",title:c.systemArch35,detail:c.systemArch36},{id:"3",title:c.systemArch37,detail:c.systemArch38},{id:"4",title:c.systemArch39,detail:c.systemArch40},{id:"5",title:c.systemArch41,detail:c.systemArch42}]}],roles:[{name:c.systemArch45,role:c.systemArch46,contract:c.systemArch47,reason:c.systemArch48},{name:c.systemArch49,role:c.systemArch50,contract:c.systemArch51,reason:c.systemArch52},{name:c.systemArch53,role:c.systemArch54,contract:c.systemArch55,reason:c.systemArch56}]},
{id:"server",title:c.systemArch71,intro:c.systemArch72,diagrams:[{title:c.systemArch57,caption:c.systemArch58,boxes:[{id:"0",title:c.systemArch59,detail:c.systemArch60},{id:"1",title:c.systemArch61,detail:c.systemArch62},{id:"2",title:c.systemArch63,detail:c.systemArch64},{id:"3",title:c.systemArch65,detail:c.systemArch66},{id:"4",title:c.systemArch67,detail:c.systemArch68},{id:"5",title:c.systemArch69,detail:c.systemArch70},{id:"6",title:c.systemExternal,detail:c.systemExternalDetail}]}],roles:[{name:c.systemArch73,role:c.systemArch74,contract:c.systemArch75,reason:c.systemArch76},{name:c.systemArch77,role:c.systemArch78,contract:c.systemArch79,reason:c.systemArch80},{name:c.systemArch81,role:c.systemArch82,contract:c.systemArch83,reason:c.systemArch84}]},
{id:"state",title:c.systemArch115,intro:c.systemArch116,diagrams:[{title:c.systemArch85,caption:c.systemArch86,boxes:[{id:"0",title:c.systemArch87,detail:c.systemArch88},{id:"1",title:c.systemArch89,detail:c.systemArch90},{id:"2",title:c.systemArch91,detail:c.systemArch92},{id:"3",title:c.systemArch93,detail:c.systemArch94}]},{title:c.systemArch95,caption:c.systemArch96,boxes:[{id:"0",title:c.systemArch97,detail:c.systemArch98},{id:"1",title:c.systemArch99,detail:c.systemArch100},{id:"2",title:c.systemArch101,detail:c.systemArch102},{id:"3",title:c.systemArch103,detail:c.systemArch104},{id:"4",title:c.systemArch105,detail:c.systemArch106}]},{title:c.systemArch107,caption:c.systemArch108,boxes:[{id:"0",title:c.systemArch109,detail:c.systemArch110},{id:"1",title:c.systemArch111,detail:c.systemArch112},{id:"2",title:c.systemArch113,detail:c.systemArch114}]}],roles:[{name:c.systemArch117,role:c.systemArch118,contract:c.systemArch119,reason:c.systemArch120},{name:c.systemArch121,role:c.systemArch122,contract:c.systemArch123,reason:c.systemArch124},{name:c.systemArch125,role:c.systemArch126,contract:c.systemArch127,reason:c.systemArch128}]},
{id:"change",title:c.systemArch143,intro:c.systemArch144,diagrams:[{title:c.systemArch129,caption:c.systemArch130,boxes:[{id:"0",title:c.systemArch131,detail:c.systemArch132},{id:"1",title:c.systemArch133,detail:c.systemArch134},{id:"2",title:c.systemArch135,detail:c.systemArch136},{id:"3",title:c.systemArch137,detail:c.systemArch138},{id:"4",title:c.systemArch139,detail:c.systemArch140},{id:"5",title:c.systemArch141,detail:c.systemArch142}]}],roles:[{name:c.systemArch145,role:c.systemArch146,contract:c.systemArch147,reason:c.systemArch148},{name:c.systemArch149,role:c.systemArch150,contract:c.systemArch151,reason:c.systemArch152},{name:c.systemArch153,role:c.systemArch154,contract:c.systemArch155,reason:c.systemArch156}]}];

function overallFlow() {
  const boxes: Box[] = [
    {id:'request',x:265,y:20,title:c.mapRequest,detail:c.mapRequestDetail},
    {id:'entry',x:265,y:138,title:c.workMapStart,detail:c.mapEntryDetail},
    ...[[c.mapBuild,c.mapBuildDetail],[c.mapProduct,c.mapProductDetail],[c.mapOperate,c.mapOperateDetail]].map(([title,detail],i)=>({id:`branch${i}`,x:20+i*245,y:290,title,detail,accent:true})),
    {id:'prepare',x:265,y:440,title:c.mapPrepare,detail:c.mapPrepareDetail},
    {id:'verify',x:265,y:558,title:c.mapVerify,detail:c.mapVerifyDetail},
    {id:'finish',x:265,y:676,title:c.workMapFinish,detail:c.mapFinishDetail},
  ];
  return ({ title: c.workMapDiagramTitle, caption: c.mapOverallCaption, height: 780, boxes: boxes, paths: [
    'M370 98V138','M370 216V254H125V290','M370 216V290','M370 254H615V290',
    'M125 368V408H370V440','M370 368V440','M615 368V408H370V440','M370 518V558','M370 636V676',
  ]});
}

function marketingFlow() {
  return ({ title: c.marketingDiagramTitle, caption: c.marketingDiagramCaption, height: 780, boxes: [
    { id: 'problem', x: 265, y: 20, title: c.marketingProblem, detail: c.marketingFlowProblem },
    { id: 'search', x: 20, y: 170, title: c.marketingSearch, detail: c.marketingFlowSearch, accent: true },
    { id: 'discovery', x: 510, y: 170, title: c.marketingDiscover, detail: c.marketingFlowDiscovery, accent: true },
    { id: 'value', x: 265, y: 320, title: c.marketingValue, detail: c.marketingFlowValue },
    { id: 'review', x: 265, y: 438, title: c.marketingFlowReview, detail: c.marketingFlowReviewDetail },
    { id: 'reaction', x: 265, y: 556, title: c.marketingReaction, detail: c.marketingFlowReaction },
    { id: 'improvement', x: 265, y: 674, title: c.marketingImprovement, detail: c.marketingFlowImprove },
  ], paths: [
    'M370 98V134H125V170', 'M370 134H615V170',
    'M125 248V284H370V320', 'M615 248V284H370V320',
    'M370 398V438', 'M370 516V556', 'M370 634V674',
    'M265 713H245V59H265',
  ]});
}

const clientContracts = [
  [c.clientUiTitle, c.clientUiBody], [c.clientStateTitle, c.clientStateBody],
  [c.clientDataTitle, c.clientDataBody], [c.clientAuthTitle, c.clientAuthBody],
  [c.clientPlatformTitle, c.clientPlatformBody], [c.clientReleaseTitle, c.clientReleaseBody],
];

function clientDiagram(native: boolean) {
  return ({ title: native ? c.clientAppTitle : c.clientWebTitle, caption: native ? c.clientAppCaption : c.clientWebCaption, height: 720, boxes: [
    { id: 'route', x: 265, y: 20, title: native ? c.clientAppRoute : c.clientWebRoute, detail: native ? c.clientAppRouteDetail : c.clientWebRouteDetail },
    { id: 'ui', x: 265, y: 138, title: native ? c.clientAppUi : c.clientWebUi, detail: c.clientUiDetail },
    { id: 'model', x: 265, y: 256, title: c.clientModel, detail: c.clientModelDetail },
    { id: 'storage', x: 20, y: 256, title: c.clientStorage, detail: c.clientStorageDetail, accent: true },
    { id: 'adapter', x: 510, y: 256, title: native ? c.clientAppAdapter : c.clientWebAdapter, detail: native ? c.clientAppAdapterDetail : c.clientWebAdapterDetail, accent: true },
    { id: 'client', x: 265, y: 374, title: c.clientApi, detail: c.clientApiDetail },
    { id: 'transport', x: 265, y: 492, title: native ? c.clientAppTransport : c.clientWebTransport, detail: native ? c.clientAppTransportDetail : c.clientWebTransportDetail },
    { id: 'server', x: 265, y: 610, title: c.clientServer, detail: c.clientServerDetail },
  ], paths: [
    'M370 98V138', 'M370 216V256', 'M265 295H230', 'M475 295H510',
    'M370 334V374', 'M370 452V492', 'M370 570V610',
  ]});
}

const serverContracts = [
  [c.serverApiTitle, c.serverApiBody, 'AUTH_SIGNUP_POLICY.md'],
  [c.serverDbTitle, c.serverDbBody, 'LOCAL_DATABASE_POLICY.md'],
  [c.serverCacheTitle, c.serverCacheBody, 'SERVER_CACHE_POLICY.md'],
  [c.serverQueueTitle, c.serverQueueBody, 'BACKGROUND_JOB_POLICY.md'],
  [c.serverWorkerTitle, c.serverWorkerBody, 'NEW_APP_DEVELOPMENT_GUIDE.md#92-worker-실행-계약-v1과-동적-제어-연결'],
  [c.serverRecoveryTitle, c.serverRecoveryBody, 'BACKGROUND_JOB_POLICY.md'],
];

const serverCanvas = ({ title: c.serverDiagram, caption: c.serverCaption, height: 840, boxes: [
        { id: 'client', x: 265, y: 20, title: c.serverClient, detail: c.serverClientDetail },
        { id: 'api', x: 265, y: 138, title: c.serverApi, detail: c.serverApiDetail },
        { id: 'service', x: 265, y: 256, title: c.serverDomain, detail: c.serverDomainDetail },
        { id: 'cache', x: 20, y: 256, title: c.serverCache, detail: c.serverCacheDetail, accent: true },
        { id: 'db', x: 20, y: 440, title: c.serverDb, detail: c.serverDbDetail, accent: true },
        { id: 'queue', x: 510, y: 440, title: c.serverQueue, detail: c.serverQueueDetail, accent: true },
        { id: 'worker', x: 510, y: 558, title: c.serverWorker, detail: c.serverWorkerDetail },
        { id: 'result', x: 265, y: 734, title: c.serverResult, detail: c.serverResultDetail },
      ], paths: [
        'M370 98V138', 'M370 216V256',
        'M370 334V734',
      ], optionalPaths: [
        'M265 295H230', 'M370 390H125V440', 'M370 390H615V440',
        'M615 518V558', 'M510 597H125V518',
        'M475 295H730V597H720',
        'M615 636V690H370', 'M230 479H245V773H265',
      ]});

const flowSteps = [
  [c.flowStep1Title, c.flowStep1Body], [c.flowStep2Title, c.flowStep2Body],
  [c.flowStep3Title, c.flowStep3Body], [c.flowStep4Title, c.flowStep4Body],
  [c.flowStep5Title, c.flowStep5Body], [c.flowStep6Title, c.flowStep6Body],
];

const workAreas = [
  [c.workMap1Title, c.workMap1Flow, c.workMap1Body], [c.workMap2Title, c.workMap2Flow, c.workMap2Body],
  [c.workMap3Title, c.workMap3Flow, c.workMap3Body], [c.workMap4Title, c.workMap4Flow, c.workMap4Body],
  [c.workMap5Title, c.workMap5Flow, c.workMap5Body], [c.workMap6Title, c.workMap6Flow, c.workMap6Body],
  [c.workMap7Title, c.workMap7Flow, c.workMap7Body], [c.workMap8Title, c.workMap8Flow, c.workMap8Body],
];

const moduleGuides = [
  {
    title: c.moduleHjmTitle, kind: c.moduleHjmKind, role: c.moduleHjmRole,
    boundary: c.moduleHjmBoundary, flow: c.moduleHjmFlow, check: c.moduleHjmCheck,
    repository: 'https://github.com/jim1286/hjm-design-system',
    entry: 'packages/design-contracts/docs/usage/SELECTION.md', publicDocs: true,
  },
  {
    title: c.moduleHubTitle, kind: c.moduleHubKind, role: c.moduleHubRole,
    boundary: c.moduleHubBoundary, flow: c.moduleHubFlow, check: c.moduleHubCheck,
    repository: 'https://github.com/jim1286/app-release-hub', entry: 'AGENTS.md', publicDocs: false,
  },
  {
    title: c.moduleQaTitle, kind: c.moduleQaKind, role: c.moduleQaRole,
    boundary: c.moduleQaBoundary, flow: c.moduleQaFlow, check: c.moduleQaCheck,
    repository: 'https://github.com/teamRTM/qa-framework', entry: 'README.md', publicDocs: false,
  },
];

function qaFlow() {
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
  return { layout, boxes: [[c.qaStep1,c.qaDetail1],[c.qaStep2,c.qaDetail2],[c.qaStep3,c.qaDetail3],[c.qaStep4,c.qaDetail4],[c.qaStep5,c.qaDetail5],[c.qaStep6,c.qaDetail6]].map(([title,detail],i)=>({id:String(i),title,detail})) };
}

type Box = { id: string; x: number; y: number; title: string; detail: string; accent?: boolean };
type DiagramEdge = { d: string; label?: string; at?: [number, number]; dashed?: boolean };

function parsePath(d: string) {
  const pts: number[][] = [];
  for (const [, cmd, args] of d.matchAll(/([MHV])\s*([-\d.\s]+)/g)) {
    const n = args.trim().split(/\s+/).map(Number);
    const last = pts[pts.length - 1];
    if (cmd === 'M') pts.push([n[0], n[1]]);
    else if (cmd === 'H') pts.push([n[0], last[1]]);
    else pts.push([last[0], n[0]]);
  }
  return pts;
}

// Builds a drill-down view from fixed-geometry boxes. Each route's endpoints decide its
// nodes; a branch that starts on another route inherits that route's source.
function geometryView(o: { id: string; parent: string; title: string; crumb: string; hint: string; w: number; h: number;
  boxes: Box[]; edges: DiagramEdge[]; drills?: Record<string, string>; regions?: { x: number; y: number; w: number; h: number; title: string }[];
  cards: ArchCard[]; links?: { label: string; href: string }[] }): ArchView {
  const hit = (p: number[]) => o.boxes.find(b => p[0] >= b.x - 3 && p[0] <= b.x + o.w + 3 && p[1] >= b.y - 3 && p[1] <= b.y + o.h + 3);
  const routes = o.edges.map(e => ({ e, pts: parsePath(e.d) }));
  const onRoute = (p: number[], self: number) => routes.findIndex((r, i) => i !== self && r.pts.some((q, k) => k > 0 &&
    Math.min(q[0], r.pts[k - 1][0]) - 1 <= p[0] && p[0] <= Math.max(q[0], r.pts[k - 1][0]) + 1 &&
    Math.min(q[1], r.pts[k - 1][1]) - 1 <= p[1] && p[1] <= Math.max(q[1], r.pts[k - 1][1]) + 1));
  const source = (i: number, seen = new Set<number>()): Box | undefined => {
    const start = routes[i].pts[0], box = hit(start);
    if (box || seen.has(i)) return box;
    seen.add(i);
    const parent = onRoute(start, i);
    return parent >= 0 ? source(parent, seen) : undefined;
  };
  // A route that ends on another route merges into it and points at that route's target.
  const target = (i: number, seen = new Set<number>()): Box | undefined => {
    const end = routes[i].pts[routes[i].pts.length - 1], box = hit(end);
    if (box || seen.has(i)) return box;
    seen.add(i);
    const next = onRoute(end, i);
    return next >= 0 ? target(next, seen) : undefined;
  };
  const edges: ArchEdge[] = routes.flatMap((r, i) => {
    const from = source(i), to = target(i);
    if (!from || !to) return [];
    return [{ from: from.id, to: to.id, path: r.pts, label: r.e.label || undefined, labelAt: r.e.at, variant: r.e.dashed ? 'dashed' : undefined }];
  });
  const nodes: ArchNode[] = o.boxes.map(b => ({ id: b.id, type: o.drills?.[b.id] ? 'frontend' : b.accent ? 'backend' : 'external',
    x: b.x, y: b.y, w: o.w, label: b.title, sub: b.detail, drill: o.drills?.[b.id] }));
  const boundaries = (o.regions ?? []).map(r => ({ label: r.title, wraps: o.boxes.filter(b => b.x >= r.x && b.x + o.w <= r.x + r.w && b.y >= r.y && b.y + o.h <= r.y + r.h).map(b => b.id) }))
    .filter(b => b.wraps.length > 0);
  return { id: o.id, parent: o.parent, title: o.title, crumb: o.crumb, hint: o.hint, h: o.h, nodes, edges, boundaries, cards: o.cards, links: o.links };
}

function chainView(id: string, parent: string, title: string, crumb: string, hint: string, flow: string, cards: ArchCard[], links?: { label: string; href: string }[]): ArchView {
  const steps = flow.split('→').map(step => step.trim());
  // Serpentine rows of three keep long flows readable at page width; every turn is one vertical step.
  const nodes: ArchNode[] = steps.map((step, i) => {
    const row = Math.floor(i / 3), col = row % 2 === 0 ? i % 3 : 2 - (i % 3);
    return { id: String(i), type: i === 0 ? 'frontend' : 'external', x: 40 + col * 300, y: 60 + row * 150, w: 240, label: step, sub: c.archStepLabel.replace('{n}', String(i + 1)) };
  });
  return { id, parent, title, crumb, hint, nodes, edges: steps.slice(1).map((_, i) => ({ from: String(i), to: String(i + 1), variant: 'emphasis' as const })), boundaries: [], cards, links };
}

const fromStage = (stage: (typeof stages)[number], index: number, key: string) => {
  const diagram = stage.diagrams[index], layout = layouts[key];
  return { boxes: diagram.boxes.map((b, i) => ({ id: b.id, x: layout.points[i][0], y: layout.points[i][1], title: b.title, detail: b.detail })),
    edges: layout.edges.map(e => ({ d: e.path, label: e.label, at: e.label ? [e.x, e.y - 4] as [number, number] : undefined, dashed: e.dashed })),
    regions: layout.regions, caption: diagram.caption, title: diagram.title };
};
const roleCards = (roles: { name: string; role: string; contract: string; reason: string }[]): ArchCard[] => roles.map((r, i) => ({
  tone: (['primary', 'brand', 'neutral'] as const)[i % 3], title: r.name,
  items: [`${c.systemRole}: ${r.role}`, `${c.systemContract}: ${r.contract}`, `${c.systemReason}: ${r.reason}`] }));
const canvasEdges = (paths: string[], optional: string[] = []) => [...paths.map(d => ({ d })), ...optional.map(d => ({ d, dashed: true }))];
const listCard = (tone: ArchCard['tone'], title: string, rows: string[][]): ArchCard => ({ tone, title, items: rows.map(([t, b]) => `${t}: ${b}`) });

export function buildLegacyViews(): Record<string, ArchView> {
  const [overallStage, clientStage, serverStage, stateStage, changeStage] = stages;
  const views: ArchView[] = [];
  const stageView = (id: string, parent: string, stage: (typeof stages)[number], index: number, key: string, crumb: string, drills: Record<string, string>, cards: ArchCard[], edges?: DiagramEdge[]) => {
    const s = fromStage(stage, index, key);
    views.push(geometryView({ id, parent, title: s.title, crumb, hint: `${stage.intro} ${s.caption}`, w: 240, h: 86, boxes: s.boxes, edges: edges ?? s.edges, regions: s.regions, drills, cards }));
  };
  stageView('code-overall', 'overview', overallStage, 0, 'overall', c.archCodeCrumb, { '0': 'code-client', '1': 'code-hjm', '2': 'code-hub', '3': 'code-server', '5': 'code-exploreqa' }, roleCards(overallStage.roles));
  // These are consumption dependencies, not a sequential pipeline through every package.
  stageView('code-client', 'code-overall', clientStage, 0, 'client', c.designStepClient, { '0': 'code-client-web', '1': 'code-client-app', '2': 'code-hjm', '5': 'code-change' }, roleCards(clientStage.roles), [
    { d: 'M280 103H370', label: c.archClientUiDependency, at: [325, 90] },
    { d: 'M700 103H610', label: c.archClientUiDependency, at: [655, 90] },
    { d: 'M160 146V303H370', label: c.archClientModelDependency, at: [160, 225] },
    { d: 'M820 146V303H610', label: c.archClientModelDependency, at: [820, 225] },
    { d: 'M400 346V503H280', label: c.archClientContractDependency, at: [400, 420] },
    { d: 'M580 346V503H700', label: c.archClientAdapterDependency, at: [580, 420] },
  ]);
  stageView('code-server', 'code-overall', serverStage, 0, 'server', c.designStepServer, { '0': 'code-server-flow', '1': 'code-change' }, roleCards(serverStage.roles));
  stageView('code-hjm', 'code-overall', stateStage, 0, 'state-0', stateStage.roles[0].name, {}, roleCards([stateStage.roles[0]]));
  stageView('code-hub', 'code-overall', stateStage, 1, 'state-1', stateStage.roles[1].name, {}, roleCards([stateStage.roles[1]]));
  stageView('code-exploreqa', 'code-overall', stateStage, 2, 'state-2', stateStage.roles[2].name, {}, roleCards([stateStage.roles[2]]));
  stageView('code-change', 'code-overall', changeStage, 0, 'change', c.designStepChange, {}, roleCards(changeStage.roles));

  for (const native of [false, true]) {
    const d = clientDiagram(native);
    views.push(geometryView({ id: native ? 'code-client-app' : 'code-client-web', parent: 'code-client', title: d.title, crumb: native ? c.archCrumbApp : c.archCrumbWeb, hint: d.caption,
      w: 210, h: 78, boxes: d.boxes, edges: canvasEdges(d.paths), cards: [listCard('primary', c.clientTitle, clientContracts)] }));
  }
  views.push(geometryView({ id: 'code-server-flow', parent: 'code-server', title: serverCanvas.title, crumb: c.archCrumbServerFlow, hint: serverCanvas.caption,
    w: 210, h: 78, boxes: serverCanvas.boxes, edges: canvasEdges(serverCanvas.paths, serverCanvas.optionalPaths),
    cards: [listCard('primary', c.serverTitle, serverContracts.map(([t, b]) => [t, b])), { tone: 'neutral', title: c.serverExamples, items: [c.serverExamplesBody] }] }));

  const guide = overallFlow();
  views.push(geometryView({ id: 'guide', parent: 'dev', title: c.operationsGuide, crumb: c.archGuideCrumb, hint: `${c.operationsGuideBody} ${guide.caption}`, w: 210, h: 78,
    boxes: guide.boxes, edges: canvasEdges(guide.paths), drills: { branch0: 'guide-modules' },
    cards: [listCard('primary', c.flowStepsTitle, flowSteps.map(([t, b], i) => [`${String(i + 1).padStart(2, '0')} · ${t}`, b])),
      listCard('neutral', c.workMapTitle, workAreas.map(([t, f]) => [t, f])),
      listCard('brand', c.workMapCasesTitle, [[c.workMapCaseHjmTitle, c.workMapCaseHjmBody], [c.workMapCaseBurnTitle, c.workMapCaseBurnBody], [c.workMapCaseLegacyTitle, c.workMapCaseLegacyBody]])] }));
  views.push({ id: 'guide-modules', parent: 'guide', title: c.moduleGuidesTitle, crumb: c.moduleGuidesTitle, hint: c.moduleGuidesIntro, edges: [], boundaries: [],
    nodes: moduleGuides.map((m, i) => ({ id: `m${i}`, type: 'frontend' as const, x: 40 + i * 300, y: 60, w: 260, label: m.title, sub: m.kind, drill: `guide-module-${i}` })),
    cards: [{ tone: 'neutral', title: c.moduleGuidesTitle, items: [c.moduleGuidesIntro, c.moduleGuidesBasis] }] });
  moduleGuides.forEach((m, i) => views.push(chainView(`guide-module-${i}`, 'guide-modules', m.title, m.title, m.kind, m.flow,
    [{ tone: 'primary', title: c.moduleRoleLabel, items: [m.role] }, { tone: 'neutral', title: c.moduleBoundaryLabel, items: [m.boundary] }, { tone: 'brand', title: c.moduleCheckLabel, items: [m.check] }],
    m.publicDocs ? [{ label: c.moduleEntryLink, href: `${m.repository}/blob/main/${m.entry}` }, { label: c.moduleContractLink, href: `${m.repository}/blob/main/module.contract.json` }] : undefined)));

  const qa = qaFlow();
  views.push(geometryView({ id: 'qa', parent: 'dev', title: c.qaTitle, crumb: c.navQa, hint: `${c.qaIntro} ${c.qaFlowCaption}`, w: 240, h: 86,
    boxes: qa.boxes.map((b, i) => ({ ...b, x: qa.layout.points[i][0], y: qa.layout.points[i][1] })),
    edges: qa.layout.edges.map(e => ({ d: e.path, label: e.label, at: e.label ? [e.x, e.y - 4] as [number, number] : undefined, dashed: e.dashed })),
    cards: [listCard('primary', c.qaScopeTitle, [[c.qaUiTitle, c.qaUiBody], [c.qaLogicTitle, c.qaLogicBody], [c.qaJourneyTitle, c.qaJourneyBody], [c.qaNativeTitle, c.qaNativeBody]]),
      { tone: 'brand', title: c.qaExploreTitle, items: [c.qaExploreBody] }, { tone: 'neutral', title: c.workflowQaTitle, items: [c.workflowQaBody] }, { tone: 'neutral', title: c.qaEvidenceTitle, items: [c.qaEvidenceBody] }] }));

  const mf = marketingFlow();
  views.push(geometryView({ id: 'marketing', parent: 'overview', title: c.operationsMarketing, crumb: c.archMarketingCrumb, hint: `${c.operationsMarketingBody} ${mf.caption}`, w: 210, h: 78,
    boxes: mf.boxes, edges: canvasEdges(mf.paths), drills: { improvement: 'marketing-dots' },
    cards: [listCard('primary', c.operationsMarketing, [[c.marketingSearchTitle, c.marketingSearchBody], [c.marketingDiscoveryTitle, c.marketingDiscoveryBody]]),
      { tone: 'brand', title: c.marketingPosliTitle, items: [c.marketingPosliBody, c.marketingPosliBoundary] },
      listCard('neutral', c.marketingImproveTitle, [[c.marketingStoryTitle, c.marketingStoryBody], [c.marketingMeasureTitle, c.marketingMeasureBody], [c.marketingImproveTitle, c.marketingImproveBody]])],
    links: [{ label: c.marketingInstagram, href: 'https://www.instagram.com/posli.makes/' }, { label: c.marketingThreads, href: 'https://www.threads.net/@posli.makes' }] }));
  views.push(chainView('marketing-dots', 'marketing', c.dotsTitle, c.dotsLabel, c.dotsIntro, c.dotsFlow,
    [listCard('primary', c.dotsTitle, [[c.dotsResearchTitle, c.dotsResearchBody], [c.dotsPlanTitle, c.dotsPlanBody], [c.dotsLearnTitle, c.dotsLearnBody]]), { tone: 'neutral', title: c.dotsLabel, items: [c.dotsBoundary] }],
    [{ label: c.dotsSource, href: 'https://learn.chatgpt.com/docs/dots' }]));

  return Object.fromEntries(views.map(v => [v.id, v]));
}
