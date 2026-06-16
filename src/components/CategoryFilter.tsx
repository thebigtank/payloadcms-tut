import Link from 'next/link'
import React from 'react'

import type { Category } from '@/payload-types'
import { cn } from '@/utilities/cn'

const pill = (active: boolean) =>
  cn(
    'inline-flex items-center rounded-full border px-3 py-1 text-sm transition-colors',
    active
      ? 'border-foreground bg-foreground text-background'
      : 'border-border text-muted-foreground hover:text-foreground',
  )

export const CategoryFilter: React.FC<{ categories: Category[]; active?: string }> = ({
  categories,
  active,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Link href="/products" className={pill(!active)}>
        All
      </Link>
      {categories.map((c) => (
        <Link key={c.id} href={`/products?category=${c.slug}`} className={pill(active === c.slug)}>
          {c.title}
        </Link>
      ))}
    </div>
  )
}

export default CategoryFilter
