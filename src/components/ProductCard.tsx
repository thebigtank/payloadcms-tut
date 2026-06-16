import React from 'react'

import { Media } from '@/components/Media'
import type { Product } from '@/payload-types'

const formatPrice = (n: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n)

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  // TODO Phase 3: link the card to /products/[slug] (PDP route doesn't exist yet).
  return (
    <div className="flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
        <Media
          resource={product.image}
          fill
          imgClassName="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <h3 className="mt-3 text-sm font-medium">{product.title}</h3>
      <p className="text-sm text-muted-foreground">{product.authorOrBrand}</p>
      <p className="mt-1 text-sm font-semibold">{formatPrice(product.price)}</p>
    </div>
  )
}

export default ProductCard
