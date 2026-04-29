import { Cloud, Languages, LayoutTemplate, SquareCode } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type PillarKey = 'sanity' | 'next' | 'cloudflare' | 'i18n'

const pillarMeta: { key: PillarKey; Icon: LucideIcon }[] = [
  { key: 'sanity', Icon: LayoutTemplate },
  { key: 'next', Icon: SquareCode },
  { key: 'cloudflare', Icon: Cloud },
  { key: 'i18n', Icon: Languages },
]

export const TechQuartet = async () => {
  const t = await getTranslations('TechQuartet')

  return (
    <section className="bg-gray-100 py-12 md:py-14 lg:py-16">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col gap-2.5 mb-10">
          <p className="font-mono text-xs text-gray-600">{t('eyebrow')}</p>
          <h2 className="text-3xl font-semibold text-gray-950">{t('heading')}</h2>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4">
          {pillarMeta.map((p, i) => {
            const isFirst = i === 0
            const isLast = i === pillarMeta.length - 1
            const padding = isFirst
              ? 'md:pl-0 md:pr-7 md:py-6'
              : isLast
                ? 'md:pl-7 md:pr-0 md:py-6'
                : 'md:px-7 md:py-6'
            const border = 'md:border-r md:border-gray-200'
            const Icon = p.Icon
            return (
              <div key={p.key} className={`flex flex-col gap-4 py-6 ${padding} ${border}`}>
                <div className="w-9 h-9 flex items-center justify-center rounded-md border border-brand">
                  <Icon size={18} className="text-brand" />
                </div>
                <p className="text-lg font-mono font-semibold text-gray-950">{t(`items.${p.key}.title`)}</p>
                <p className="text-base text-gray-700 leading-relaxed">{t(`items.${p.key}.body`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
