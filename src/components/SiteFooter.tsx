import { Facebook, Globe, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Container } from '@/components/Container'
import { getSiteSettings } from '@/utilities/getSiteSettings'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  facebook: Facebook,
  instagram: Instagram,
  x: Twitter,
  linkedin: Linkedin,
  youtube: Youtube,
}

export const SiteFooter = async () => {
  const settings = await getSiteSettings()
  const footerLinks = settings?.footerLinks ?? []
  const social = settings?.socialLinks ?? []
  const address = settings?.storeAddress

  return (
    <footer className="mt-auto border-t border-border bg-card text-card-foreground">
      <Container className="flex flex-col gap-8 py-12 md:flex-row md:justify-between">
        <div>
          <p className="text-lg font-semibold">The Shop</p>
          {address && (
            <p className="mt-3 whitespace-pre-line text-sm text-muted-foreground">{address}</p>
          )}
        </div>
        <div className="flex flex-col gap-6 md:items-end">
          {footerLinks.length > 0 && (
            <nav className="flex flex-wrap gap-4">
              {footerLinks.map((item, i) => (
                <Link
                  key={item.id ?? i}
                  href={item.url}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}
          {social.length > 0 && (
            <div className="flex gap-3">
              {social.map((s, i) => {
                const Icon = iconMap[s.platform] ?? Globe
                return (
                  <a
                    key={s.id ?? i}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.platform}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          )}
        </div>
      </Container>
    </footer>
  )
}

export default SiteFooter
