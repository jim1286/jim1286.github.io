import { Accordion, Card } from '@hjmds/react/display';
import { Grid, Section, Stack, Text } from '@hjmds/react/layout';
import { Link } from '@hjmds/react/actions';
import { getCopy } from './i18n';
import { OverallFlow } from './FlowDiagram';

const c = getCopy();
const steps = [
  [c.flowStep1Title, c.flowStep1Body], [c.flowStep2Title, c.flowStep2Body],
  [c.flowStep3Title, c.flowStep3Body], [c.flowStep4Title, c.flowStep4Body],
  [c.flowStep5Title, c.flowStep5Body], [c.flowStep6Title, c.flowStep6Body],
];
const areas = [
  [c.workMap1Title, c.workMap1Flow, c.workMap1Body], [c.workMap2Title, c.workMap2Flow, c.workMap2Body],
  [c.workMap3Title, c.workMap3Flow, c.workMap3Body], [c.workMap4Title, c.workMap4Flow, c.workMap4Body],
  [c.workMap5Title, c.workMap5Flow, c.workMap5Body], [c.workMap6Title, c.workMap6Flow, c.workMap6Body],
  [c.workMap7Title, c.workMap7Flow, c.workMap7Body], [c.workMap8Title, c.workMap8Flow, c.workMap8Body],
];

export function DevelopmentFlow() {
  return <Section title={c.flowStepsTitle} description={c.flowStepsIntro}>
    <Grid columns={{ compact: 1, medium: 2, expanded: 3 }} gap={{ compact: 'md' }}>
      {steps.map(([title, body], i) => <Card key={title} title={`${String(i + 1).padStart(2, '0')} · ${title}`} headingLevel={3} padding="lg">
        <Text as="p" tone="muted">{body}</Text>
      </Card>)}
    </Grid>
    <Link href="#guidance" variant="standalone" tone="neutral">{c.workMapTitle} →</Link>
  </Section>;
}

export function WorkflowMap() {
  return <Stack gap="xl">
    <Section title={c.workMapTitle} description={c.workMapIntro}>
      <Stack gap="xl">
      <OverallFlow />
      <Stack gap="lg">
      <Text as="p" tone="muted">{c.workMapHint}</Text>
      <Accordion headingLevel={3} items={areas.map(([title, flow, body], i) => ({
        id: `area-${i + 1}`, title: `${String(i + 1).padStart(2, '0')} · ${title}`,
        panel: <Stack gap="sm"><Text as="p" emphasis="strong">{flow}</Text><Text as="p" tone="muted">{body}</Text></Stack>,
      }))} />
      </Stack>
      </Stack>
    </Section>
    <Section title={c.workMapCasesTitle} description={c.workMapCasesIntro}>
      <Grid columns={{ compact: 1, medium: 3 }} gap={{ compact: 'md' }}>
        {[[c.workMapCaseHjmTitle, c.workMapCaseHjmBody], [c.workMapCaseBurnTitle, c.workMapCaseBurnBody], [c.workMapCaseLegacyTitle, c.workMapCaseLegacyBody]].map(([title, body]) =>
          <Card key={title} title={title} headingLevel={3} padding="lg"><Text as="p" tone="muted">{body}</Text></Card>)}
      </Grid>
    </Section>
  </Stack>;
}
