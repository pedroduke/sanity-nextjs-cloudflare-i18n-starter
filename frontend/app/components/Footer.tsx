'use client'

import { Github } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

const externalUrls = {
  template: {
    github: 'https://github.com/pedroduke/sanity-nextjs-cloudflare-i18n-starter',
  },
  stack: {
    sanity: 'https://sanity.io',
    next: 'https://nextjs.org',
    cloudflare: 'https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/',
    opennext: 'https://opennext.js.org/cloudflare',
  },
  i18n: {
    nextIntl: 'https://next-intl.dev/docs/getting-started/app-router',
    sanityLocalization: 'https://sanity.io/docs/i18n',
    tinloofI18n: 'https://www.npmjs.com/package/@tinloof/sanity-document-i18n',
    sanityI18n: 'https://www.npmjs.com/package/@sanity/document-internationalization',
  },
} as const

export const Footer = () => {
  const t = useTranslations('Footer')
  const locale = useLocale() as Locale

  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-14 pb-10">
      <div className="container">
        <div className="flex flex-col gap-12">
          {/* Top row */}
          <div className="flex flex-col lg:flex-row lg:justify-between gap-10 lg:gap-16">
            {/* Brand block */}
            <div className="flex flex-col gap-4 max-w-full lg:max-w-[400px]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-sm bg-brand inline-block" />
                <span className="font-mono text-sm font-semibold text-gray-950">sanity-nextjs-cloudflare-i18n-starter</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{t('tagline')}</p>
            </div>

            {/* Link columns */}
            <div className="flex flex-wrap gap-8 sm:gap-12 lg:gap-16">
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-semibold text-gray-950 uppercase tracking-wide">
                  {t('columns.template.title')}
                </span>
                <a href={externalUrls.template.github} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.template.github')}</a>
                <Link href="/about" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.template.documentation')}</Link>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-semibold text-gray-950 uppercase tracking-wide">
                  {t('columns.stack.title')}
                </span>
                <a href={externalUrls.stack.sanity} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.stack.sanity')}</a>
                <a href={externalUrls.stack.next} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.stack.next')}</a>
                <a href={externalUrls.stack.cloudflare} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.stack.cloudflare')}</a>
                <a href={externalUrls.stack.opennext} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.stack.opennext')}</a>
              </div>
              <div className="flex flex-col gap-3">
                <span className="font-mono text-xs font-semibold text-gray-950 uppercase tracking-wide">
                  {t('columns.i18n.title')}
                </span>
                <a href={externalUrls.i18n.nextIntl} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.i18n.nextIntl')}</a>
                <a href={externalUrls.i18n.sanityLocalization} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.i18n.sanityLocalization')}</a>
                <a href={externalUrls.i18n.tinloofI18n} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.i18n.tinloofI18n')}</a>
                <a href={externalUrls.i18n.sanityI18n} target="_blank" rel="noopener noreferrer" className="text-sm text-gray-700 hover:text-gray-950 transition-colors">{t('columns.i18n.sanityI18n')}</a>
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 pt-6 border-t border-gray-200">
            <span className="font-mono text-xs text-gray-600">{t('license')}</span>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {routing.locales.map((l) => {
                  const active = l === locale
                  return (
                    <Link
                      key={l}
                      href="/"
                      locale={l}
                      className={`font-mono text-[10px] uppercase border rounded px-2 py-0.5 transition-colors ${
                        active
                          ? 'border-brand text-brand'
                          : 'border-gray-200 text-gray-700 hover:text-gray-950'
                      }`}
                    >
                      {l}
                    </Link>
                  )
                })}
              </div>

              <a
                href={externalUrls.template.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-gray-700 hover:text-gray-950 transition-colors"
              >
                <Github size={12} />
                {t('viewSource')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
