import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

/**
 * Fetch the site-settings global via the Local API. React `cache` dedupes the
 * call within a single render; it re-queries on every request, so admin edits
 * appear on the next refresh (no stale cross-request caching in Phase 2).
 */
export const getSiteSettings = cache(async () => {
  const payload = await getPayload({ config: configPromise })
  return payload.findGlobal({ slug: 'site-settings', depth: 1 })
})
