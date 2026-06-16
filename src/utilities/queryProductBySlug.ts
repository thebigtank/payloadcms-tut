import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

export const queryProductBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
    pagination: false,
  })
  return result.docs[0] ?? null
})
