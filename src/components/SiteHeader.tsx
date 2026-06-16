import Link from 'next/link'
import React from 'react'

import { Container } from '@/components/Container'
import { ThemeToggle } from '@/components/ThemeToggle'
import { getSiteSettings } from '@/utilities/getSiteSettings'

export const SiteHeader = async () => {
  const settings = await getSiteSettings()
  const navLinks = settings?.headerNavLinks ?? []

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          The Shop
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          {navLinks.map((item, i) => (
            <Link
              key={item.id ?? i}
              href={item.url}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  )
}

export default SiteHeader
