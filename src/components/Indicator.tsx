import { ChildrenReceptor } from "@/types/common"

type IndicatorProps = {
  text: string | number
} & ChildrenReceptor

const Indicator = ({ children, text }: IndicatorProps) => (
  <div className="relative">
    {typeof text === "string" && parseInt(text) > 1 || typeof text === "number" && text > 1 &&
      <span className="absolute -top-2 -right-3 bg-primary z-10 text-xs px-1.5 py-0.5 rounded-sm">
        {text}
      </span>
    }
    {children}
  </div>
)

export default Indicator