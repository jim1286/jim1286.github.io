import { useId } from 'react';
import { Card } from '@hjmds/react/display';
import { Stack, Text } from '@hjmds/react/layout';
import { getCopy } from './i18n';

const c = getCopy();
type Node = { id: string; title: string; detail: string };
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
  client: {height:650,points:[[150,70],[510,70],[150,310],[510,310],[150,490],[510,490]],
    regions:[{x:90,y:20,w:720,h:170,title:c.architectureLabel8},{x:90,y:265,w:720,h:360,title:c.architectureLabel9}],
    edges:[edge('M270 156V220H450V265','',0,0),edge('M630 156V220H450',c.architectureLabel10,450,242)]},
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

export function ArchitectureDiagram({ title, caption, boxes, diagramKey, layout: customLayout, legend }: {
  title: string; caption: string; boxes: Node[]; diagramKey: string; layout?: ArchitectureLayout; legend?: string;
}) {
  const marker = `architecture-${useId().replaceAll(':','')}`;
  const layout = customLayout ?? layouts[diagramKey];
  return <Card title={title} headingLevel={3} padding="lg"><Stack gap="lg">
    <div className="architecture-scroll" role="region" aria-label={title} tabIndex={0}>
      <svg className="architecture-map" viewBox={`0 0 900 ${layout.height}`} role="img" aria-labelledby={`${marker}-title ${marker}-desc`}>
        <title id={`${marker}-title`}>{title}</title><desc id={`${marker}-desc`}>{caption} {layout.edges.map(e=>e.label).filter(Boolean).join(' · ')}</desc>
        <defs><marker id={marker} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10Z" fill="var(--hjm-color-primary)" /></marker></defs>
        {layout.regions.map(region=><g key={region.title}><rect x={region.x} y={region.y} width={region.w} height={region.h} rx="20" fill="var(--hjm-color-surface-alt)" /><text x={region.x+22} y={region.y+33} fontSize="14" fontWeight="600" fill="var(--hjm-color-text-muted)">{region.title}</text></g>)}
        {layout.edges.map((item,i)=><g key={i}><path d={item.path} fill="none" stroke="var(--hjm-color-primary)" strokeWidth="1.7" strokeLinejoin="round" strokeDasharray={item.dashed?'6 5':undefined} markerEnd={`url(#${marker})`} />{item.label&&<text x={item.x} y={item.y} textAnchor="middle" fontSize="13" fill="var(--hjm-color-text-muted)" stroke="var(--hjm-color-bg)" strokeWidth="7" paintOrder="stroke" strokeLinejoin="round">{item.label}</text>}</g>)}
        {boxes.map((box,i)=>{const [x,y]=layout.points[i];return <g key={box.id}><rect x={x} y={y} width="240" height={diagramKey === 'operations' ? 60 : 86} rx="12" fill="var(--hjm-color-surface)" stroke="var(--hjm-color-border-control)" /><text x={x+120} y={y+34} textAnchor="middle" fill="var(--hjm-color-text)" fontSize="16" fontWeight="600">{diagramKey === 'operations' && box.title.length > 18 ? <>{box.title.match(/.{1,18}/gu)?.map((line, index) => <tspan key={index} x={x+120} dy={index ? 22 : -3}>{line}</tspan>)}</> : box.title}</text><text x={x+120} y={y+61} textAnchor="middle" fill="var(--hjm-color-text-muted)" fontSize="12">{box.detail}</text></g>;})}
      </svg>
    </div>
    <Text as="p" variant="caption" tone="muted">{legend ?? (diagramKey==='overall'?c.architectureLabel34:diagramKey==='server'||diagramKey==='change'?c.architectureLabel35:c.architectureLabel36)}</Text>
    <Text as="p" tone="muted">{caption}</Text>
    <span className="diagram-mobile-hint"><Text variant="caption" tone="muted">{c.diagramScroll}</Text></span>
  </Stack></Card>;
}
