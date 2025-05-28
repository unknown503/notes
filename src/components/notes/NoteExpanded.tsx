import { DownloadFile, GetFileName } from "@/lib/db";
import { convertToRichtext, customToast, DecodeHtml, getDate } from "@/lib/utils";
import { Copy, Download } from "lucide-react";
import { CopyButton } from "../lib/lib";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
import { useToast } from "../ui/use-toast";
import { RightSideComponent } from "./NoteCard";
import NoteFiles from "./NoteFiles";
import { NoteOptionsButtonProps } from "./NoteOptionsButton";

export default function NoteExpanded({ Hide, setHide, ...props }: NoteOptionsButtonProps) {
  const { content, files, timestamp } = props
  const { toast } = useToast()

  const DownloadAll = () => {
    files.map(file => {
      const name = GetFileName(file)
      DownloadFile(file, name)
    })
    toast(customToast("All files downloaded."))
  }

  return (
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
      <SheetHeader className="mb-4 h-full">
        <ScrollArea customClass="max-h-[36.25rem] pr-3">
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
              {content !== "" ?
                <span
                  className="rich-text"
                  dangerouslySetInnerHTML={{ __html: convertToRichtext(DecodeHtml(content)) }}
                />
                : files.map(file => GetFileName(file)).join(", ")
              }
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
            {files.length !== 0 &&
              <NoteFiles
                files={files}
                onFileClick={DownloadFile}
              />
            }
          </div>
        </ScrollArea>
      </SheetHeader>
    </SheetContent>
  )
}
