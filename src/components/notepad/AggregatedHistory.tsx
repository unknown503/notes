import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useHistoryContext } from "@/context/HistoryContext"
import { getWeekDay } from "@/lib/utils"
import { Copy } from "lucide-react"
import { Separator } from "../ui/separator"
import { Toggle } from "../ui/toggle"
import { ScrollArea } from "../ui/scroll-area"
import { useNotepadContext } from "@/context/NotepadContext"
import CopyButton from "../lib/CopyButton"
import { NotepadDoc } from "@/types/notepad"

export default function AggregatedHistory() {
  const { Notepad } = useNotepadContext()
  const { Records } = useHistoryContext()

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Aggregate Week</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Aggregated Week</DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Aggregated Week
        </DialogDescription>
        <ScrollArea customClass="max-h-[36.25rem]">
          <div className="space-y-4 mt-4 mr-2.5">
            {Records && Records.thisWeek.map((record, i) => (
              <HistoryItem
                count={i + 1}
                record={record}
                showSeparation
                key={record.timestamp}
              />
            ))}
            {Notepad && Records &&
              <HistoryItem
                count={Records?.thisWeek.length + 1}
                record={Notepad}
              />
            }
          </div>
        </ScrollArea>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

type HistoryItem = {
  record: NotepadDoc | NotepadDoc
  count: number
  showSeparation?: boolean
}

const HistoryItem = ({ record, count, showSeparation }: HistoryItem) => {
  return (
    <div key={record.timestamp}>
      <div className="flex gap-4 items-center">
        <span>{count}</span>
        <div className="w-full">
          <span className="text-sm text-gray-500">{getWeekDay(record.timestamp)}</span>
          <div className="flex gap-3 justify-between">
            <p className="word-break">{record.content}</p>
            <CopyButton
              kind='generic'
              disableToast
              textToCopy={record.content}
            >
              <Toggle variant="outline">
                <Copy size={16} />
              </Toggle>
            </CopyButton>
          </div>
        </div>
      </div>
      {showSeparation && <Separator className="mt-4" />}
    </div>
  )
}
