import type { ReactNode } from 'react';
import { HjmProvider, useHjmTheme } from '@hjmds/react/provider';
import { resolveDesignSystemProviderValue } from '@hjmds/design-contracts/components/design-system-provider';

export function BrandProvider({ children }: { children: ReactNode }) {
  const { environment } = useHjmTheme();
  // The editorial site deliberately uses paper/forest in both OS modes. Resolve
  // that decision here so HJM text and controls cannot inherit a dark neutral
  // palette under light product CSS. Motion, direction and text scale still flow.
  const value = resolveDesignSystemProviderValue({ ...environment, theme: 'light' }, {
    systemTheme: environment.theme,
    brandPalette: { light: {
      bg: '#f4f2ea', surface: '#ffffff', surfaceAlt: '#edece4',
      // Precomposed ink at 18% over paper; the semantic palette accepts opaque hex.
      surfaceAccent: '#c8ff47', border: '#cbcec5',
      borderControl: '#65736b', text: '#12291f', textBody: '#12291f',
      textMuted: '#65736b', textSub: '#65736b', primary: '#173e2e',
      contentBrand: '#173e2e', onPrimary: '#ffffff',
    } },
  });
  return <HjmProvider value={value} className="portfolio-theme">{children}</HjmProvider>;
}
