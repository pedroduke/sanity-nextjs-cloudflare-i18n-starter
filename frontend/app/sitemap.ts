import type { MetadataRoute } from 'next'
import { headers } from 'next/headers'
import { sanityFetch } from '@/sanity/lib/live'
import { sitemapData } from '@/sanity/lib/queries'
import { routing, type Locale } from '@/i18n/routing'

const STATIC_PATHS = ['', '/about', '/posts'] as const

function altsForPath(domain: string, path: string): Record<string, string> {
  return Object.fromEntries(routing.locales.map((l) => [l, `${domain}/${l}${path}`]))
}

function isLocale(value: string | null | undefined): value is Locale {
  return !!value && (routing.locales as readonly string[]).includes(value)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const protocol = host.startsWith('localhost') ? 'http' : 'https'
  const domain = `${protocol}://${host}`

  const { data } = await sanityFetch({
    query: sitemapData,
    perspective: 'published',
    stega: false,
  })

  const now = new Date()

  const staticEntries: MetadataRoute.Sitemap = routing.locales.flatMap((locale) =>
    STATIC_PATHS.map((path) => ({
      url: `${domain}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '' ? 1.0 : 0.8,
      alternates: { languages: altsForPath(domain, path) },
    }))
  )

  const pages = data?.pages ?? []
  const pageEntries: MetadataRoute.Sitemap = pages.flatMap((page) =>
    routing.locales.map((locale) => ({
      url: `${domain}/${locale}${page.pathname ?? ''}`,
      lastModified: page._updatedAt ? new Date(page._updatedAt) : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${domain}/${l}${page.pathname ?? ''}`])
        ),
      },
    }))
  )

  // Plugin's translation.metadata document type isn't part of the static schema, so
  // typegen narrows post.translations to null. The GROQ result is a real array at
  // runtime — we cast to access it.
  type RawPost = {
    _type: 'post'
    locale: string | null
    pathname: string
    _updatedAt: string
    translations: { locale: string | null; pathname: string | null }[] | null
  }
  const posts: RawPost[] = (data?.posts ?? []) as RawPost[]

  const postEntries: MetadataRoute.Sitemap = posts
    .filter((post) => isLocale(post.locale) && post.pathname)
    .map((post) => {
      const ownLocale = post.locale as Locale
      const ownPathname = post.pathname as string
      const siblings = (post.translations ?? [])
        .filter((tr): tr is { locale: string; pathname: string } => !!tr?.locale && !!tr?.pathname)
        .filter((tr) => isLocale(tr.locale))
      const allTranslations = [
        { locale: ownLocale, pathname: ownPathname },
        ...siblings.map((tr) => ({ locale: tr.locale as Locale, pathname: tr.pathname })),
      ]
      const languages = Object.fromEntries(
        allTranslations.map((tr) => [tr.locale, `${domain}/${tr.locale}${tr.pathname}`])
      )
      return {
        url: `${domain}/${ownLocale}${ownPathname}`,
        lastModified: post._updatedAt ? new Date(post._updatedAt) : now,
        changeFrequency: 'never' as const,
        priority: 0.5,
        alternates: { languages },
      }
    })

  return [...staticEntries, ...pageEntries, ...postEntries]
}
