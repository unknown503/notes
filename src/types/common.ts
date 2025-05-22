import { ButtonProps } from "@/components/ui/button"
import { User } from "firebase/auth"
import { ButtonHTMLAttributes, ReactNode } from "react"

type ButtonType = {
  kind: "button"
} & ButtonProps

type GenericType = {
  kind: "generic"
} & ButtonHTMLAttributes<HTMLButtonElement>

export type CopyButtonProps = (GenericType | ButtonType) & {
  textToCopy?: string
}

export type UserType = {
  user: User | null | false,
  isLoggedIn: boolean
}

export type AuthWrapperProps = { onlyAuth: boolean }
export type ChildrenReceptor = { children?: ReactNode }
