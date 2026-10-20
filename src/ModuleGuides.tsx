import { Card } from '@hjmds/react/display';
import { Grid, Section, Stack, Text } from '@hjmds/react/layout';
import { Link } from '@hjmds/react/actions';
import { AreaFlow } from './FlowDiagram';
import { getCopy } from './i18n';

const c = getCopy();
// Editorial summaries of portfolio.json.modules and each repository's guidance.
// Contract consumer lists describe scope, not adoption or successful execution.
const modules = [
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

export function ModuleGuides() {
  return <Section title={c.moduleGuidesTitle} description={c.moduleGuidesIntro}>
    <Stack gap="xl">
      <Grid columns={{ compact: 1, expanded: 3 }} gap={{ compact: 'lg' }}>
        {modules.map(module => <Card key={module.title} title={module.title} headingLevel={3} padding="lg">
          <Stack gap="lg">
            <Text variant="caption" tone="muted">{module.kind}</Text>
            <Stack gap="sm"><Text emphasis="strong">{c.moduleRoleLabel}</Text><Text as="p">{module.role}</Text></Stack>
            <AreaFlow title={module.title} flow={module.flow} />
            <Stack gap="sm"><Text emphasis="strong">{c.moduleBoundaryLabel}</Text><Text as="p" tone="muted">{module.boundary}</Text></Stack>
            <Stack gap="sm"><Text emphasis="strong">{c.moduleCheckLabel}</Text><Text as="p" tone="muted">{module.check}</Text></Stack>
            {module.publicDocs ? <Stack axis="inline" gap="lg" wrap>
              <Link href={`${module.repository}/blob/main/${module.entry}`} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{c.moduleEntryLink} ↗</Link>
              <Link href={`${module.repository}/blob/main/module.contract.json`} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{c.moduleContractLink} ↗</Link>
            </Stack> : <Text variant="caption" tone="muted">{c.privateDocsNote}</Text>}
          </Stack>
        </Card>)}
      </Grid>
      <Text as="p" variant="caption" tone="muted">{c.moduleGuidesBasis}</Text>
    </Stack>
  </Section>;
}
