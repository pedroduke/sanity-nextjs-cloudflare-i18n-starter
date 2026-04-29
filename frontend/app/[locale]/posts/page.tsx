import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Header } from '@/app/components/Header'
import { AllPosts } from '@/app/components/Posts'
import { sanityFetch } from '@/sanity/lib/live'
import { allPostsQuery } from '@/sanity/lib/queries'
import { routing } from '@/i18n/routing'

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: t('postsTitle'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/posts`])),
    },
  }
}

type Props = { params: Promise<{ locale: string }> }

export default async function PostsListingPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('PostsListing')

  const { data: posts } = await sanityFetch({ query: allPostsQuery, params: { locale } })
  const isEmpty = !posts || posts.length === 0

  return (
    <>
      <Header />
      <section className="bg-gray-50 py-12 md:py-16 lg:py-[72px]">
        <div className="container">
          <div className="flex flex-col gap-2.5 mb-10">
            <p className="font-mono text-xs text-gray-600">{t('eyebrow')}</p>
            <h1 className="text-4xl font-bold text-gray-950">{t('title')}</h1>
          </div>
          {isEmpty ? (
            <p className="text-base text-gray-700">{t('empty')}</p>
          ) : (
            <AllPosts locale={locale} />
          )}
        </div>
      </section>
    </>
  )
}
