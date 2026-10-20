import { Accordion } from '@hjmds/react/display';
import { Section, Stack, Text } from '@hjmds/react/layout';
import { FlowCanvas } from './FlowDiagram';
import { getCopy } from './i18n';

const c = getCopy();
const contracts = [
  [c.serverApiTitle, c.serverApiBody, 'AUTH_SIGNUP_POLICY.md'],
  [c.serverDbTitle, c.serverDbBody, 'LOCAL_DATABASE_POLICY.md'],
  [c.serverCacheTitle, c.serverCacheBody, 'SERVER_CACHE_POLICY.md'],
  [c.serverQueueTitle, c.serverQueueBody, 'BACKGROUND_JOB_POLICY.md'],
  [c.serverWorkerTitle, c.serverWorkerBody, 'NEW_APP_DEVELOPMENT_GUIDE.md#92-worker-실행-계약-v1과-동적-제어-연결'],
  [c.serverRecoveryTitle, c.serverRecoveryBody, 'BACKGROUND_JOB_POLICY.md'],
];

// A logical contract map, not a deployment topology: cache and queue may share Redis.
export function ServerContracts() {
  return <Section title={c.serverTitle} description={c.serverIntro}>
    <Stack gap="xl">
      <FlowCanvas title={c.serverDiagram} caption={c.serverCaption} height={840} boxes={[
        { id: 'client', x: 265, y: 20, title: c.serverClient, detail: c.serverClientDetail },
        { id: 'api', x: 265, y: 138, title: c.serverApi, detail: c.serverApiDetail },
        { id: 'service', x: 265, y: 256, title: c.serverDomain, detail: c.serverDomainDetail },
        { id: 'cache', x: 20, y: 256, title: c.serverCache, detail: c.serverCacheDetail, accent: true },
        { id: 'db', x: 20, y: 440, title: c.serverDb, detail: c.serverDbDetail, accent: true },
        { id: 'queue', x: 510, y: 440, title: c.serverQueue, detail: c.serverQueueDetail, accent: true },
        { id: 'worker', x: 510, y: 558, title: c.serverWorker, detail: c.serverWorkerDetail },
        { id: 'result', x: 265, y: 734, title: c.serverResult, detail: c.serverResultDetail },
      ]} paths={[
        'M370 98V138', 'M370 216V256',
        'M370 334V734',
      ]} optionalPaths={[
        'M265 295H230', 'M370 390H125V440', 'M370 390H615V440',
        'M615 518V558', 'M510 597H125V518',
        'M475 295H730V597H720',
        'M615 636V690H370', 'M230 479H245V773H265',
      ]} />
      <Accordion headingLevel={3} items={contracts.map(([title, body], index) => ({
        id: `server-contract-${index}`, title,
        panel: <Stack gap="lg"><Text as="p">{body}</Text></Stack>,
      }))} />
      <Stack gap="md">
        <Text emphasis="strong">{c.serverExamples}</Text>
        <Text as="p" tone="muted">{c.serverExamplesBody}</Text>
        <Text variant="caption" tone="muted">{c.privateDocsNote}</Text>
      </Stack>
    </Stack>
  </Section>;
}
