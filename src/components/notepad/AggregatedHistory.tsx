import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { useHistoryContext } from "@/context/HistoryContext"
import { getWeekDay } from "@/lib/utils"
import { Copy } from "lucide-react"
import { CopyButton } from "../lib/lib"
import { Separator } from "../ui/separator"
import { Toggle } from "../ui/toggle"
import { ScrollArea } from "../ui/scroll-area"

export default function AggregatedHistory() {
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
        <ScrollArea customClass="max-h-[36.25rem]" className="space-y-4 mt-4">
          {Records && Records.thisWeek.reverse().map((record, i) => (
            <div key={record.timestamp}>
              <div className="flex gap-4 items-center">
                <span>{i + 1}</span>
                <div>
                  <span className="text-sm text-gray-500">{getWeekDay(record.timestamp)}</span>
                  <div className="flex gap-3">
                    <p>{record.content}</p>
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
              {i !== Records.thisWeek.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
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
