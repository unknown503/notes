import { Badge } from "@/components/ui/badge";
import { Category } from "@/types/notes";
import KeyIcon from "./KeyIcon";

type Filter = {
  onClick?: () => void
  selectedFilter: string
}

type CategoryVariant = {
  type: "category"
  category: Category
} & Filter

type CustomVariant = {
  type: "custom"
  label: string
} & Filter

type FilterBadgeProps = CategoryVariant | CustomVariant

export default function FilterBadge(props: FilterBadgeProps) {
  //@ts-ignore
  const isFilterSelected = (props.category?.content ?? props.label).toLowerCase() === props.selectedFilter

  return (
    <Badge
      variant={isFilterSelected ? "default" : "secondary"}
      className={`px-4 py-1 flex gap-2 capitalize ${isFilterSelected ? "text-white" : ""}`}
      element="button"
      onClick={props.onClick}
    >
      {props.type === "category" ?
        <>
          <KeyIcon
            name={props.category.icon}
            color={props.category.icon}
            size={18}
          />
          {props.category.content}
        </>
        : props.label

      }
    </Badge>
  )
}
