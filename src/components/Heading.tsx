import { ReactNode } from "react";

interface HeadingProps {
  title: string
  children?: ReactNode
  rightTitleSide?: ReactNode
}

export default function Heading({ children, title, rightTitleSide }: HeadingProps) {
  return (
    <header className="border-b border-gray-700">
      <div className="container">
        <div className="flex justify-between pb-4 lg:pb-6">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {rightTitleSide}
        </div>
        {children}
      </div>
    </header>
  )
}