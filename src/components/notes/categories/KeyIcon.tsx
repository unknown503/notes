// @ts-nocheck
import { iconList } from '@/icons/categories'
import * as LucideIcons from 'lucide-react'
import { ForwardRefExoticComponent } from "react"

type KeyIconProps = {
  name: string | undefined
  color: string | undefined
  hexColor?: boolean
}

export default function KeyIcon({ name, color, hexColor }: KeyIconProps) {
  const inferredColor = hexColor ? color : iconList[color as keyof typeof iconList]
  const Icon = LucideIcons[name] as ForwardRefExoticComponent<Omit<LucideIcons.LucideProps, "ref">>
  return <Icon size={25} color={inferredColor} />
}
