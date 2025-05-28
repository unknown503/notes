import KeyIcon from "@/components/notes/categories/KeyIcon"
import { Button } from "@/components/ui/button"
import { ColorPicker } from "@/components/ui/color-picker"
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useIconsContext } from "@/context/IconsContext"
import { Plus, Trash } from "lucide-react"
import { FormEvent, MouseEvent, useState } from "react"

import { useToast } from "@/components/ui/use-toast"
import { DEFAULT_ICON, UpdateIcons } from "@/lib/db"
import { customToast } from "@/lib/utils"
import { Icon } from "@/types/icons"

const INITIAL_COLOR = '#fff'

export function SettingsDialog() {
  const { Icons, setIcons, findBy } = useIconsContext()
  const [Color, setColor] = useState(INITIAL_COLOR);
  const [Name, setName] = useState("")
  const { toast } = useToast()

  const saveIcon = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const existingIcon = findBy(Name) !== undefined

    if (existingIcon) {
      toast(customToast("Existing icon", true))
      setName("")
      return
    }

    setIcons(prev => {
      const icons = [...prev, {
        name: Name,
        color: Color
      }]
      UpdateIcons({ icons })
      return icons
    })
    toast(customToast("Icon saved"))
    setColor(INITIAL_COLOR)
    setName("")
  }

  /**
   * @todo Note check to see if the icons is being used somewhere
   */
  const removeIcon = async (name: string, e: MouseEvent<HTMLButtonElement>) => {
    if (DEFAULT_ICON === name) {
      toast(customToast("Cant remove that one", true))
      return
    }
    const filtered = Icons.filter(icon => icon.name !== name);
    await UpdateIcons({ icons: filtered })
    const btn = e.target as HTMLButtonElement
    btn.disabled = true
    toast(customToast("Icon removed"))
    setIcons(filtered)
  }

  return (
    <DialogContent className="sm:max-w-[26.5625rem]">
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
        <DialogDescription className="sr-only">
          Settings
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-5">
        <form className="flex gap-2" onSubmit={saveIcon}>
          <ColorPicker
            onChange={setColor}
            className="shrink-0"
            value={Color}
          />
          <Input
            placeholder="Icon name"
            className="col-span-3"
            type="text"
            value={Name}
            autoComplete="off"
            onChange={(e) => setName(e.target.value)}
          />
          <Button
            variant="outline"
            size="icon"
            className="px-2"
            type="submit"
          >
            <Plus />
          </Button>
        </form>
        <Separator />
        <div className="flex flex-wrap gap-4 pb-4">
          {Icons.map(icon =>
            <PopoverIcon
              key={icon.name}
              name={icon.name}
              color={icon.color}
              removeIcon={removeIcon}
            />
          )}
        </div>
      </div>
    </DialogContent>
  )
}

type PopoverIconProps = { removeIcon: (name: string, e: any) => void } & Icon
const PopoverIcon = ({ color, name, removeIcon }: PopoverIconProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="p-1.5 !size-12"
          >
            <KeyIcon
              name={name}
              color={color}
              hexColor
              size={36}
            />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <Button
            variant="ghost"
            size="icon"
            title="Remove icon"
            onClick={(e) => removeIcon(name, e)}
          >
            <Trash />
          </Button>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
