/**
 * Formats a Payload media resource URL, optionally appending a cache-busting tag.
 * Local paths (e.g. `/api/media/file/image.png`) are kept relative so Next.js
 * image optimization treats them as local.
 */
export const getMediaUrl = (url: string | null | undefined, cacheTag?: string | null): string => {
  if (!url) return ''

  if (cacheTag && cacheTag !== '') {
    cacheTag = encodeURIComponent(cacheTag)
  }

  return cacheTag ? `${url}?${cacheTag}` : url
}
