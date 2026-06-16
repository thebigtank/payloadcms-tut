import Link from 'next/link'
import React from 'react'

import { Container } from '@/components/Container'

export default function NotFound() {
  return (
    <Container className="flex flex-1 flex-col items-center justify-center py-32 text-center">
      <p className="text-sm font-medium text-accent">404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Page not found</h1>
      <p className="mt-3 max-w-md text-muted-foreground">
        The page you&rsquo;re looking for doesn&rsquo;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
      >
        Back to home
      </Link>
    </Container>
  )
}
