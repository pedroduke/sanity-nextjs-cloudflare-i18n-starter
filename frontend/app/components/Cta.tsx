import { PortableTextBlock } from 'next-sanity'

import { ResolvedLink } from '@/app/components/ResolvedLink'
import { CustomPortableText } from '@/app/components/PortableText'
import { SanityImage } from '@/app/components/SanityImage'
import { stegaClean } from '@sanity/client/stega'
import { ExtractPageBuilderType } from '@/sanity/lib/types'

type CtaProps = {
  block: ExtractPageBuilderType<'callToAction'>
  index: number
  pageType: string
  pageId: string
}

export const CTA = ({ block }: CtaProps) => {
  const { heading, eyebrow, body = [], button, image, theme, contentAlignment } = block

  const isDark = theme === 'dark'
  const isImageFirst = stegaClean(contentAlignment) === 'imageFirst'

  const sectionClass = isDark
    ? 'bg-gray-950 text-gray-50'
    : 'bg-gray-50 border-t border-b border-gray-200'
  const eyebrowClass = isDark ? 'text-gray-400' : 'text-gray-600'
  const headingClass = isDark ? 'text-gray-50' : 'text-gray-950'

  return (
    <section className={`relative ${sectionClass}`}>
      <div className="container py-10 md:py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div
            className={`${
              isImageFirst && image ? 'row-start-2 lg:row-start-1 lg:col-start-2' : ''
            } flex flex-col gap-3`}
          >
            {eyebrow && (
              <span className={`font-mono text-sm tracking-tight opacity-70 ${eyebrowClass}`}>
                // {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className={`text-2xl md:text-3xl lg:text-4xl font-semibold ${headingClass}`}>
                {heading}
              </h2>
            )}
            {body && (
              <CustomPortableText
                value={body as PortableTextBlock[]}
                className={isDark ? 'prose-invert' : ''}
              />
            )}

            {button?.buttonText && button?.link && (
              <div className="flex mt-4">
                <ResolvedLink
                  link={button.link}
                  className="inline-flex items-center gap-2 bg-brand text-white font-mono text-sm font-semibold rounded px-5 py-3 hover:bg-brand/90 transition-colors"
                >
                  {button.buttonText}
                </ResolvedLink>
              </div>
            )}
          </div>

          {image?.asset?._ref && (
            <SanityImage
              id={image.asset._ref}
              alt="Demo image"
              width={704}
              crop={image.crop}
              mode="cover"
              className="rounded-md"
            />
          )}
        </div>
      </div>
    </section>
  )
}
