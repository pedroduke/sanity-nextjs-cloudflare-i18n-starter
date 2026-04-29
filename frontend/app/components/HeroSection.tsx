import { ArrowRight, Github } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { StatChips } from './StatChips'
import { Terminal } from './Terminal'

export const HeroSection = async () => {
  const t = await getTranslations('HeroSection')
  return (
    <section className="bg-gray-50 pb-16 md:pb-20 xl:pb-28 pt-12 md:pt-16 lg:pt-20 ">
      <div className="container">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 xl:gap-16 items-center">
          {/* Left */}
          <div className="flex flex-col gap-7">
            {/* Tag chip */}
            <div className="inline-flex items-center gap-1.5 bg-gray-100 border border-gray-200 rounded-[3px] px-3 py-[5px] w-fit">
              <span className="font-mono text-xs text-gray-700">{t('tagChip')}</span>
            </div>

            {/* H1 */}
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-950 leading-[1.1] max-w-[660px]">
              {t('headingLine1')}
              <br />
              {t('headingLine2')}
            </h1>

            {/* Accent bar */}
            <div className="w-20 h-[3px] bg-brand rounded-[1px]" />

            {/* Body */}
            <p className="text-xl text-gray-700 leading-relaxed max-w-lg">{t('body')}</p>

            {/* CTA row */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://github.com/pedroduke/sanity-nextjs-cloudflare-i18n-starter"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-950 font-mono text-sm rounded px-5 py-3 hover:bg-gray-100 transition-colors"
              >
                <Github size={14} />
                {t('ctaSecondary')}
              </a>
              <a
                href="https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand text-white font-mono text-sm font-semibold rounded px-4 py-2.5 hover:bg-orange-600 transition-colors"
              >
                {t('ctaPrimary')}
                <ArrowRight size={13} />
              </a>
            </div>
          </div>

          {/* Right */}
          <div className="hidden xl:flex flex-col gap-4">
            <Terminal />
            <StatChips />
          </div>
        </div>
      </div>
    </section>
  )
}
