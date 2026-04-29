import { Languages } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

type StepKey = '01' | '02' | '03' | '04'

type StepMeta = {
  key: StepKey
  chip: 'mono' | 'i18n' | 'dark'
}

const stepMeta: StepMeta[] = [
  { key: '01', chip: 'mono' },
  { key: '02', chip: 'i18n' },
  { key: '03', chip: 'mono' },
  { key: '04', chip: 'dark' },
]

const Chip = ({ kind, text }: { kind: StepMeta['chip']; text: string }) => {
  if (kind === 'mono') {
    return (
      <div className="bg-gray-100 rounded px-3.5 py-2.5">
        <span className="text-brand font-mono text-sm font-semibold mr-2">~</span>
        <span className="font-mono text-sm text-gray-700">{text}</span>
      </div>
    )
  }
  if (kind === 'i18n') {
    return (
      <div className="flex items-center gap-2 bg-gray-100 rounded px-3.5 py-2.5">
        <Languages size={12} className="text-brand mr-2" />
        <span className="font-mono text-sm text-gray-700">{text}</span>
      </div>
    )
  }
  // dark
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded px-3.5 py-2.5">
      <span className="text-brand font-mono text-sm font-semibold mr-2">~</span>
      <span className="font-mono text-sm text-brand">{text}</span>
    </div>
  )
}

export const ArchSection = async () => {
  const t = await getTranslations('ArchSection')

  return (
    <section className="bg-gray-50 py-12 md:py-16 lg:py-[72px]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col gap-2.5 mb-12">
          <p className="font-mono text-xs text-gray-600">{t('eyebrow')}</p>
          <h2 className="text-3xl font-semibold text-gray-950">{t('heading')}</h2>
          <p className="text-lg text-gray-700 leading-relaxed max-w-lg">{t('body')}</p>
        </div>

        {/* Steps card */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {stepMeta.map((step, i) => {
              const leftCol = i % 2 === 0
              const topRow = i < 2
              return (
                <div
                  key={step.key}
                  className={`flex flex-col gap-3.5 p-7 max-md:not-last:border-b max-md:not-last:border-gray-200 ${leftCol ? 'md:border-r md:border-gray-200' : ''} ${topRow ? 'md:border-b md:border-gray-200' : ''}`}
                >
                  <span className="font-mono text-sm font-semibold text-brand">{step.key}</span>
                  <h3 className="text-lg font-semibold text-gray-950">{t(`steps.${step.key}.title`)}</h3>
                  <p className="text-base text-gray-700 leading-relaxed flex-1">{t(`steps.${step.key}.body`)}</p>
                  <div className="mt-auto pt-2">
                    <Chip kind={step.chip} text={t(`steps.${step.key}.command`)} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
