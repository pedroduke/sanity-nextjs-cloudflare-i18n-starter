import { BookOpen, Github } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export const AboutCTA = async () => {
  const t = await getTranslations('AboutCTA')
  return (
    <section className="bg-gray-50 border-t border-gray-200 py-10 md:py-12 lg:py-14">
      <div className="container">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-8 lg:gap-12">
          {/* Left */}
          <div className="flex flex-col gap-2 max-w-[560px]">
            <p className="font-mono text-xs text-gray-600">{t('eyebrow')}</p>
            <h2 className="text-3xl font-bold text-gray-950">{t('heading')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{t('body')}</p>
          </div>

          {/* Right */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://github.com/pedroduke/sanity-nextjs-cloudflare-i18n-starter#readme"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded px-5 py-3 font-mono text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <BookOpen size={15} />
              {t('ctaSecondary')}
            </a>
            <a
              href="https://github.com/pedroduke/sanity-nextjs-cloudflare-i18n-starter"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gray-950 rounded px-5 py-3 font-mono text-sm font-semibold text-gray-50 hover:bg-gray-900 transition-colors"
            >
              <Github size={15} />
              {t('ctaPrimary')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
