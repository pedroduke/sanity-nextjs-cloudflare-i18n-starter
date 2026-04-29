'use client'

import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { usePathname, Link } from '@/i18n/navigation'
import { LanguageSwitcher, type Translations } from './LanguageSwitcher'

type Props = {
  translations?: Translations
}

export const Header = ({ translations }: Props) => {
  const t = useTranslations('Header')
  const pathname = usePathname()

  const navItems = [{ label: t('about'), href: '/about' as const }]

  return (
    <header className="fixed inset-0 z-50 bg-gray-50 border-b border-gray-200 h-[72px] flex items-center">
      <div className="container mx-auto w-full flex justify-end md:justify-between items-center">
        <Link href="/" className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-sm bg-brand inline-block" />
          <span className="font-mono text-sm font-semibold text-gray-950">sanity-nextjs-cloudflare-i18n-starter</span>
        </Link>

        <nav className="flex items-center gap-3 md:gap-7">
          <div className="flex items-center gap-3 md:gap-7">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`font-mono text-sm transition-colors ${
                    isActive ? 'text-brand' : 'text-gray-700 hover:text-gray-950'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}

            <LanguageSwitcher translations={translations} />

            <span className="w-px h-5 bg-gray-200" />
          </div>

          <a
            href="https://github.com/pedroduke/sanity-nextjs-cloudflare-i18n-starter"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded px-4 py-2 font-mono text-sm text-gray-950 hover:bg-gray-100 transition-colors"
          >
            <Github size={14} />
            {t('github')}
          </a>

          <a
            className="hidden md:inline-flex"
            href="https://deploy.workers.cloudflare.com/?url=https://github.com/pedroduke/sanity-nextjs-cloudflare-i18n-starter"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://deploy.workers.cloudflare.com/button"
              alt={t('deploy')}
              className="h-8"
            />
          </a>
        </nav>
      </div>
    </header>
  )
}
