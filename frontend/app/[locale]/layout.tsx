import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Inter, IBM_Plex_Mono } from 'next/font/google'
import { draftMode } from 'next/headers'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { VisualEditing } from 'next-sanity/visual-editing'
import { Toaster } from 'sonner'

import { DraftModeToast } from '@/app/components/DraftModeToast'
import { Footer } from '@/app/components/Footer'
import { sanityFetch, SanityLive } from '@/sanity/lib/live'
import { settingsQuery } from '@/sanity/lib/queries'
import { resolveOpenGraphImage } from '@/sanity/lib/utils'
import { handleError } from '@/app/client-utils'
import { routing } from '@/i18n/routing'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  const { data: settings } = await sanityFetch({ query: settingsQuery, stega: false })

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }

  return {
    metadataBase,
    title: { template: `%s | ${t('siteTitle')}`, default: t('siteTitle') },
    description: t('siteDescription'),
    openGraph: {
      images: ogImage ? [ogImage] : [],
      locale,
      alternateLocale: routing.locales.filter((l) => l !== locale),
    },
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  }
}

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  const { isEnabled: isDraftMode } = await draftMode()

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${ibmPlexMono.variable} bg-gray-50 text-gray-900 antialiased`}
    >
      <body>
        <NextIntlClientProvider locale={locale}>
          <section className="min-h-screen pt-24">
            <Toaster theme="light" />
            {isDraftMode && (
              <>
                <DraftModeToast />
                <VisualEditing />
              </>
            )}
            <SanityLive onError={handleError} />
            <main>{children}</main>
            <Footer />
          </section>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
