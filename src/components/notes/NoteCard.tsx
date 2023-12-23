"use client"
import { NoteOptionsButtonProps } from "@/components/notes/NoteOptionsButton"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DownloadFile, GetFileName } from "@/lib/db"
import { DecodeHtml, IsAnImage, convertToRichtext, customToast, getDate } from "@/lib/utils"
import { AlertCircle, Copy, Download, File, Image as ImageIcon, WifiOff } from "lucide-react"
import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import Indicator from "../Indicator"
import { CopyButton } from "../common"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import { useToast } from "../ui/use-toast"
import { NoteDoc } from "@/types/notes"

const NoteOptionsButton = dynamic(() => import('@/components/notes/NoteOptionsButton'))

export default function NoteCard(props: NoteDoc) {
  const { content, files, isPublic, timestamp, isCritical, offlineSaving } = props
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
            <div className="flex gap-2 items-center">
              {isCritical &&
                <AlertCircle color="red" size={25} />
              }
              {offlineSaving ?
                <WifiOff size={20} color="red" />
                :
                <NoteOptionsButton
                  {...props}
                  setHide={setHide}
                  Hide={Hide}
                />
              }
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
                  <Avatar className="w-[30px] h-[30px]">
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
      <SheetContent
        className={Hide ? "hidden" : ""}
        otherSide={
          <RightSideComponent
            {...props}
            setHide={setHide}
            Hide={Hide}
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
            <div className="word-break pt-4">
              <ScrollArea customClass="max-h-[600px]">
                {content !== "" ?
                  <span
                    className="rich-text"
                    dangerouslySetInnerHTML={{ __html: convertToRichtext(DecodeHtml(content)) }}
                  />
                  : files.map(file => GetFileName(file)).join(", ")
                }
              </ScrollArea>
            </div>

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

type FilesProps = {
  files: string[]
  onFileClick: (url: string, name: string) => void
}

const Files = ({ files, onFileClick }: FilesProps) => {
  const { toast } = useToast()

  const DownloadSingleFile = (file: string, name: string) => {
    onFileClick(file, name)
    toast(customToast("File downloaded."))
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
                aria-label="View image"
              >
                <Link
                  href={file}
                  className="min-w-[1.125rem]"
                  target="_blank"
                >
                  <ImageIcon size={16} />
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

const RightSideComponent = (props: NoteOptionsButtonProps) => (
  <div className="flex items-center gap-2">
    <Badge variant={props.isPublic ? "destructive" : "secondary"}>
      {props.isPublic ? "Public" : "Private"}
    </Badge>
    <NoteOptionsButton {...props} />
  </div>
)