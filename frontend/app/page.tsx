import { redirect } from 'next/navigation'
import { routing } from '@/i18n/routing'

// Replaces the next-intl middleware's root redirect. Next 16 deprecated middleware
// (proxy.ts) and forces it onto Node runtime, which @opennextjs/cloudflare does not
// yet support. With localePrefix: 'always', this is the only redirect we needed —
// locale resolution otherwise happens via the [locale] route segment.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`)
}
