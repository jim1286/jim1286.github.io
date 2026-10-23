import { useEffect, useMemo, useState, type KeyboardEvent } from 'react';
import { Link } from '@hjmds/react/actions';
import { Breadcrumb } from '@hjmds/react/breadcrumb';
import { DataTable } from '@hjmds/react/data-table';
import { Card } from '@hjmds/react/display';
import { Grid, Section, Stack, Text } from '@hjmds/react/layout';
import { SidePanel } from '@hjmds/react/side-panel';
import { getCopy } from '../i18n';
import { ARCH_VIEWS, type ArchEdge, type ArchNode, type ArchNodeType, type ArchView } from './archData';

const c = getCopy();
const DEFAULT_H = 62;
const PAD = 36;
const ROUTE_PREFIX = '#design/arch/';
const KINDS: Record<ArchNodeType, string> = {
  frontend: c.archKindFrontend, backend: c.archKindBackend, database: c.archKindDatabase,
  cloud: c.archKindCloud, security: c.archKindSecurity, external: c.archKindExternal,
};
type Box = [number, number, number, number];

export const archHref = (viewId: string) => `${ROUTE_PREFIX}${viewId}`;
// Links from the removed operations and QA tabs open the view that now holds their content.
const LEGACY_HASHES: Record<string, string> = { '#operations': 'ci', '#workflow': 'ci', '#strategy': 'ci', '#guidance': 'guide', '#marketing': 'marketing', '#qa': 'qa' };
function viewFromHash(hash: string) {
  const id = hash.startsWith(ROUTE_PREFIX) ? hash.slice(ROUTE_PREFIX.length) : LEGACY_HASHES[hash] ?? 'overview';
  return ARCH_VIEWS[id] ? id : 'overview';
}

// The App remounts the topic panel on every hash change, so the drill-in entry
// animation is handed across that remount through module state.
let pendingEntry = false;

function autoPath(a: ArchNode, b: ArchNode, H: number): number[][] {
  const lo = Math.max(a.x, b.x), hi = Math.min(a.x + a.w, b.x + b.w);
  if (hi - lo > 12) { const x = (lo + hi) / 2; return a.y < b.y ? [[x, a.y + H], [x, b.y]] : [[x, a.y], [x, b.y + H]]; }
  const ylo = Math.max(a.y, b.y), yhi = Math.min(a.y + H, b.y + H);
  if (yhi - ylo > 12) { const y = (ylo + yhi) / 2; return a.x < b.x ? [[a.x + a.w, y], [b.x, y]] : [[a.x, y], [b.x + b.w, y]]; }
  const ax = a.x + a.w / 2, by = b.y + H / 2;
  return [[ax, b.y > a.y ? a.y + H : a.y], [ax, by], [b.x > ax ? b.x : b.x + b.w, by]];
}

function roundedPath(pts: number[][], r = 8) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1], [cx, cy] = pts[i], [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy), rr = Math.min(r, l1 / 2, l2 / 2);
    d += ` L${cx - (cx - px) / l1 * rr},${cy - (cy - py) / l1 * rr} Q${cx},${cy} ${cx + (nx - cx) / l2 * rr},${cy + (ny - cy) / l2 * rr}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}

function labelPoint(pts: number[][]) {
  let best = 0, at = 0;
  for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); if (l > best) { best = l; at = i; } }
  return [(pts[at][0] + pts[at + 1][0]) / 2, (pts[at][1] + pts[at + 1][1]) / 2];
}

function useTextWidth() {
  return useMemo(() => {
    const ctx = document.createElement('canvas').getContext('2d');
    const family = getComputedStyle(document.body).fontFamily;
    return (text: string, size: number, weight = 500) => {
      if (!ctx) return text.length * size * 0.62;
      ctx.font = `${weight} ${size}px ${family}`;
      return ctx.measureText(text).width;
    };
  }, []);
}

function viewBoxOf(view: ArchView): Box {
  const H = view.h ?? DEFAULT_H;
  const xs = view.nodes.flatMap(n => [n.x - 10, n.x + n.w + 10]);
  const ys = view.nodes.flatMap(n => [n.y - 16, n.y + H + 10]);
  for (const e of view.edges) for (const p of e.path ?? []) { xs.push(p[0]); ys.push(p[1] - 10); }
  const x = Math.min(...xs) - PAD, y = Math.min(...ys) - PAD;
  return [x, y, Math.max(...xs) - x + PAD, Math.max(...ys) - y + PAD];
}

function animateBox(set: (box: Box) => void, from: Box, to: Box, ms: number) {
  return new Promise<void>(resolve => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { set(to); resolve(); return; }
    const start = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms), e = k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2;
      set(from.map((f, i) => f + (to[i] - f) * e) as Box);
      if (k < 1) requestAnimationFrame(step); else resolve();
    };
    requestAnimationFrame(step);
  });
}

function NodeIcon({ type, x, y }: { type: ArchNodeType; x: number; y: number }) {
  const p = { className: 'arch-icon', transform: `translate(${x},${y})` };
  if (type === 'frontend') return <g {...p}><rect width="11" height="9" rx="1.5" /><path d="M0 3H11" /></g>;
  if (type === 'backend') return <g {...p}><path d="M3.5 1L0.5 4.5L3.5 8M7.5 1L10.5 4.5L7.5 8" /></g>;
  if (type === 'database') return <g {...p}><ellipse cx="5.5" cy="1.8" rx="5" ry="1.8" /><path d="M0.5 1.8V8Q5.5 11 10.5 8V1.8" /></g>;
  if (type === 'cloud') return <g {...p}><path d="M3 9H9A2.5 2.5 0 0 0 8.6 4A3.5 3.5 0 0 0 2 4.6A2.2 2.2 0 0 0 3 9Z" /></g>;
  if (type === 'security') return <g {...p}><path d="M5.5 0.5L10.5 2.3V5.3C10.5 8 8.2 9.7 5.5 10.5C2.8 9.7 0.5 8 0.5 5.3V2.3Z" /></g>;
  return <g {...p}><rect y="2" width="8" height="8" rx="1.2" /><path d="M4 0.5H10.5V7" /></g>;
}

function ArchCanvas({ view, onDetail }: { view: ArchView; onDetail: (node: ArchNode) => void }) {
  const textWidth = useTextWidth();
  const full = useMemo(() => viewBoxOf(view), [view]);
  const [box, setBox] = useState<Box>(() => pendingEntry ? [full[0] + full[2] * 0.3, full[1] + full[3] * 0.3, full[2] * 0.4, full[3] * 0.4] : full);
  const [hover, setHover] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(view.nodes.map(n => [n.id, n])), [view]);
  const H = view.h ?? DEFAULT_H;

  useEffect(() => {
    if (!pendingEntry) return;
    pendingEntry = false;
    void animateBox(setBox, box, full, 360);
    // Runs once per mounted view; the entry starts from the initial zoomed box.
  }, []);

  const related = useMemo(() => {
    if (!hover) return null;
    const keep = new Set([hover]);
    for (const e of view.edges) if (e.from === hover || e.to === hover) { keep.add(e.from); keep.add(e.to); }
    return keep;
  }, [hover, view]);

  const detailKey = (event: KeyboardEvent, node: ArchNode) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onDetail(node); }
  };

  const edgeShape = (e: ArchEdge) => e.path ?? autoPath(byId[e.from], byId[e.to], H);
  const dimEdge = (e: ArchEdge) => related !== null && e.from !== hover && e.to !== hover;

  return <div className="arch-scroll" role="region" aria-label={view.title} tabIndex={0}>
    <svg className="arch-map" viewBox={box.join(' ')} role="group" aria-label={view.title}>
      <defs>
        {(['default', 'emphasis', 'security', 'dashed'] as const).map(variant => <marker key={variant} id={`arch-arrow-${variant}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0L10,5L0,10z" className={`arch-arrowhead arch-edge-${variant}`} />
        </marker>)}
      </defs>
      {view.boundaries.map(b => {
        const ns = b.wraps.map(id => byId[id]);
        const x = Math.min(...ns.map(n => n.x)) - 20, y = Math.min(...ns.map(n => n.y)) - 32;
        const x2 = Math.max(...ns.map(n => n.x + n.w)) + 20, y2 = Math.max(...ns.map(n => n.y + H)) + 20;
        return <g key={b.label} className="arch-boundary">
          <rect x={x} y={y} width={x2 - x} height={y2 - y} rx="14" />
          <text x={x + 14} y={y + 18}>{b.label}</text>
        </g>;
      })}
      {view.edges.map((e, i) => {
        const pts = edgeShape(e), variant = e.variant ?? 'default';
        return <path key={i} className={`arch-edge arch-edge-${variant}${dimEdge(e) ? ' is-dim' : ''}`} d={roundedPath(pts)} markerEnd={`url(#arch-arrow-${variant})`} />;
      })}
      {view.nodes.map(n => {
        const dim = related !== null && !related.has(n.id);
        const body = <>
          <rect className="arch-mask" x={n.x} y={n.y} width={n.w} height={H} rx="10" />
          <rect className="arch-body" x={n.x} y={n.y} width={n.w} height={H} rx="10" />
          {n.drill && <rect className="arch-ring" x={n.x - 5} y={n.y - 5} width={n.w + 10} height={H + 10} rx="13" />}
          <NodeIcon type={n.type} x={n.x + 9} y={n.y + 8} />
          <text className="arch-label" x={n.x + n.w / 2} y={n.y + H / 2 - 1} textAnchor="middle">{n.label}</text>
          <text className="arch-sub" x={n.x + n.w / 2} y={n.y + H / 2 + 16} textAnchor="middle">{n.sub}</text>
          {n.tag && <g className="arch-tag">
            <rect x={n.x + 8} y={n.y - 9} width={textWidth(n.tag, 9.5, 600) + 12} height="17" rx="5" />
            <text x={n.x + 14} y={n.y + 3}>{n.tag}</text>
          </g>}
          {n.drill && <g className="arch-open">
            <rect x={n.x + n.w - textWidth(c.archOpenDrill, 9.5, 700) - 26} y={n.y + H - 9} width={textWidth(c.archOpenDrill, 9.5, 700) + 20} height="17" rx="8.5" />
            <text x={n.x + n.w - textWidth(c.archOpenDrill, 9.5, 700) / 2 - 16} y={n.y + H + 3} textAnchor="middle">{c.archOpenDrill} ↘</text>
          </g>}
        </>;
        const common = { className: `arch-node${n.drill ? ' is-drill' : ''}${dim ? ' is-dim' : ''}`, 'data-type': n.type,
          onMouseEnter: () => setHover(n.id), onMouseLeave: () => setHover(null), onFocus: () => setHover(n.id), onBlur: () => setHover(null) };
        // Keep the product description available before following a shared design reference.
        return <g key={n.id} role="button" tabIndex={0} aria-label={c.archDetailAction.replace('{name}', n.label)} onClick={() => onDetail(n)} onKeyDown={event => detailKey(event, n)} {...common}>{body}</g>;
      })}
      {view.edges.map((e, i) => {
        if (!e.label) return null;
        const [x, y] = e.labelAt ?? labelPoint(edgeShape(e)), w = textWidth(e.label, 10) + 16;
        return <g key={i} className={`arch-pill${dimEdge(e) ? ' is-dim' : ''}`}>
          <rect x={x - w / 2} y={y - 9} width={w} height="18" rx="9" />
          <text x={x} y={y + 3.5} textAnchor="middle">{e.label}</text>
        </g>;
      })}
    </svg>
  </div>;
}

export function DrillArchitecture() {
  const [viewId] = useState(() => viewFromHash(window.location.hash));
  const view = ARCH_VIEWS[viewId];
  const [detail, setDetail] = useState<ArchNode | null>(null);
  const chain: ArchView[] = [];
  for (let v: ArchView | undefined = view; v; v = v.parent ? ARCH_VIEWS[v.parent] : undefined) chain.unshift(v);
  const kinds = [...new Set(view.nodes.map(n => n.type))];
  const byId = Object.fromEntries(view.nodes.map(n => [n.id, n]));
  const linkText = (e: ArchEdge, other: string) => `${byId[other].label}${e.label ? ` · ${e.label}` : ''}`;
  const table = view.table;

  const crumbs = <Breadcrumb label={c.archBreadcrumbLabel} items={chain.map((v, i) => i === chain.length - 1 ? { id: v.id, label: v.crumb } : { id: v.id, label: v.crumb, destination: { kind: 'internal', href: archHref(v.id) } })} />;
  return <Section title={c.archSectionTitle} description={c.archSectionIntro}><Stack gap="lg">
    <Card title={view.title} headingLevel={3} padding="lg"><Stack gap="md">
      {crumbs}
      <ArchCanvas view={view} onDetail={setDetail} />
      <Text as="p" variant="caption" tone="muted">{view.hint}</Text>
      {view.links && <div className="arch-code-links">{view.links.map(link => <Link key={link.href} href={link.href} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{link.label} ↗</Link>)}</div>}
      <div className="arch-legend" aria-label={c.archLegendTitle}>
        {kinds.map(kind => <span key={kind} data-type={kind}><i aria-hidden />{KINDS[kind]}</span>)}
        <span data-drill><i aria-hidden />{c.archLegendDrill}</span>
      </div>
    </Stack></Card>
    {table && <Card title={table.title} headingLevel={4} padding="lg">
      <DataTable density="compact" labels={{ table: c.archTableLabel, selectAll: '', selectRow: () => '', sortColumn: header => c.archTableSortColumn.replace('{header}', header) }}
        columns={(['app', 'client', 'server', 'host', 'hjm', 'release', 'ota', 'login'] as const).map(id => ({ id, header: { app: c.archTableApp, client: c.archTableClient, server: c.archTableServer, host: c.archTableHost, hjm: c.archTableHjm, release: c.archTableRelease, ota: c.archTableOta, login: c.archTableLogin }[id] }))}
        rows={table.rows.map(row => ({ id: row.id }))}
        getCellText={(rowId, columnId) => table.rows.find(row => row.id === rowId)!.cells[columnId]}
        renderCell={(rowId, columnId) => {
          const row = table.rows.find(item => item.id === rowId)!;
          return columnId === 'app' ? <Link href={archHref(row.view)} variant="standalone" tone="neutral">{row.cells.app}</Link> : row.cells[columnId];
        }} />
    </Card>}
    <Grid columns={{ compact: 1, expanded: view.cards.length }} gap={{ compact: 'lg' }}>
      {view.cards.map(card => <Card key={card.title} title={card.title} headingLevel={4} padding="lg">
        <ul className="arch-list">{card.items.map(item => <li key={item}><Text as="span" tone="muted">{item}</Text></li>)}</ul>
      </Card>)}
    </Grid>
    <SidePanel open={detail !== null} onOpenChange={open => { if (!open) setDetail(null); }} title={detail?.label ?? ''} description={detail ? `${KINDS[detail.type]} · ${detail.sub}` : undefined} closeLabel={c.archPanelClose} edge="end" size="regular">
      {detail && <Stack gap="lg">
        {detail.detail && <Text as="p">{detail.detail}</Text>}
        {detail.drill && <Link href={archHref(detail.drill)} variant="standalone" onClick={event => {
          if (!event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey && event.button === 0) pendingEntry = true;
        }}>{(view.id.startsWith('app-') ? c.archSharedDesignAction : c.archViewAction).replace('{name}', ARCH_VIEWS[detail.drill].title)}</Link>}
        {[[c.archPanelIncoming, view.edges.filter(e => e.to === detail.id).map(e => linkText(e, e.from))], [c.archPanelOutgoing, view.edges.filter(e => e.from === detail.id).map(e => linkText(e, e.to))]]
          .filter(([, items]) => items.length > 0)
          .map(([title, items]) => <Stack key={title as string} gap="xs">
            <Text emphasis="strong">{title as string}</Text>
            <ul className="arch-list">{(items as string[]).map(item => <li key={item}><Text as="span" tone="muted">{item}</Text></li>)}</ul>
          </Stack>)}
      </Stack>}
    </SidePanel>
  </Stack></Section>;
}
