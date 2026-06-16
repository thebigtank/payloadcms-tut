import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { Container } from '@/components/Container'
import { Media } from '@/components/Media'
import { ProductCard } from '@/components/ProductCard'
import RichText from '@/components/RichText'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'

export default async function HomePage() {
  const page = await queryPageBySlug('home')

  const payload = await getPayload({ config: configPromise })
  const featured = await payload.find({ collection: 'products', limit: 4, depth: 1 })

  return (
    <>
      <section className="py-16">
        <Container>
          {page?.heroImage && typeof page.heroImage === 'object' && (
            <div className="relative mb-10 aspect-[16/7] overflow-hidden rounded-lg bg-muted">
              <Media resource={page.heroImage} fill imgClassName="object-cover" priority sizes="100vw" />
            </div>
          )}
          {page?.body && <RichText data={page.body} />}
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
            <h2 className="text-xl font-semibold tracking-tight">Featured</h2>
            <span className="text-sm text-muted-foreground">Hand-picked titles</span>
          </div>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {featured.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Container>
      </section>
    </>
  )
}
