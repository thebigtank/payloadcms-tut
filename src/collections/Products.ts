import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'authorOrBrand', 'price', 'inventoryStatus', 'category'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'authorOrBrand',
      type: 'text',
      required: true,
      // Serves both books (author) and general retail (brand).
      label: 'Author / Brand',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      // Stored in MAJOR currency units (e.g. 12.99 = $12.99), not cents.
      // Payload's number field keeps the JS double as-is; round to 2 decimals
      // at the point of display/formatting (e.g. Intl.NumberFormat) rather than here.
      admin: {
        step: 0.01,
      },
    },
    {
      name: 'description',
      type: 'richText',
      // Inherits the config-level defaultLexical editor.
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      required: true,
    },
    {
      name: 'inventoryStatus',
      type: 'select',
      required: true,
      defaultValue: 'in-stock',
      options: [
        { label: 'In stock', value: 'in-stock' },
        { label: 'Low stock', value: 'low-stock' },
        { label: 'Out of stock', value: 'out-of-stock' },
      ],
    },
    slugField(),
  ],
}
