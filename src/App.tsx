import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Collapsible } from '@hjmds/react/collapsible';
import { HjmProvider } from '@hjmds/react/provider';
import { Link } from '@hjmds/react/actions';
import { Container, Grid, Section, Stack, Surface, Text } from '@hjmds/react/layout';
import { Badge, Card, Icon, Statistic, Tag } from '@hjmds/react/display';
import { Heading } from '@hjmds/react/heading';
import { Asset } from '@hjmds/react/asset';
import { ScreenLayout } from '@hjmds/react/screens';
import { SkipNav } from '@hjmds/react/skip-nav';
import '@hjmds/react/styles.css';
import { AndroidFilled, AppleFilled, ArrowUpOutlined, ExportOutlined, GithubOutlined, MailOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import { BrandProvider } from './BrandProvider';
import StrategySection from './StrategySection';
import { siteCopy as copy, appCopy } from './copy';
import { apps, legalDocuments, portfolioSummary, type PortfolioApp } from './siteData';
import './styles/site.css';

const developerEmail = 'jimin1286@gmail.com';
const githubProfile = 'https://github.com/jim1286';

function ExternalLink({ href, ariaLabel, children }: { href: string; ariaLabel?: string; children: ReactNode }) {
  return <Link href={href} aria-label={ariaLabel} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{children}</Link>;
}

function AppLinks({ app }: { app: PortfolioApp }) {
  return <Stack axis="inline" gap="sm" wrap role="group" aria-label={appCopy.open(app.name)}>
    {app.webUrl && <ExternalLink href={app.webUrl} ariaLabel={appCopy.web(app.name)}><ExportOutlined aria-hidden /> {copy.web}</ExternalLink>}
    {app.iosUrl && <ExternalLink href={app.iosUrl} ariaLabel={appCopy.ios(app.name)}><AppleFilled aria-hidden /> {copy.appStore}</ExternalLink>}
    {app.androidUrl && <ExternalLink href={app.androidUrl} ariaLabel={appCopy.android(app.name)}><AndroidFilled aria-hidden /> {copy.googlePlay}</ExternalLink>}
    {/* Anonymous navigation and owner metadata establish private/archived
        repository access. Preserve source data without offering visitor 404s.
        See docs/qa/2026-10-08-hjm-adoption.md. */}
    {app.sourceAccess !== 'public'
      ? <Text variant="caption" tone="muted">{app.sourceAccess === 'archived' ? app.status : copy.privateSource}</Text>
      : <ExternalLink href={app.githubUrl}><GithubOutlined aria-hidden /> {copy.source}</ExternalLink>}
  </Stack>;
}

function ProductIcon({ app }: { app: PortfolioApp }) {
  return <Asset descriptor={{ kind: 'image', size: 'large', shape: 'rounded', decorative: true }}><img src={app.icon} alt="" /></Asset>;
}

function SiteHeader() {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 799px)').matches);
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const query = window.matchMedia('(max-width: 799px)');
    const change = () => { setCompact(query.matches); setOpen(false); };
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  const followSection = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!compact) return;
    const destination = document.getElementById(event.currentTarget.hash.slice(1));
    setOpen(false);
    // Focus follows the visited section after native hash navigation; returning
    // to the header would make the next Tab disagree with the visible location.
    requestAnimationFrame(() => destination?.focus({ preventScroll: true }));
  };
  return <BrandProvider surface="forest"><header className="site-header">
    <Container size="content" gutter="regular">
      <div className="header-content" onKeyDown={event => {
        if (event.key === 'Escape' && compact && open) {
          setOpen(false);
          menu.current?.querySelector('button')?.focus();
        }
      }}>
        <Link href="#top" variant="standalone" tone="neutral" aria-label={copy.home}><Text emphasis="strong">{copy.brandName}</Text></Link>
        {/* A single public disclosure keeps the sticky mobile header small;
            desktop uses its inline presentation instead of duplicate links. */}
        <Collapsible ref={menu} className="header-menu" trigger={copy.menu} open={open} onOpenChange={setOpen} presentation={compact ? 'disclosure' : 'inline'}>
          <Stack axis={compact ? 'block' : 'inline'} gap="sm" align="center">
        <nav aria-label={copy.navigation}><Stack axis="inline" gap="sm" wrap>
          <Link href="#apps" onClick={followSection} variant="standalone" tone="neutral">{copy.appsNav}</Link>
          <Link href="#strategy" onClick={followSection} variant="standalone" tone="neutral">{copy.strategyNav}</Link>
          <Link href="#legal" onClick={followSection} variant="standalone" tone="neutral">{copy.legalNav}</Link>
          <Link href="#developer" onClick={followSection} variant="standalone" tone="neutral">{copy.developerNav}</Link>
        </Stack></nav>
        <Link href={`mailto:${developerEmail}`} variant="standalone" tone="neutral">{copy.contact} <ExportOutlined aria-hidden /></Link>
          </Stack>
        </Collapsible>
      </div>
    </Container>
  </header></BrandProvider>;
}

export default function App() {
  return <HjmProvider theme="system" host="contents"><BrandProvider>
    <SkipNav targetId="main" label={copy.skip} />
    <div className="portfolio-host">
      {/* HJM publishes an introduction recipe, not a portable LandingScreen.
          Its public shell/sections/cards express this static marketing flow;
          OverviewScreen would invent data tools. See docs/DESIGN.md. */}
      <ScreenLayout title={copy.home} header={<SiteHeader />} contentInset="none" layoutStyle={{ maxWidth: 'none' }}>
        <div id="main" tabIndex={-1}>
          <BrandProvider surface="forest"><Surface as="section" padding="none" radius="sm" className="hero" id="top" aria-labelledby="hero-title">
            <div className="section-padding"><Container size="content" gutter="regular"><Grid columns={{ compact: 1, expanded: 2 }} gap={{ compact: 'xl' }} minColumnWidth={{ compact: 280 }}>
              <Stack gap="xl">
                <Text as="p" variant="caption" fontRole="code" tone="muted">{copy.eyebrow}</Text>
                <Heading level="level1" id="hero-title">{copy.heroStart}<br /><span className="hero-brand-word">{copy.heroFocus}</span>{copy.heroEnd}</Heading>
                <Text as="p" variant="bodyLarge" tone="muted">{copy.heroDescription}</Text>
                <Stack axis="inline" gap="md" wrap align="center">
                  <BrandProvider surface="lime"><Surface padding="sm" radius="md"><Link href="#apps" variant="standalone" tone="neutral">{copy.browse} <Icon name="chevronEnd" decorative /></Link></Surface></BrandProvider>
                  <ExternalLink href={githubProfile}><GithubOutlined aria-hidden /> {copy.github}</ExternalLink>
                </Stack>
              </Stack>
              <aside aria-label={copy.summary}>
                <Card title={copy.summaryIndex} headingLevel={2} tone="sunken" padding="xl">
                  <Stack gap="lg">
                    <Statistic descriptor={{ id: 'apps', label: copy.appsCount, value: String(portfolioSummary.appCount).padStart(2, '0') }} />
                    <Statistic descriptor={{ id: 'stores', label: copy.storesCount, value: String(portfolioSummary.storeLinkedAppCount).padStart(2, '0') }} />
                    <Statistic descriptor={{ id: 'platforms', label: copy.platformsCount, value: String(portfolioSummary.storePlatforms.length).padStart(2, '0') }} />
                    <Stack axis="inline" gap="sm" wrap>{portfolioSummary.storePlatforms.map(platform => <Tag key={platform}>{platform}</Tag>)}</Stack>
                  </Stack>
                </Card>
              </aside>
            </Grid></Container></div>
          </Surface></BrandProvider>

          <div className="section-padding"><Container size="content" gutter="regular"><Stack gap="md">
            <Text as="p" variant="caption" fontRole="code" tone="muted">{copy.appsIndex}</Text>
            <Section id="apps" tabIndex={-1} title={copy.appsTitle} description={copy.appsDescription}>
              <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }} minColumnWidth={{ compact: 280 }}>
                {apps.map(app => <Card key={app.id} title={<>{app.name}{app.englishName !== app.name && <Text as="small" variant="caption" tone="muted" layoutStyle={{ marginInlineStart: 12 }}> {app.englishName}</Text>}</>} description={app.description} leading={<ProductIcon app={app} />} tone={app.featured ? 'accent' : 'default'} padding="lg" actions={<AppLinks app={app} />}>
                  <Stack gap="sm">
                    <Text variant="caption" fontRole="code" tone="muted">{copy.appIndex(app.index)}</Text>
                    <Badge variant={app.statusTone === 'live' ? 'filled' : 'outline'}>{app.status}</Badge>
                    <Stack axis="inline" gap="xs" wrap aria-label={appCopy.technologies(app.name)}>{app.tags.map(tag => <Tag key={tag}>{tag}</Tag>)}</Stack>
                  </Stack>
                </Card>)}
              </Grid>
            </Section>
          </Stack></Container></div>

          <StrategySection />

          <BrandProvider surface="forest"><Surface as="section" padding="none" radius="sm">
            <div className="section-padding"><Container size="content" gutter="regular"><Stack gap="md">
              <Text as="p" variant="caption" fontRole="code" tone="muted">{copy.legalIndex}</Text>
              <Section id="legal" tabIndex={-1} title={copy.legalTitle} description={copy.legalDescription}>
                <Stack gap="lg">{legalDocuments.map(document => <Card key={document.id} title={document.name} description={document.note} headingLevel={3} tone="sunken" padding="lg" actions={<Stack axis="inline" gap="sm" wrap>
                  <ExternalLink href={document.privacyUrl}>{copy.privacy} <ExportOutlined aria-hidden /></ExternalLink>
                  {document.deletionUrl && <ExternalLink href={document.deletionUrl}>{copy.deletion} <ExportOutlined aria-hidden /></ExternalLink>}
                  <ExternalLink href={document.supportUrl}>{copy.support} <ExportOutlined aria-hidden /></ExternalLink>
                </Stack>}><Text variant="caption" fontRole="code" tone="muted">{document.index}</Text></Card>)}</Stack>
              </Section>
              <Text as="p" variant="caption" tone="muted"><SafetyCertificateOutlined aria-hidden /> {copy.legalNote}</Text>
            </Stack></Container></div>
          </Surface></BrandProvider>

          <div className="section-padding"><Container size="content" gutter="regular">
            <Section id="developer" tabIndex={-1}><Grid columns={{ compact: 1, expanded: 2 }} gap={{ compact: 'xl' }} minColumnWidth={{ compact: 280 }}>
              <div className="developer-photo-wrap"><img src="/profile.jpg" alt={copy.developerAlt} className="developer-photo" /><Text variant="caption" fontRole="code">{copy.seoul}</Text></div>
              <Stack gap="lg">
                <Text as="p" variant="caption" fontRole="code" tone="muted">{copy.developerIndex}</Text>
                <Heading level="level2">{copy.developerStart}<br />{copy.developerEnd}</Heading>
                <Text as="p" variant="bodyLarge" tone="muted">{copy.developerDescription}</Text>
                <dl className="developer-facts">
                  <div><dt><Text variant="label">{copy.developer}</Text></dt><dd><Text emphasis="strong">{copy.developerName}</Text></dd></div>
                  <div><dt><Text variant="label">{copy.email}</Text></dt><dd><Link href={`mailto:${developerEmail}`}>{developerEmail}</Link></dd></div>
                  <div><dt><Text variant="label">{copy.github}</Text></dt><dd><ExternalLink href={githubProfile}>{copy.githubAddress}</ExternalLink></dd></div>
                </dl>
              </Stack>
            </Grid></Section>
          </Container></div>

          <BrandProvider surface="orange"><Surface as="section" padding="none" radius="sm"><div className="section-padding"><Container size="content" gutter="regular"><Stack gap="lg">
            <Text as="p" variant="caption" fontRole="code">{copy.contactIndex}</Text>
            <Heading level="level3" semanticLevel={2}>{copy.contactQuestion}</Heading>
            <Link href={`mailto:${developerEmail}`} variant="standalone" tone="neutral">{copy.mail} <MailOutlined aria-hidden /></Link>
          </Stack></Container></div></Surface></BrandProvider>

          <BrandProvider surface="forest"><footer className="site-footer"><Container size="content" gutter="regular"><Stack axis="inline" gap="lg" wrap align="center" justify="between">
            <Link href="#top" variant="standalone" tone="neutral">{copy.brandName}</Link>
            <Text as="p" variant="caption" tone="muted">{copy.copyright}</Text>
            <Link href="#top" variant="standalone" tone="neutral" aria-label={copy.topLabel}>{copy.top} <ArrowUpOutlined aria-hidden /></Link>
          </Stack></Container></footer></BrandProvider>
        </div>
      </ScreenLayout>
    </div>
  </BrandProvider></HjmProvider>;
}
