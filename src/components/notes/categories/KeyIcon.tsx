// @ts-nocheck
import { iconList } from '@/icons/categories'
import * as LucideIcons from 'lucide-react'
import { ForwardRefExoticComponent } from "react"

type KeyIconProps = {
  name: string | undefined
  color: string | undefined
  hexColor?: boolean
  size?: number
}

export default function KeyIcon({ name, color, hexColor, size }: KeyIconProps) {
  const inferredColor = hexColor ? color : iconList[color as keyof typeof iconList]
  let Icon = LucideIcons[name] as ForwardRefExoticComponent<Omit<LucideIcons.LucideProps, "ref">>
  if (!Icon) Icon = LucideIcons["Squirrel"]
  return <Icon size={size || 25} color={inferredColor} />
}
