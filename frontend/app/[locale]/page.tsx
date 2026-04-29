import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

import { TechQuartet } from '@/app/components/TechQuartet'
import { ArchSection } from '@/app/components/ArchSection'
import { FeaturesSection } from '@/app/components/FeaturesSection'
import { HeroSection } from '@/app/components/HeroSection'
import { PostsSection } from '@/app/components/PostsSection'
import { Header } from '@/app/components/Header'
import { routing } from '@/i18n/routing'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'Metadata' })
  return {
    title: t('homeTitle'),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}`])),
    },
  }
}

type Props = { params: Promise<{ locale: string }> }

export default async function Page({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return (
    <>
      <Header />
      <HeroSection />
      <TechQuartet />
      <ArchSection />
      <FeaturesSection />
      <PostsSection locale={locale} />
    </>
  )
}
