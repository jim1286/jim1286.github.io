import type { ReactNode } from 'react';
import { HjmProvider } from '@hjmds/react/provider';

// 2026-10-21 user decision: all sections inherit HJM defaults and the system theme.
export function BrandProvider({ children }: { children: ReactNode }) {
  return <HjmProvider host="contents" className="portfolio-theme">{children}</HjmProvider>;
}
