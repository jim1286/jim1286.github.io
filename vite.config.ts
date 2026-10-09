import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { ko } from './src/i18n/ko'

// Korean is the sole registered source locale. Share its public description
// with SSR-readable metadata instead of maintaining separate marketing copy.
// The owned-domain URL/image bindings in index.html are shared by the static hosts.
const metadata = {
  PORTFOLIO_TITLE: ko.seoTitle,
  PORTFOLIO_DESCRIPTION: ko.seoDescription,
  PORTFOLIO_IMAGE_ALT: ko.seoImageAlt,
}
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]!))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'portfolio-source-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler: html => Object.entries(metadata).reduce((result, [key, value]) =>
        result.replaceAll(`%${key}%`, escapeHtml(value)), html),
    },
  }],
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
})
