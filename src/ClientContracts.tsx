import { Accordion } from '@hjmds/react/display';
import { Section, Stack, Text } from '@hjmds/react/layout';
import { FlowCanvas } from './FlowDiagram';
import { getCopy } from './i18n';

const c = getCopy();
const contracts = [
  [c.clientUiTitle, c.clientUiBody], [c.clientStateTitle, c.clientStateBody],
  [c.clientDataTitle, c.clientDataBody], [c.clientAuthTitle, c.clientAuthBody],
  [c.clientPlatformTitle, c.clientPlatformBody], [c.clientReleaseTitle, c.clientReleaseBody],
];

// Shared logical responsibilities; platform-specific transport is not a shared token store.
function ClientDiagram({ native }: { native: boolean }) {
  return <FlowCanvas title={native ? c.clientAppTitle : c.clientWebTitle} caption={native ? c.clientAppCaption : c.clientWebCaption} height={720} boxes={[
    { id: 'route', x: 265, y: 20, title: native ? c.clientAppRoute : c.clientWebRoute, detail: native ? c.clientAppRouteDetail : c.clientWebRouteDetail },
    { id: 'ui', x: 265, y: 138, title: native ? c.clientAppUi : c.clientWebUi, detail: c.clientUiDetail },
    { id: 'model', x: 265, y: 256, title: c.clientModel, detail: c.clientModelDetail },
    { id: 'storage', x: 20, y: 256, title: c.clientStorage, detail: c.clientStorageDetail, accent: true },
    { id: 'adapter', x: 510, y: 256, title: native ? c.clientAppAdapter : c.clientWebAdapter, detail: native ? c.clientAppAdapterDetail : c.clientWebAdapterDetail, accent: true },
    { id: 'client', x: 265, y: 374, title: c.clientApi, detail: c.clientApiDetail },
    { id: 'transport', x: 265, y: 492, title: native ? c.clientAppTransport : c.clientWebTransport, detail: native ? c.clientAppTransportDetail : c.clientWebTransportDetail },
    { id: 'server', x: 265, y: 610, title: c.clientServer, detail: c.clientServerDetail },
  ]} paths={[
    'M370 98V138', 'M370 216V256', 'M265 295H230', 'M475 295H510',
    'M370 334V374', 'M370 452V492', 'M370 570V610',
  ]} />;
}

export function ClientContracts() {
  return <Section title={c.clientTitle} description={c.clientIntro}>
    <Stack gap="xl">
      <ClientDiagram native={false} />
      <ClientDiagram native />
      <Accordion headingLevel={3} items={contracts.map(([title, body], index) => ({
        id: `client-contract-${index}`, title, panel: <Text as="p">{body}</Text>,
      }))} />
      <Text as="p" variant="caption" tone="muted">{c.privateDocsNote}</Text>
    </Stack>
  </Section>;
}
