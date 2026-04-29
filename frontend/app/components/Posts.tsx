import { Link } from '@/i18n/navigation'

import { sanityFetch } from '@/sanity/lib/live'
import { morePostsQuery, allPostsQuery } from '@/sanity/lib/queries'
import { AllPostsQueryResult, MorePostsQueryResult } from '@/sanity.types'
import { DateComponent } from '@/app/components/Date'
import { Avatar } from '@/app/components/Avatar'
import { dataAttr } from '@/sanity/lib/utils'

const Post = ({ post }: { post: MorePostsQueryResult[number] }) => {
  const { _id, title, pathname, excerpt, date, author } = post

  return (
    <article
      data-sanity={dataAttr({ id: _id, type: 'post', path: 'title' }).toString()}
      key={_id}
      className="relative bg-white border border-gray-200 rounded-lg p-6 flex flex-col gap-4 transition-colors hover:border-gray-300"
    >
      <Link className="absolute inset-0 z-10" href={pathname ?? '#'}>
        <span className="sr-only">Read {title}</span>
      </Link>

      <h3 className="text-lg font-semibold text-gray-950 mb-0 leading-snug">{title}</h3>

      {excerpt && (
        <p className="line-clamp-3 text-sm leading-6 text-gray-700">{excerpt}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-200">
        {author && author.firstName && author.lastName ? (
          <Avatar person={author} small />
        ) : (
          <span />
        )}
        <time className="font-mono text-xs text-gray-600 tabular-nums" dateTime={date}>
          <DateComponent dateString={date} />
        </time>
      </div>
    </article>
  )
}

const Posts = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">{children}</div>
)

export const MorePosts = async ({
  locale,
  skip,
  limit,
}: {
  locale: string
  skip: string
  limit: number
}) => {
  const { data } = await sanityFetch({
    query: morePostsQuery,
    params: { locale, skip, limit },
  })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts>
      {data.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}

export const AllPosts = async ({ locale }: { locale: string }) => {
  const { data } = await sanityFetch({ query: allPostsQuery, params: { locale } })

  if (!data || data.length === 0) {
    return null
  }

  return (
    <Posts>
      {data.map((post: AllPostsQueryResult[number]) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  )
}
