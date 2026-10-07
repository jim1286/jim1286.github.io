import { catalogs } from './catalogs.generated';
import { DEFAULT_LOCALE, isLocale, LOCALE_OPTIONS } from './registry.generated';
export * from './registry.generated';
// A locale URL controls the page only; following a shared link does not persist a preference.
export function currentLocale(path = typeof window === 'undefined' ? '/' : window.location.pathname) {
  const segment = path.split('/')[1];
  return isLocale(segment) ? segment : DEFAULT_LOCALE;
}
export function getCopy(locale = currentLocale()) { return catalogs[locale]; }
export function documentLocale(locale = currentLocale()) { return LOCALE_OPTIONS.find(option => option.tag === locale)!; }
