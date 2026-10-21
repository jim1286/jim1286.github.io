import type { ReactNode } from 'react';
import { Link } from '@hjmds/react/actions';
import { Card } from '@hjmds/react/display';
import { Grid, Stack, Text } from '@hjmds/react/layout';

// Shared by the topic panels and the drill-down sections.
export function ExternalLink({ href, children, label }: { href: string; children: ReactNode; label?: string }) {
  return <Link href={href} aria-label={label} target="_blank" rel="noreferrer noopener" variant="standalone" tone="neutral">{children}</Link>;
}
export function Notes({ items }: { items: { title: string; body: string }[] }) {
  return <Grid columns={{ compact: 1, medium: 2 }} gap={{ compact: 'md' }} minColumnWidth={{ compact: 260 }}>
    {items.map((item, index) => <Card key={item.title} title={item.title} headingLevel={3} padding="lg" tone="sunken">
      <Stack gap="md"><Text variant="caption" fontRole="code" tone="muted">{String(index + 1).padStart(2, '0')}</Text><Text as="p" tone="muted">{item.body}</Text></Stack>
    </Card>)}
  </Grid>;
}
