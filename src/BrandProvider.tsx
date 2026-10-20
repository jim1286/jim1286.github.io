import type { ReactNode } from 'react';
import { HjmProvider } from '@hjmds/react/provider';
import { defineHjmDesignProfile } from '@hjmds/design-contracts/design-profile';

// The site's paper/forest identity is product-owned. Start with neutral contracts,
// not Showcase artwork/effects; profile roles keep private recipe CSS intact.
// See docs/DESIGN.md for the marketing-screen composition decision.
// No heading override: HJM 1.28 caps type at typography.heading 24 and rejects larger profile
// steps (2026-10-17 user decision removing the display tier); the 52/38/28 editorial scale went.
const portfolioDesign = defineHjmDesignProfile({
  id: 'portfolio-paper-forest',
  tokens: {
    // Keep HJM's small radius: a zero override made shared badges/tags square (2026-10-19 UI review).
    radius: { md: 12, lg: 20, xl: 24 },
  },
  material: { canvas: null, card: null, surface: null },
  compositions: { collection: 'grid', toolbar: 'inline' },
  screens: { overview: 'landscape' },
});

// Existing #65736b copy measured 4.44:1 on paper. A slightly darker semantic
// secondary ink keeps the brand while meeting 4.5:1 for small product text.
const palettes = {
  paper: { light: {
    bg: '#ffffff', surface: '#ffffff', surfaceAlt: '#f4f6f4', surfaceAccent: '#eaf1eb',
    border: '#cbcec5', borderControl: '#65736b', text: '#12291f', textBody: '#12291f',
    textMuted: '#627068', textSub: '#627068', primary: '#173e2e',
    contentBrand: '#173e2e', onPrimary: '#ffffff',
  } },
  forest: { light: {
    bg: '#0b241a', surface: '#173e2e', surfaceAlt: '#12291f', surfaceAccent: '#173e2e',
    border: '#65736b', borderControl: '#a9bbb2', text: '#f4f2ea', textBody: '#f4f2ea',
    textMuted: '#c5d1cb', textSub: '#c5d1cb', primary: '#c8ff47',
    contentBrand: '#c8ff47', onPrimary: '#0b241a',
  } },
  warm: { light: {
    bg: '#fff8ed', surface: '#ffffff', surfaceAlt: '#f4f2ea', surfaceAccent: '#e9eddc',
    border: '#e9dccb', borderControl: '#65736b', text: '#12291f', textBody: '#12291f',
    textMuted: '#627068', textSub: '#627068', primary: '#173e2e',
    contentBrand: '#173e2e', onPrimary: '#ffffff',
  } },
  lime: { light: {
    bg: '#c8ff47', surface: '#c8ff47', surfaceAlt: '#c8ff47', surfaceAccent: '#c8ff47',
    border: '#65736b', borderControl: '#173e2e', text: '#0b241a', textBody: '#0b241a',
    textMuted: '#173e2e', textSub: '#173e2e', primary: '#173e2e',
    contentBrand: '#0b241a', onPrimary: '#ffffff',
  } },
  orange: { light: {
    bg: '#ff6b35', surface: '#ff6b35', surfaceAlt: '#ff6b35', surfaceAccent: '#ff6b35',
    border: '#173e2e', borderControl: '#173e2e', text: '#0b241a', textBody: '#0b241a',
    textMuted: '#173e2e', textSub: '#173e2e', primary: '#173e2e',
    contentBrand: '#0b241a', onPrimary: '#ffffff',
  } },
} as const;

export function BrandProvider({ children, surface = 'paper' }: { children: ReactNode; surface?: keyof typeof palettes }) {
  // Light-only is the established editorial treatment in both OS modes. Nested
  // palettes replace inverted-section CSS overrides while motion/direction and
  // component identity continue to follow the parent.
  return <HjmProvider theme="light" designProfile={portfolioDesign} brandPalette={palettes[surface]} host="contents" className="portfolio-theme">{children}</HjmProvider>;
}
