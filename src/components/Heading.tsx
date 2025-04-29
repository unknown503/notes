import { ChildrenReceptor } from "@/types/common";
import { ReactNode } from "react";

type HeadingProps = {
  title: string
  rightTitleSide?: ReactNode
} & ChildrenReceptor

export default function Heading({ children, title, rightTitleSide }: HeadingProps) {
  return (
    <header className="border-b border-gray-700 sticky top-0 pt-4 lg:pt-6 bg-background">
      <div className="container">
        <div className="flex items-center justify-between pb-4 lg:pb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {rightTitleSide}
        </div>
        {children}
      </div>
    </header>
  )
}