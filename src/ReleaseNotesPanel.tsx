import { Badge, Card } from '@hjmds/react/display';
import { Heading } from '@hjmds/react/heading';
import { Stack, Text } from '@hjmds/react/layout';
import { Tabs, TabPanel } from '@hjmds/react/navigation';
import { getCopy } from './i18n';
import { apps } from './siteData';
import { releaseNotes, type ReleasePlatformState } from './releases/data';

const c = getCopy();
const dateLabel = (date: string) => date.replaceAll('-', '.');
const stateLabels: Record<ReleasePlatformState['status'], string> = {
  review: c.releaseNotesReview, submitted: c.releaseNotesSubmitted,
  internal: c.releaseNotesInternal, 'closed-review': c.releaseNotesClosedReview,
  available: c.releaseNotesAvailable,
};
export function ReleaseNotesPanel() {
  const slug = window.location.hash.slice(1).split('/')[1];
  const app = apps.find(item => item.id === slug) ?? apps[0];
  const entries = releaseNotes.filter(note => note.app === app.id);
  return <Stack gap="xl">
    <Tabs id="release-apps" label={c.releaseNotesAppLabel} value={app.id}
      onValueChange={value => { window.location.hash = `releases/${value}`; }}
      indicator="solid" items={apps.map(item => ({ id: item.id, label: item.name }))} renderPanels={false} />
    <TabPanel tabsId="release-apps" value={app.id} activeValue={app.id} mode="keyed">
      <Stack gap="lg">
        <Stack gap="sm">
          <Heading level="level1">{app.name} · {c.releaseNotesNav}</Heading>
          <Text as="p" tone="muted">{c.releaseNotesIntro}</Text>
          <Text variant="caption" tone="muted">{c.releaseNotesCount.replace('{count}', String(entries.length))} · {c.releaseNotesScope}</Text>
        </Stack>
        {entries.map(note => <Card key={note.id} title={<span id={`release-${note.id}`}>v{note.version}</span>} headingLevel={2} padding="lg">
            <Stack gap="md">
              <Text variant="caption" tone="muted">{c.releaseNotesRecorded} <time dateTime={note.recordedOn}>{dateLabel(note.recordedOn)}</time></Text>
              {note.notes.split(/\n+/).map((paragraph, index) => <Text as="p" key={index}>{paragraph}</Text>)}
              {note.platforms.length > 0 && <Stack axis="inline" gap="sm" wrap>
                {note.platforms.map(platform => <Badge key={platform.platform}>
                  {platform.platform === 'ios' ? 'iOS' : 'Android'} · {stateLabels[platform.status]} · {dateLabel(platform.asOf)} {c.releaseNotesChecked}
                </Badge>)}
              </Stack>}
            </Stack>
          </Card>)}
      </Stack>
    </TabPanel>
  </Stack>;
}
