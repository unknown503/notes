"use client"
import { NoteOptionsButtonProps } from "@/components/notes/NoteOptionsButton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useCategoriesContext } from "@/context/CategoriesContext"
import { useIconsContext } from "@/context/IconsContext"
import { GetFileName } from "@/lib/db"
import { DecodeHtml, convertToRichtext, getDate } from "@/lib/utils"
import { NoteDoc } from "@/types/notes"
import { File } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useState } from "react"
import Indicator from "../Indicator"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Sheet, SheetTrigger } from "../ui/sheet"
import KeyIcon from "./categories/KeyIcon"
import NoteExpanded from "./NoteExpanded"

const NoteOptionsButton = dynamic(() => import('@/components/notes/NoteOptionsButton'))

export default function NoteCard(props: NoteDoc) {
  const { content, files, isPublic, timestamp, categoryId } = props
  const [Hide, setHide] = useState(false)
  const { findBy } = useCategoriesContext()
  const { findBy: findIconBy } = useIconsContext()
  const icon = findBy(categoryId)?.icon

  return (
    <Sheet modal={false}>
      <Card className={`h-full ${Hide ? "hidden" : ""}`}>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div>
              <Badge variant={isPublic ? "destructive" : "secondary"}>
                {isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            <div className="flex gap-2 items-center">
              {categoryId && categoryId !== "" &&
                <KeyIcon name={icon} color={findIconBy(icon)?.color} />
              }
              <NoteOptionsButton
                {...props}
                setHide={setHide}
                Hide={Hide}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <SheetTrigger className="w-full h-[169px] flex flex-col justify-between">
          <CardContent className="word-break h-[115px]">
            <div className="line-clamp-5 text-start text-sm">
              {content !== "" ?
                <span
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: convertToRichtext(DecodeHtml(content)) }}
                />
                :
                files.map(file => GetFileName(file)).join(", ")
              }
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center w-full">
            <div>
              {files.length !== 0 &&
                <Indicator text={files.length}>
                  <Avatar className="size-[30px]">
                    <AvatarImage asChild src={files[0]}>
                      <Image
                        src={files[0]}
                        width="30"
                        height="30"
                        className="object-cover"
                        loading="lazy"
                        alt=""
                        role="presentation"
                      />
                    </AvatarImage>
                    <AvatarFallback>
                      <File />
                    </AvatarFallback>
                  </Avatar>
                </Indicator>
              }
            </div>
            <span className="text-xs">
              {getDate(timestamp)}
            </span>
          </CardFooter>
        </SheetTrigger>
      </Card>
      <NoteExpanded
        {...props}
        Hide={Hide}
        setHide={setHide}
      />
    </Sheet>
  )
}

export const RightSideComponent = (props: NoteOptionsButtonProps) => (
  <div className="flex items-center gap-2">
    <Badge variant={props.isPublic ? "destructive" : "secondary"}>
      {props.isPublic ? "Public" : "Private"}
    </Badge>
    <NoteOptionsButton {...props} />
  </div>
)