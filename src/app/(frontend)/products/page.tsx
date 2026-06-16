import configPromise from '@payload-config'
import type { Metadata } from 'next'
import { getPayload, type Where } from 'payload'
import React from 'react'

import { CategoryFilter } from '@/components/CategoryFilter'
import { Container } from '@/components/Container'
import { Pagination } from '@/components/Pagination'
import { ProductCard } from '@/components/ProductCard'

export const metadata: Metadata = { title: 'Shop' }

const PER_PAGE = 6

type Args = { searchParams: Promise<{ category?: string; page?: string }> }

export default async function ProductsPage({ searchParams }: Args) {
  const { category, page: pageParam } = await searchParams
  const page = Math.max(1, Number.parseInt(pageParam ?? '1', 10) || 1)

  const payload = await getPayload({ config: configPromise })

  // Filtering by a relationship's subfield (PRD-specified pattern).
  const where: Where = category ? { 'category.slug': { equals: category } } : {}

  const [products, categories] = await Promise.all([
    payload.find({ collection: 'products', depth: 1, limit: PER_PAGE, page, sort: 'title', where }),
    payload.find({ collection: 'categories', limit: 100, sort: 'title', pagination: false }),
  ])

  return (
    <section className="py-12">
      <Container>
        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {products.totalDocs} {products.totalDocs === 1 ? 'product' : 'products'}
            {category ? ' in this category' : ''}
          </p>
        </header>

        <div className="mb-8">
          <CategoryFilter categories={categories.docs} active={category} />
        </div>

        {products.docs.length === 0 ? (
          <p className="py-16 text-center text-muted-foreground">No products found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {products.docs.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        <Pagination
          page={products.page ?? 1}
          totalPages={products.totalPages}
          category={category}
          className="mt-12"
        />
      </Container>
    </section>
  )
}
