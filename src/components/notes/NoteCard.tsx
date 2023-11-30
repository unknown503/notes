"use client"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { NoteOptionsButton } from "./NoteOptionsButton"
import { SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Sheet } from "../ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Copy, Download, File, Image } from "lucide-react"
import Indicator from "../Indicator"
import { IsAnImage, convertToRichtext, customToast, getDate } from "@/lib/utils"
import { Button } from "../ui/button"
import { DownloadFile, GetFileName } from "@/lib/db"
import { useToast } from "../ui/use-toast"
import { useState } from "react"
import Link from "next/link"
import { CopyButton } from "../common"

export default function NoteCard({ id, content, files, isPublic, timestamp }: NoteDoc) {
  const [Hide, setHide] = useState(false)
  const { toast } = useToast()

  const DownloadAll = () => {
    files.map(file => {
      const name = GetFileName(file)
      DownloadFile(file, name)
    })
    toast(customToast("All files downloaded."))
  }

  return (
    <Sheet>
      <Card className={`h-full ${Hide ? "hidden" : ""}`}>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div>
              <Badge variant={isPublic ? "destructive" : "secondary"}>
                {isPublic ? "Public" : "Private"}
              </Badge>
            </div>
            <NoteOptionsButton
              content={content}
              setHide={setHide}
              isPublic={isPublic}
              files={files}
              id={id}
            />
          </CardTitle>
        </CardHeader>
        <SheetTrigger className="w-full h-[169px] flex flex-col justify-between">
          <CardContent className="word-break h-[115px]">
            <p className="line-clamp-5 text-start text-sm">
              {content !== "" ?
                <span
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: convertToRichtext(content) }}
                />
                :
                files.map(file => GetFileName(file)).join(", ")
              }
            </p>
          </CardContent>
          <CardFooter className="flex justify-between items-center w-full">
            <div>
              {files.length !== 0 &&
                <Indicator text={files.length}>
                  <Avatar className="w-[30px] h-[30px]">
                    <AvatarImage src={files[0]} className="object-cover" loading="lazy" />
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
      <SheetContent
        className={Hide ? "hidden" : ""}
        otherSide={
          <RightSideComponent
            content={content}
            isPublic={isPublic}
            setHide={setHide}
            files={files}
            id={id}
          />
        }
      >
        <SheetHeader>
          <SheetTitle>
            Note
          </SheetTitle>
          <SheetDescription>
            <span className="text-xs">
              {getDate(timestamp, true)}
            </span>
          </SheetDescription>
          <div className="flex flex-col gap-5">
            <p className="word-break pt-4">
              {content !== "" ?
                <span
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: convertToRichtext(content) }}
                />
                : files.map(file => GetFileName(file)).join(", ")
              }
            </p>

            <div className="flex gap-4 justify-end">
              {content !== "" &&
                <CopyButton
                  textToCopy={content}
                  kind="button"
                  variant="secondary"
                  className="flex gap-1.5"
                  size="sm"
                >
                  <Copy size={16} />
                  Copy
                </CopyButton>
              }
              {files.length !== 0 &&
                <Button
                  variant="destructive"
                  className='flex gap-1.5'
                  size="sm"
                  onClick={DownloadAll}
                >
                  <Download size={16} />
                  Download all
                </Button>
              }
            </div>
            <Files
              files={files}
              onFileClick={DownloadFile}
            />
          </div>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}

interface FilesProps {
  files: string[]
  onFileClick: (url: string, name: string) => void
}

const Files = ({ files, onFileClick }: FilesProps) => {
  const { toast } = useToast()

  const DownloadSingleFile = (file: string, name: string) => {
    onFileClick(file, name)
    toast(customToast(`File ${name} downlaoded.`))
  }

  return (
    <div className='flex flex-col gap-1'>
      {files.map(file => {
        const name = GetFileName(file)
        return (
          <div className="flex flex-row items-center gap-1" key={file}>
            <Button
              variant="ghost"
              className='flex flex-row justify-start gap-2 w-full'
              onClick={() => DownloadSingleFile(file, name)}
              title={name}
            >
              <span className="text-primary min-w-[1.125rem]">
                <Download size={18} />
              </span>
              <span className='text-xs text-start word-break line-clamp-1'>
                {name}
              </span>
            </Button>
            {IsAnImage(name) &&
              <Button
                variant="secondary"
                size="icon"
                asChild
              >
                <Link
                  href={file}
                  className="min-w-[1.125rem]"
                  target="_blank"
                >
                  <Image size={16} />
                </Link>
              </Button>
            }
          </div>
        )
      }
      )}
    </div>
  )
}

interface RightSideComponentProps {
  isPublic: boolean
  id: string
  files: string[]
  content: string
  setHide: (v: boolean) => void
}

function RightSideComponent(props: RightSideComponentProps) {
  const { isPublic } = props
  return (
    <div className="flex items-center gap-2">
      <Badge variant={isPublic ? "destructive" : "secondary"}>
        {isPublic ? "Public" : "Private"}
      </Badge>
      <NoteOptionsButton {...props} />
    </div>
  )
}
