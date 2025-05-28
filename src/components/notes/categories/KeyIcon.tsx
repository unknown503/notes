// @ts-nocheck
import * as LucideIcons from 'lucide-react'
import { ForwardRefExoticComponent } from "react"

type KeyIconProps = {
  name: string | undefined
  color: string | undefined
  size?: number
}

export default function KeyIcon({ name, color, size }: KeyIconProps) {
  let Icon = LucideIcons[name] as ForwardRefExoticComponent<Omit<LucideIcons.LucideProps, "ref">>
  if (!Icon) Icon = LucideIcons["Squirrel"]
  return <Icon size={size || 25} color={color} />
}
