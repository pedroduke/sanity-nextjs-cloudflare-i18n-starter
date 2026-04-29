import type { Metadata } from 'next'

import { PageBuilder } from '@/app/components/PageBuilder'
import { Header } from '@/app/components/Header'
import { sanityFetch } from '@/sanity/lib/live'
import { getPageQuery, pagesPathnames } from '@/sanity/lib/queries'
import { GetPageQueryResult } from '@/sanity.types'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string; path: string[] }>
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pagesPathnames,
    perspective: 'published',
    stega: false,
  })
  // page is single-locale: emit the same paths under every locale prefix
  return routing.locales.flatMap((locale) =>
    (data ?? []).map((p) => ({ locale, path: p.path }))
  )
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const pathname = '/' + params.path.join('/')
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { pathname },
    stega: false,
  })

  return {
    title: page?.name,
    description: page?.heading,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}${pathname}`])),
    },
  } satisfies Metadata
}

export default async function Page(props: Props) {
  const params = await props.params
  const pathname = '/' + params.path.join('/')
  const { data: page } = await sanityFetch({ query: getPageQuery, params: { pathname } })

  if (!page?._id) {
    return notFound()
  }

  return (
    <>
      <Header />
      <div className="my-12 lg:my-24">
        <PageBuilder page={page as GetPageQueryResult} />
      </div>
    </>
  )
}
