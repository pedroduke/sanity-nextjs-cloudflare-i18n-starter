import { Suspense } from 'react'
import { ArrowRight } from 'lucide-react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { AllPosts } from './Posts'

type Props = { locale: string }

export const PostsSection = async ({ locale }: Props) => {
  const t = await getTranslations('PostsSection')
  return (
    <section className="bg-gray-50 py-12 md:py-16 lg:py-[72px]">
      <div className="container">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end mb-10">
          <div className="flex flex-col gap-2.5">
            <p className="font-mono text-xs text-gray-600">{t('eyebrow')}</p>
            <h2 className="text-3xl font-semibold text-gray-950">{t('title')}</h2>
            <p className="text-lg text-gray-700 leading-relaxed max-w-lg">{t('body')}</p>
          </div>
          <Link
            href="/posts"
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 rounded px-4 py-2 font-mono text-sm text-gray-950 hover:bg-gray-100 transition-colors w-fit"
          >
            {t('allPosts')}
            <ArrowRight size={13} />
          </Link>
        </div>

        <Suspense>{await AllPosts({ locale })}</Suspense>
      </div>
    </section>
  )
}
