import { useCategoriesContext } from "@/context/CategoriesContext"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import FilterBadge from "./FilterBadge"
import { AppConfig } from "@/lib/config"

export default function CategoryFilters() {
  const [Filter, setFilter] = useState("")
  const { Categories } = useCategoriesContext()
  const searchParams = useSearchParams()
  const router = useRouter();

  useEffect(() => {
    if (searchParams.size === 0)
      router.push(`?category=${AppConfig.allFilter(true)}`)
    setFilter(searchParams.get("category") ?? "")
  }, [searchParams])


  const onBadgeClick = (type: string) => {
    router.push(`?category=${type.toLowerCase()}`)
  }

  return (
    <div className="flex flex-wrap gap-1.5 md:gap-3 mb-5">
      <FilterBadge
        type="custom"
        label={AppConfig.allFilter()}
        onClick={() => onBadgeClick(AppConfig.allFilter())}
        selectedFilter={Filter}
      />
      {Categories.map(cat => (
        <FilterBadge
          type="category"
          selectedFilter={Filter}
          category={cat}
          key={cat.id}
          onClick={() => onBadgeClick(cat.content)}
        />
      ))}
    </div>
  )
}
