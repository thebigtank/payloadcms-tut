import NextImage from 'next/image'
import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { cn } from '@/utilities/cn'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type Props = {
  resource?: MediaType | number | null
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
  fill?: boolean
}

/**
 * Renders a Payload upload (Media doc) with next/image. The `resource` is the
 * populated relationship value; a bare id (number) renders nothing.
 */
export const Media: React.FC<Props> = ({
  resource,
  className,
  imgClassName,
  priority,
  sizes,
  fill,
}) => {
  if (!resource || typeof resource !== 'object') return null

  const { url, alt, width, height, updatedAt } = resource
  const src = getMediaUrl(url, updatedAt)
  if (!src) return null

  // No <picture> wrapper: a fill image must position against the caller's own
  // positioned container, so we render the <img> directly into it.
  return (
    <NextImage
      src={src}
      alt={alt || ''}
      {...(fill ? { fill: true } : { width: width || 800, height: height || 800 })}
      sizes={sizes || '100vw'}
      priority={priority}
      className={cn(className, imgClassName)}
    />
  )
}

export default Media
