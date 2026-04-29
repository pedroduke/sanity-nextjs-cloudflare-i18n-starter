import { DocumentTextIcon } from '@sanity/icons'
import { format, parseISO } from 'date-fns'
import { defineField, defineType } from 'sanity'
import { definePathname } from '@tinloof/sanity-studio'
import type { Post } from '../../../../frontend/sanity.types'

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const DEFAULT_LOCALE_ID = 'en'

export const post = defineType({
  name: 'post',
  title: 'Post',
  icon: DocumentTextIcon,
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'settings', title: 'Settings' },
  ],
  fields: [
    defineField({
      name: 'locale',
      title: 'Language',
      type: 'string',
      group: 'settings',
      readOnly: true,
      initialValue: DEFAULT_LOCALE_ID,
      options: {
        list: [
          { title: '🇬🇧 English', value: 'en' },
          { title: '🇵🇹 Português', value: 'pt' },
          { title: '🇵🇱 Polski', value: 'pl' },
        ],
      },
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: rule => rule.required(),
    }),
    definePathname({
      name: 'pathname',
      group: 'settings',
      description:
        "The URL path for this post. The locale prefix (/en, /pt, /pl) is added automatically based on the post's language. Path must start with /posts/.",
      options: {
        source: (doc: any) => {
          if (!doc?.title) return ''
          const slug = doc.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          return `posts/${slug}`
        },
        i18n: {
          enabled: true,
          defaultLocaleId: DEFAULT_LOCALE_ID,
          localizePathname: ({
            pathname,
            localeId,
          }: {
            pathname: string
            localeId?: string
          }) => `/${localeId || DEFAULT_LOCALE_ID}${pathname}`,
        },
        prefix: (doc: any) => `${PREVIEW_URL}/${doc.locale || DEFAULT_LOCALE_ID}`,
        autoNavigate: true,
      },
      validation: Rule =>
        Rule.custom(slug => {
          if (!slug?.current) return true
          if (!slug.current.startsWith('/posts/')) {
            return 'Path must start with /posts/ prefix.'
          }
          return true
        }),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      group: 'content',
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: rule => {
            return rule.custom((alt, context) => {
              const document = context.document as Post
              if (document?.coverImage?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      group: 'content',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{ type: 'person' }],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      date: 'date',
      media: 'coverImage',
      locale: 'locale',
      pathname: 'pathname',
    },
    prepare({ title, media, authorFirstName, authorLastName, date, locale, pathname }) {
      const path = pathname?.current
        ? `/${locale || DEFAULT_LOCALE_ID}${pathname.current}`
        : ''
      const meta = [
        authorFirstName && authorLastName && `by ${authorFirstName} ${authorLastName}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ]
        .filter(Boolean)
        .join(' ')
      const subtitle = [path, meta].filter(Boolean).join(' · ')

      return { title, media, subtitle }
    },
  },
})
