import { Code, Eye, FileText, Languages, LayoutGrid, Terminal } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type FeatureKey = 'pageBuilder' | 'nextIntl' | 'tinloofI18n' | 'preview' | 'deploy' | 'typescript'

const featureMeta: { key: FeatureKey; Icon: LucideIcon }[] = [
  { key: 'pageBuilder', Icon: LayoutGrid },
  { key: 'nextIntl', Icon: Languages },
  { key: 'tinloofI18n', Icon: FileText },
  { key: 'preview', Icon: Eye },
  { key: 'deploy', Icon: Terminal },
  { key: 'typescript', Icon: Code },
]

export const FeaturesSection = async () => {
  const t = await getTranslations('FeaturesSection')

  return (
    <section className="bg-gray-100 py-12 md:py-16 lg:py-[72px]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col gap-2.5 mb-10">
          <p className="font-mono text-xs text-gray-600">{t('eyebrow')}</p>
          <h2 className="text-3xl font-semibold text-gray-950">{t('heading')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-lg">{t('body')}</p>
        </div>

        {/* Grid: 2 rows × 3 cols */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featureMeta.map((feat) => {
            const Icon = feat.Icon
            return (
              <div
                key={feat.key}
                className="flex flex-col gap-4 p-7 bg-white border border-gray-200 rounded-lg"
              >
                <div className="w-9 h-9 flex items-center justify-center rounded-md border border-brand">
                  <Icon size={18} className="text-brand" />
                </div>
                <p className="text-lg font-mono font-semibold text-gray-950">{t(`items.${feat.key}.title`)}</p>
                <p className="text-base text-gray-700 leading-relaxed">{t(`items.${feat.key}.body`)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
