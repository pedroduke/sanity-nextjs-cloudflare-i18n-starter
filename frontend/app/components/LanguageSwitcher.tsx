'use client'

import { useEffect, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown, Languages } from 'lucide-react'
import { useRouter, usePathname } from '@/i18n/navigation'
import { routing, type Locale } from '@/i18n/routing'

export type Translations = { locale: string; pathname: string }[]

type Props = {
  translations?: Translations
}

export const LanguageSwitcher = ({ translations }: Props) => {
  const t = useTranslations('LanguageSwitcher')
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function go(target: Locale) {
    setOpen(false)
    if (target === locale) return
    if (translations && translations.length > 0) {
      const match = translations.find((tr) => tr.locale === target)
      if (match) {
        router.push(match.pathname, { locale: target })
        return
      }
      router.push('/posts', { locale: target })
      return
    }
    router.replace(pathname, { locale: target })
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 font-mono text-sm text-gray-700 hover:text-gray-950 transition-colors"
      >
        <Languages size={14} aria-hidden />
        {t(locale)}
        <ChevronDown size={12} aria-hidden />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+8px)] min-w-[160px] bg-white border border-gray-200 rounded shadow-layer py-1 z-50"
        >
          {routing.locales.map((l) => {
            const active = l === locale
            return (
              <li key={l}>
                <button
                  role="option"
                  aria-selected={active}
                  onClick={() => go(l)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 font-mono text-sm transition-colors ${
                    active ? 'text-brand' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-950'
                  }`}
                >
                  <span>{t(l)}</span>
                  {active && <Check size={14} aria-hidden />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
