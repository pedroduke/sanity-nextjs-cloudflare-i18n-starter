/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './src/schemaTypes'
import { structure } from './src/structure'
import { unsplashImageAsset } from 'sanity-plugin-asset-source-unsplash'
import { assist } from '@sanity/assist'
import { pages } from '@tinloof/sanity-studio'
import { documentI18n } from '@tinloof/sanity-document-i18n'
import { withExtends } from '@tinloof/sanity-extends'
import { defineDocuments, defineLocations } from 'sanity/presentation'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

// i18n configuration. Mirrors `frontend/i18n/routing.ts` — keep in sync when adding a locale.
const i18n = {
  locales: [
    { id: 'en', title: '🇬🇧 English' },
    { id: 'pt', title: '🇵🇹 Português' },
    { id: 'pl', title: '🇵🇱 Polski' },
  ],
  defaultLocaleId: 'en',
}

// Tells the Pages tool, definePathname's URL preview, and Presentation
// how to turn a stored pathname (`/posts/foo`) into the actual frontend URL
// (`/en/posts/foo`). Always-prefix mode: every locale gets a prefix.
const localizePathname = ({
  pathname,
  localeId,
}: {
  pathname: string
  localeId?: string
  isDefault?: boolean
  fallbackLocaleId?: string
}) => `/${localeId || i18n.defaultLocaleId}${pathname}`

// Configure how documents map to frontend routes for Presentation tool
const locations = {
  page: defineLocations({
    select: { title: 'name', pathname: 'pathname.current' },
    resolve: (doc: any) => {
      if (!doc || !doc.pathname) return { locations: [] }
      // page documents are single-locale; available under every locale prefix
      return {
        locations: i18n.locales.map((l) => ({
          title: `${doc.title || 'Untitled'} (${l.id.toUpperCase()})`,
          href: `/${l.id}${doc.pathname}`,
        })),
      }
    },
  }),
  post: defineLocations({
    select: { title: 'title', pathname: 'pathname.current', locale: 'locale' },
    resolve: (doc: any) => {
      if (!doc || !doc.pathname) return { locations: [] }
      const locale = doc.locale || i18n.defaultLocaleId
      return {
        locations: [{ title: doc.title || 'Untitled', href: `/${locale}${doc.pathname}` }],
      }
    },
  }),
}

// Configure which documents should open by default when navigating to a URL
const mainDocuments = defineDocuments([
  {
    route: '/:locale/:slug',
    filter: `_type == "page" && pathname.current == "/" + $slug`,
  },
  {
    route: '/:locale/posts/:slug',
    filter: `_type == "post" && locale == $locale && pathname.current == "/posts/" + $slug`,
  },
])

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Sanity + Next.js + Cloudflare + i18n Starter',

  projectId,
  dataset,

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: withExtends(schemaTypes),
  },

  plugins: [
    documentI18n({
      locales: i18n.locales
    }),
    // Presentation tool configuration for Visual Editing
    pages({
      resolve: { locations, mainDocuments },
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      allowOrigins: [],
      i18n: {
        locales: i18n.locales,
        defaultLocaleId: i18n.defaultLocaleId,
        localizePathname,
      },
      creatablePages: [
        { title: 'Post', type: 'post' },
        { title: 'Page', type: 'page' },
      ],
      folders: {
        '/': {
          title: 'Home',
        },
        '/posts': {
          title: 'Posts',
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure.ts
    }),
    // Additional plugins for enhanced functionality
    unsplashImageAsset(),
    assist(),
    visionTool(),
  ],
})
