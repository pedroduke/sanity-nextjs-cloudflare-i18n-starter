import type { Metadata } from 'next'
import { ArrowUpRight, Cloud, FileText, Languages, LayoutTemplate, Package, SquareCode } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Header } from '@/app/components/Header'
import { AboutCTA } from '@/app/components/AboutCTA'
import { routing } from '@/i18n/routing'

type DocKey = 'cloudflare' | 'opennext' | 'sanity' | 'next' | 'nextIntl' | 'tinloof'

type DocCardMeta = {
  key: DocKey
  url: string
  urlLabel: string
  Icon: LucideIcon
}

const docMeta: DocCardMeta[] = [
  { key: 'cloudflare', url: 'https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/', urlLabel: 'developers.cloudflare.com', Icon: Cloud },
  { key: 'opennext', url: 'https://opennext.js.org/cloudflare', urlLabel: 'opennext.js.org', Icon: Package },
  { key: 'sanity', url: 'https://sanity.io/docs', urlLabel: 'sanity.io/docs', Icon: LayoutTemplate },
  { key: 'next', url: 'https://nextjs.org/docs', urlLabel: 'nextjs.org/docs', Icon: SquareCode },
  { key: 'nextIntl', url: 'https://next-intl.dev', urlLabel: 'next-intl.dev', Icon: Languages },
  { key: 'tinloof', url: 'https://www.npmjs.com/package/@tinloof/sanity-document-i18n', urlLabel: 'npmjs.com', Icon: FileText },
]

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: t('aboutTitle'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/about`])),
    },
  }
}

type Props = { params: Promise<{ locale: string }> }

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const tHero = await getTranslations('AboutHero')
  const tDocs = await getTranslations('DocsSection')

  return (
    <>
      <Header />

      <section className="bg-gray-50 pt-12 pb-10 md:pt-16 md:pb-14 lg:pt-20 lg:pb-[72px]">
        <div className="container">
          <div className="flex flex-col gap-5">
            <div className="inline-flex bg-gray-100 border border-gray-200 rounded-[3px] px-3 py-[5px] w-fit">
              <span className="font-mono text-xs text-gray-700">{tHero('tagChip')}</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-950 leading-[1.1] max-w-3xl">
              {tHero('heading')}
            </h1>
            <div className="w-20 h-[3px] bg-brand rounded-[1px]" />
            <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">{tHero('body')}</p>
          </div>
        </div>
      </section>

      <section className="bg-gray-100 border-t border-gray-200 py-12 md:py-16 lg:py-[72px]">
        <div className="container">
          <div className="flex flex-col gap-2.5 mb-10">
            <p className="font-mono text-xs text-gray-600">{tDocs('eyebrow')}</p>
            <h2 className="text-3xl font-semibold text-gray-950">{tDocs('heading')}</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {docMeta.map((doc) => {
              const Icon = doc.Icon
              return (
                <div key={doc.key} className="flex flex-col gap-5 bg-white border border-gray-200 rounded-md p-8">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-md border border-brand">
                      <Icon size={18} className="text-brand" aria-hidden />
                    </div>
                    <span className="bg-gray-100 rounded-full px-2.5 py-1 font-mono text-[10px] text-gray-600">
                      {doc.urlLabel}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-950">{tDocs(`items.${doc.key}.title`)}</h3>
                  <p className="text-base text-gray-700 leading-relaxed flex-1">{tDocs(`items.${doc.key}.body`)}</p>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-sm text-brand hover:underline"
                  >
                    {tDocs('readDocs')}
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <AboutCTA />
    </>
  )
}
