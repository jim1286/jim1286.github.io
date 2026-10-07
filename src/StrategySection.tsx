import { Link } from '@hjmds/react/actions';
import { Card, Icon } from '@hjmds/react/display';
import { Container, Grid, Section, Stack, Surface, Text } from '@hjmds/react/layout';
import { strategyCopy as copy } from './copy';

const development = [
  [copy.developmentProblem, copy.developmentProblemDetail],
  [copy.developmentScope, copy.developmentScopeDetail],
  [copy.developmentDesign, copy.developmentDesignDetail],
  [copy.developmentImplementation, copy.developmentImplementationDetail],
  [copy.developmentQa, copy.developmentQaDetail],
  [copy.developmentRelease, copy.developmentReleaseDetail],
  [copy.developmentImprovement, copy.developmentImprovementDetail],
] as const;
const marketing = [
  [copy.marketingProblem, copy.marketingProblemDetail],
  [copy.marketingDiscovery, copy.marketingDiscoveryDetail],
  [copy.marketingValue, copy.marketingValueDetail],
  [copy.marketingReaction, copy.marketingReactionDetail],
  [copy.marketingImprovement, copy.marketingImprovementDetail],
] as const;

// These are operating directions, not measured campaign results. Readable HTML
// lists retain the sequence/branch on phones; separate diagrams offer export.
// The search/discovery choice follows portfolio MARKETING_POLICY §3/5/6.
export default function StrategySection() {
  return <div className="section-padding"><Container size="content" gutter="regular">
    <Stack gap="md">
      <Text as="p" variant="caption" fontRole="code" tone="muted">{copy.strategyIndex}</Text>
      <Section id="strategy" tabIndex={-1} title={copy.strategyTitle} description={copy.strategyDescription}>
        <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'lg' }} minColumnWidth={{ compact: 280 }}>
          <Card title={copy.developmentStrategyTitle} headingLevel={3} padding="lg" actions={<Link href="/diagrams/development-strategy.html" variant="standalone">{copy.developmentDiagram} <Icon name="chevronEnd" decorative /></Link>}>
            <ol className="strategy-steps">{development.map(([label, detail], index) => <li key={label}>
              <Stack gap="sm"><Text emphasis="strong">{label}</Text><Text tone="muted">{detail}</Text>{index < development.length - 1 && <Icon name="chevronDown" decorative />}</Stack>
            </li>)}</ol>
          </Card>
          <Card title={copy.marketingStrategyTitle} headingLevel={3} padding="lg" actions={<Link href="/diagrams/marketing-strategy.html" variant="standalone">{copy.marketingDiagram} <Icon name="chevronEnd" decorative /></Link>}>
            <ol className="strategy-steps">{marketing.map(([label, detail], index) => <li key={label}>
              <Stack gap="sm"><Text emphasis="strong">{label}</Text><Text tone="muted">{detail}</Text>
                {index === 1 && <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'sm' }} minColumnWidth={{ compact: 120 }}>
                  <Surface padding="md" radius="md" tone="sunken"><Stack gap="sm"><Text emphasis="strong">{copy.marketingSearch}</Text><Text tone="muted">{copy.marketingSearchDetail}</Text></Stack></Surface>
                  <Surface padding="md" radius="md" tone="sunken"><Stack gap="sm"><Text emphasis="strong">{copy.marketingDiscover}</Text><Text tone="muted">{copy.marketingDiscoverDetail}</Text></Stack></Surface>
                </Grid>}
                {index < marketing.length - 1 && <Icon name="chevronDown" decorative />}
              </Stack>
            </li>)}</ol>
          </Card>
        </Grid>
      </Section>
    </Stack>
  </Container></div>;
}
