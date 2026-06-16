'use client'

import React from 'react'

import type { Product } from '@/payload-types'
import { cn } from '@/utilities/cn'

/**
 * Placeholder for Phase 3 — renders the button and disables it for out-of-stock
 * products. The actual add-to-cart behaviour (persistent client cart) is wired
 * in Phase 5; intentionally a no-op for now.
 */
export const AddToCartButton: React.FC<{ product: Product; className?: string }> = ({
  product,
  className,
}) => {
  const outOfStock = product.inventoryStatus === 'out-of-stock'

  return (
    <button
      type="button"
      disabled={outOfStock}
      className={cn(
        'inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition-opacity',
        outOfStock
          ? 'cursor-not-allowed bg-muted text-muted-foreground'
          : 'bg-accent text-accent-foreground hover:opacity-90',
        className,
      )}
    >
      {outOfStock ? 'Out of stock' : 'Add to cart'}
    </button>
  )
}

export default AddToCartButton
