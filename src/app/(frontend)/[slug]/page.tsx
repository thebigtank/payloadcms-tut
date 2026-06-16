import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import React from 'react'

import { Container } from '@/components/Container'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { queryPageBySlug } from '@/utilities/queryPageBySlug'

type Args = { params: Promise<{ slug: string }> }

export default async function DynamicPage({ params }: Args) {
  const { slug } = await params
  const decoded = decodeURIComponent(slug)

  // The home page content lives at `/`, not `/home`.
  if (decoded === 'home') redirect('/')

  const page = await queryPageBySlug(decoded)
  if (!page) notFound()

  return (
    <article className="py-16">
      <Container>
        {page.heroImage && typeof page.heroImage === 'object' && (
          <div className="relative mb-10 aspect-[16/7] overflow-hidden rounded-lg bg-muted">
            <Media resource={page.heroImage} fill imgClassName="object-cover" priority sizes="100vw" />
          </div>
        )}
        <h1 className="mb-6 text-4xl font-semibold tracking-tight">{page.title}</h1>
        {page.body && <RichText data={page.body} />}
      </Container>
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const page = await queryPageBySlug(decodeURIComponent(slug))
  if (!page) return {}
  return { title: page.title }
}
