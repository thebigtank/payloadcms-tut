import React from 'react'

import { cn } from '@/utilities/cn'

export const Container: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <div className={cn('container', className)}>{children}</div>
}

export default Container
