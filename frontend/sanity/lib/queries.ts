import { defineQuery } from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  locale,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "pathname": pathname.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->pathname.current,
    "post": post->pathname.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

export const getPageQuery = defineQuery(`
  *[_type == 'page' && pathname.current == $pathname][0]{
    _id,
    _type,
    name,
    pathname,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ...,
        button {
          ...,
          ${linkFields}
        }
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`)

// translation.metadata is the document type used by @tinloof/sanity-document-i18n@^2 to
// link translation siblings. Each translation reference appears in `translations[]`
// with shape { _type: "internationalizedArrayReferenceValue", value: Reference }.
export const allPostsQuery = defineQuery(`
  *[_type == "post" && locale == $locale && defined(pathname.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && locale == $locale && _id != $skip && defined(pathname.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && locale == $locale && pathname.current == $pathname][0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    ${postFields}
    "translations": *[_type == "translation.metadata" && references(^._id)][0]{
      "list": translations[]{ "locale": value->locale, "pathname": value->pathname.current }
    }.list
  }
`)

export const postPathnames = defineQuery(`
  *[_type == "post" && defined(pathname.current)] {
    locale,
    "pathname": pathname.current,
    "slug": string::split(pathname.current, "/")[-1]
  }
`)

export const pagesPathnames = defineQuery(`
  *[_type == "page" && defined(pathname.current)]
  { "path": string::split(pathname.current, "/")[@ != ""] }
`)

export const sitemapData = defineQuery(`
  {
    "pages": *[_type == "page" && defined(pathname.current)] {
      _type, "pathname": pathname.current, _updatedAt
    },
    "posts": *[_type == "post" && defined(pathname.current)] {
      _type, locale, "pathname": pathname.current, _updatedAt,
      "translations": *[_type == "translation.metadata" && references(^._id)][0]
        .translations[]{ "locale": value->locale, "pathname": value->pathname.current }
    }
  }
`)
