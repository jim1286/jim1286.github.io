import { Badge, Card } from '@hjmds/react/display';
import { Heading } from '@hjmds/react/heading';
import { Stack, Text } from '@hjmds/react/layout';
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
export function ReleaseNotesPanel({ appId }: { appId: string }) {
  const app = apps.find(item => item.id === appId)!;
  const entries = releaseNotes.filter(note => note.app === app.id);
  return <Stack gap="lg">
        <Stack gap="sm">
          <Heading level="level2">{app.name} · {c.releaseNotesNav}</Heading>
          <Text as="p" tone="muted">{c.releaseNotesIntro}</Text>
          <Text variant="caption" tone="muted">{c.releaseNotesCount.replace('{count}', String(entries.length))} · {c.releaseNotesScope}</Text>
        </Stack>
        {entries.map(note => <Card key={note.id} title={<span id={`release-${note.id}`}>v{note.version}</span>} headingLevel={3} padding="lg">
            <Stack gap="md">
              <Text variant="caption" tone="muted">{note.notesSource === 'app-store' ? `App Store · ${c.releaseNotesRecorded}` : c.releaseNotesRecorded} <time dateTime={note.recordedOn}>{dateLabel(note.recordedOn)}</time></Text>
              {note.notes ? note.notes.split(/\n+/).map((paragraph, index) => <Text as="p" key={index}>{paragraph}</Text>) : <Text as="p" tone="muted">{c.releaseNotesNoDescription}</Text>}
              {note.platforms.length > 0 && <Stack axis="inline" gap="sm" wrap>
                {note.platforms.map(platform => <Badge key={platform.platform}>
                  {platform.platform === 'ios' ? 'iOS' : 'Android'} · {stateLabels[platform.status]} · {dateLabel(platform.asOf)} {c.releaseNotesChecked}
                </Badge>)}
              </Stack>}
            </Stack>
          </Card>)}
  </Stack>;
}
