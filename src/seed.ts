/**
 * Repeatable seed script for the PRD data layer.
 *
 * Run with:  pnpm payload run src/seed.ts
 *
 * It generates placeholder images with sharp (no network), wipes the PRD
 * collections so re-runs don't duplicate, then seeds an admin user,
 * categories, products, pages, and the site-settings global.
 */
import { getPayload } from 'payload'
import sharp from 'sharp'

import config from './payload.config'

// --- Minimal Lexical (richText) helpers -------------------------------------
// The Local API expects richText values as a Lexical editor state. These build
// just enough node shapes (paragraph, heading, bullet list) to exercise the
// official converter on the frontend in Phase 2.
type LexNode = Record<string, unknown>

const textNode = (text: string): LexNode => ({
  type: 'text',
  text,
  version: 1,
  format: 0,
  style: '',
  mode: 'normal',
  detail: 0,
})

const paragraph = (text: string): LexNode => ({
  type: 'paragraph',
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  textFormat: 0,
  children: [textNode(text)],
})

const heading = (tag: 'h2' | 'h3' | 'h4', text: string): LexNode => ({
  type: 'heading',
  tag,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: [textNode(text)],
})

const bulletList = (items: string[]): LexNode => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  version: 1,
  format: '',
  indent: 0,
  direction: 'ltr',
  children: items.map((item, i) => ({
    type: 'listitem',
    value: i + 1,
    version: 1,
    format: '',
    indent: 0,
    direction: 'ltr',
    children: [textNode(item)],
  })),
})

// Wrap nodes in a Lexical root. Cast at call sites since the generated richText
// type is intentionally loose.
const richText = (children: LexNode[]) => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children,
  },
})

// Generate a solid-color PNG buffer (offline placeholder image).
const makeImage = (r: number, g: number, b: number) =>
  sharp({ create: { width: 800, height: 800, channels: 3, background: { r, g, b } } })
    .png()
    .toBuffer()

const run = async () => {
  const payload = await getPayload({ config })

  payload.logger.info('Seeding: clearing existing PRD data…')

  // Delete in dependency order (products reference categories + media).
  for (const collection of ['products', 'pages', 'categories', 'media'] as const) {
    await payload.delete({ collection, where: {} })
  }

  // --- Admin user (create only if none exists) ------------------------------
  const existingUsers = await payload.count({ collection: 'users' })
  if (existingUsers.totalDocs === 0) {
    await payload.create({
      collection: 'users',
      data: { name: 'Admin', email: 'admin@example.com', password: 'Password123!' },
    })
    payload.logger.info('Created admin user admin@example.com / Password123!')
  }

  // --- Media ----------------------------------------------------------------
  const palette: Array<[number, number, number]> = [
    [37, 99, 235],
    [16, 185, 129],
    [244, 114, 182],
    [251, 146, 60],
    [139, 92, 246],
    [14, 165, 233],
    [234, 179, 8],
    [239, 68, 68],
  ]
  const mediaIds: number[] = []
  for (let i = 0; i < palette.length; i++) {
    const [r, g, b] = palette[i]
    const buffer = await makeImage(r, g, b)
    const media = await payload.create({
      collection: 'media',
      data: { alt: `Placeholder product image ${i + 1}` },
      file: {
        data: buffer,
        mimetype: 'image/png',
        name: `placeholder-${i + 1}.png`,
        size: buffer.length,
      },
    })
    mediaIds.push(media.id as number)
  }

  // --- Categories -----------------------------------------------------------
  const categoryData = [
    { title: 'Fiction', description: 'Novels and short stories.' },
    { title: 'Non-Fiction', description: 'Biographies, history, and reference.' },
    { title: 'Home & Gifts', description: 'Stationery, homeware, and giftable goods.' },
  ]
  const categoryIds: Record<string, number> = {}
  for (const data of categoryData) {
    const cat = await payload.create({ collection: 'categories', data })
    categoryIds[data.title] = cat.id as number
  }

  // --- Products (8 across the categories) -----------------------------------
  const products = [
    { title: 'The Midnight Library', authorOrBrand: 'Matt Haig', price: 14.99, category: 'Fiction', inventoryStatus: 'in-stock' },
    { title: 'Project Hail Mary', authorOrBrand: 'Andy Weir', price: 18.5, category: 'Fiction', inventoryStatus: 'low-stock' },
    { title: 'Klara and the Sun', authorOrBrand: 'Kazuo Ishiguro', price: 16.0, category: 'Fiction', inventoryStatus: 'out-of-stock' },
    { title: 'Sapiens', authorOrBrand: 'Yuval Noah Harari', price: 22.0, category: 'Non-Fiction', inventoryStatus: 'in-stock' },
    { title: 'Atomic Habits', authorOrBrand: 'James Clear', price: 19.99, category: 'Non-Fiction', inventoryStatus: 'in-stock' },
    { title: 'Linen-Bound Notebook', authorOrBrand: 'Field Notes', price: 12.0, category: 'Home & Gifts', inventoryStatus: 'low-stock' },
    { title: 'Ceramic Pour-Over Mug', authorOrBrand: 'Kinto', price: 28.0, category: 'Home & Gifts', inventoryStatus: 'in-stock' },
    { title: 'Soy Wax Candle', authorOrBrand: 'P.F. Candle Co.', price: 24.0, category: 'Home & Gifts', inventoryStatus: 'out-of-stock' },
  ] as const

  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    await payload.create({
      collection: 'products',
      data: {
        title: p.title,
        authorOrBrand: p.authorOrBrand,
        price: p.price,
        category: categoryIds[p.category],
        image: mediaIds[i % mediaIds.length],
        inventoryStatus: p.inventoryStatus,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        description: richText([
          paragraph(`${p.title} by ${p.authorOrBrand}.`),
          heading('h3', 'Highlights'),
          bulletList(['Carefully curated pick', 'Ships within 2 business days', 'Independent retailer favourite']),
        ]) as any,
      },
    })
  }

  // --- Pages ----------------------------------------------------------------
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Home',
      heroImage: mediaIds[0],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: richText([
        heading('h2', 'Welcome to the shop'),
        paragraph('An independent retailer for books, stationery, and giftable goods.'),
        bulletList(['Hand-picked titles', 'Local pickup available', 'New arrivals weekly']),
      ]) as any,
    },
  })
  await payload.create({
    collection: 'pages',
    data: {
      title: 'About',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: richText([
        heading('h2', 'About us'),
        paragraph('We are a small independent shop focused on thoughtful curation and good service.'),
      ]) as any,
    },
  })

  // --- Site settings global -------------------------------------------------
  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      headerNavLinks: [
        { label: 'Shop', url: '/products' },
        { label: 'About', url: '/about' },
      ],
      footerLinks: [
        { label: 'Home', url: '/' },
        { label: 'About', url: '/about' },
      ],
      storeAddress: '123 Market Street\nLouisville, KY 40202',
      socialLinks: [
        { platform: 'instagram', url: 'https://instagram.com/example' },
        { platform: 'facebook', url: 'https://facebook.com/example' },
      ],
    },
  })

  payload.logger.info('Seed complete: 3 categories, 8 products, 2 pages, site-settings.')
  process.exit(0)
}

await run()
