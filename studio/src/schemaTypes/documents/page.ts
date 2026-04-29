import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'
import { definePathname } from '@tinloof/sanity-studio'

const PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'
const DEFAULT_LOCALE_ID = 'en'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    definePathname({
      name: 'pathname',
      description: `Pages are single-locale; this URL is rendered under every locale prefix on the frontend.`,
      options: {
        source: 'name',
        // Single-locale doc: prefix with the default locale so the URL preview
        // points at the actual rendered URL on the frontend.
        prefix: `${PREVIEW_URL}/${DEFAULT_LOCALE_ID}`,
        autoNavigate: true,
      },
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [{ type: 'callToAction' }, { type: 'infoSection' }],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: schemaTypeName =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
  ],
})
