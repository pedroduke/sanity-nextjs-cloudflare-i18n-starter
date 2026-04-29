import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig: NextConfig = {
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: 'false',
  },
  images: {
    remotePatterns: [new URL('https://cdn.sanity.io/**')],
  },
}

export default withNextIntl(nextConfig)

// Initialize OpenNext Cloudflare adapter for local development
// This enables Cloudflare bindings during dev and optimizes integration
initOpenNextCloudflareForDev()
