import Link from 'next/link'
import React from 'react'

import { cn } from '@/utilities/cn'

const btn = (enabled: boolean) =>
  cn(
    'inline-flex h-9 items-center rounded-md border border-border px-4 text-sm transition-colors',
    enabled ? 'hover:bg-muted' : 'pointer-events-none opacity-40',
  )

export const Pagination: React.FC<{
  page: number
  totalPages: number
  category?: string
  className?: string
}> = ({ page, totalPages, category, className }) => {
  if (totalPages <= 1) return null

  // Build hrefs that preserve the active category filter (shareable URLs).
  const hrefFor = (p: number) => {
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (p > 1) params.set('page', String(p))
    const qs = params.toString()
    return qs ? `/products?${qs}` : '/products'
  }

  const hasPrev = page > 1
  const hasNext = page < totalPages

  return (
    <nav className={cn('flex items-center justify-center gap-4', className)} aria-label="Pagination">
      {hasPrev ? (
        <Link href={hrefFor(page - 1)} className={btn(true)} rel="prev">
          Previous
        </Link>
      ) : (
        <span className={btn(false)}>Previous</span>
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      {hasNext ? (
        <Link href={hrefFor(page + 1)} className={btn(true)} rel="next">
          Next
        </Link>
      ) : (
        <span className={btn(false)}>Next</span>
      )}
    </nav>
  )
}

export default Pagination
