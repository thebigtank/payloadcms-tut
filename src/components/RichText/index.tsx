import {
  type DefaultNodeTypes,
  type DefaultTypedEditorState,
  type SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  type JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { cn } from '@/utilities/cn'

// Resolve internal links to their frontend route. (No block nodes exist in this
// project, so we only extend the default converters with link handling.)
const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  const slug = typeof value === 'object' && value !== null ? (value as { slug?: string }).slug : value
  return relationTo === 'products' ? `/products/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<DefaultNodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
})

type Props = {
  data: DefaultTypedEditorState
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export const RichText: React.FC<Props> = ({ className, ...rest }) => {
  return (
    <ConvertRichText
      converters={jsxConverters}
      className={cn('prose dark:prose-invert max-w-none', className)}
      {...rest}
    />
  )
}

export default RichText
