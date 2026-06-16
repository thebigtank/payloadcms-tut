import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { AddToCartButton } from '@/components/AddToCartButton'
import { Container } from '@/components/Container'
import { InventoryBadge } from '@/components/InventoryBadge'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { queryProductBySlug } from '@/utilities/queryProductBySlug'

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

type Args = { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await queryProductBySlug(decodeURIComponent(slug))
  if (!product) notFound()

  return (
    <section className="py-12">
      <Container>
        <Link
          href="/products"
          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          &larr; Back to shop
        </Link>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            <Media
              resource={product.image}
              fill
              imgClassName="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          <div>
            <p className="text-sm text-muted-foreground">{product.authorOrBrand}</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.title}</h1>
            <p className="mt-4 text-2xl font-semibold">{formatPrice(product.price)}</p>
            <div className="mt-3">
              <InventoryBadge status={product.inventoryStatus} />
            </div>

            {product.description && (
              <div className="mt-6">
                <RichText data={product.description} />
              </div>
            )}

            <div className="mt-8">
              <AddToCartButton product={product} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await queryProductBySlug(decodeURIComponent(slug))
  if (!product) return {}
  return { title: product.title }
}
