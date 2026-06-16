import Link from 'next/link'
import React from 'react'

import { InventoryBadge } from '@/components/InventoryBadge'
import { Media } from '@/components/Media'
import type { Product } from '@/payload-types'

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Media
          resource={product.image}
          fill
          imgClassName="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <h3 className="mt-3 text-sm font-medium group-hover:underline">{product.title}</h3>
      <p className="text-sm text-muted-foreground">{product.authorOrBrand}</p>
      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="text-sm font-semibold">{formatPrice(product.price)}</p>
        <InventoryBadge status={product.inventoryStatus} />
      </div>
    </Link>
  )
}

export default ProductCard
