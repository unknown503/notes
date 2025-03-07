import * as LucideIcons from 'lucide-react'
import { ForwardRefExoticComponent } from "react"

type KeyIconProps = {
  name: string
  color: string
}

export default function KeyIcon({ name, color }: KeyIconProps) {
  // @ts-ignore
  const Icon = LucideIcons[name] as ForwardRefExoticComponent<Omit<LucideIcons.LucideProps, "ref">>
  return <Icon size={25} color={color} />
}
