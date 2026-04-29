import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { PortableTextBlock } from 'next-sanity'

import { Header } from '@/app/components/Header'
import { sanityFetch } from '@/sanity/lib/live'
import { postQuery, postPathnames } from '@/sanity/lib/queries'
import { CustomPortableText } from '@/app/components/PortableText'
import { Avatar } from '@/app/components/Avatar'
import { SanityImage } from '@/app/components/SanityImage'
import { routing, type Locale } from '@/i18n/routing'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: postPathnames,
    perspective: 'published',
    stega: false,
  })
  return (data ?? [])
    .filter((p) => p.locale && p.slug)
    .map((p) => ({ locale: p.locale as string, slug: p.slug as string }))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const pathname = `/posts/${params.slug}`
  const { data: post } = await sanityFetch({
    query: postQuery,
    params: { pathname, locale: params.locale },
    stega: false,
  })

  if (!post) return { title: undefined }

  // Plugin's translation.metadata isn't in the static schema; cast.
  const rawTranslations = (post.translations ?? []) as RawTranslation[] | null
  const languages: Record<string, string> = {
    [params.locale]: `/${params.locale}/posts/${params.slug}`,
  }
  for (const tr of rawTranslations ?? []) {
    if (tr?.locale && tr?.pathname && (routing.locales as readonly string[]).includes(tr.locale)) {
      languages[tr.locale] = `/${tr.locale}${tr.pathname}`
    }
  }

  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { languages },
  }
}

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value)
}

type RawTranslation = { locale: string | null; pathname: string | null }

export default async function PostPage(props: Props) {
  const params = await props.params
  setRequestLocale(params.locale)
  const t = await getTranslations('Post')

  const pathname = `/posts/${params.slug}`
  const { data: post } = await sanityFetch({
    query: postQuery,
    params: { pathname, locale: params.locale },
  })

  if (!post?._id) {
    return notFound()
  }

  // Plugin's translation.metadata document type isn't in the static schema, so typegen
  // narrows post.translations to null. Cast to access the actual runtime shape.
  const rawTranslations = (post.translations ?? []) as RawTranslation[] | null
  const translations = (rawTranslations ?? [])
    .filter((tr): tr is { locale: string; pathname: string } => !!tr?.locale && !!tr?.pathname)
    .filter((tr) => isLocale(tr.locale))

  return (
    <>
      <Header translations={translations} />
      <div className="my-12 lg:my-24">
        <article className="max-w-4xl mx-auto px-6">
          <header className="mb-8">
            <p className="font-mono text-xs text-gray-600 mb-4">
              <a href={`/${params.locale}/posts`} className="hover:text-gray-950 transition-colors">{t('backToList')}</a>
            </p>
            <h1 className="text-4xl font-bold text-gray-950 mb-4">{post.title}</h1>
            {post.excerpt && <p className="text-xl text-gray-700 mb-6">{post.excerpt}</p>}
            {post.author && (
              <div className="flex items-center mb-6">
                <Avatar person={post.author} date={post.date} />
              </div>
            )}
          </header>

          {post.coverImage?.asset?._ref && (
            <div className="mb-8">
              <SanityImage
                id={post.coverImage.asset._ref}
                alt={post.coverImage.alt || post.title || ''}
                width={1200}
                height={600}
                crop={post.coverImage.crop}
                hotspot={post.coverImage.hotspot}
                mode="cover"
                className="w-full rounded-lg"
              />
            </div>
          )}

          {post.content && post.content.length > 0 && (
            <div className="prose prose-lg max-w-none">
              <CustomPortableText value={post.content as PortableTextBlock[]} />
            </div>
          )}
        </article>
      </div>
    </>
  )
}
