import React from 'react'

import { cn } from '@/utilities/cn'

const config: Record<string, { label: string; text: string; dot: string }> = {
  'in-stock': {
    label: 'In stock',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
  },
  'low-stock': {
    label: 'Low stock',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-500',
  },
  'out-of-stock': {
    label: 'Out of stock',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
}

export const InventoryBadge: React.FC<{ status: string; className?: string }> = ({
  status,
  className,
}) => {
  const c = config[status] ?? config['in-stock']
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', c.text, className)}>
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} aria-hidden />
      {c.label}
    </span>
  )
}

export default InventoryBadge
