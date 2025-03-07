"use client"
import { DeleteHistoryRecord, RecoverContentHistory, SubscribeToNotepadHistory } from "@/lib/db"
import { dateToReadableRecent, getDate, isWithinThisWeek } from "@/lib/utils"
import { Copy, CornerDownLeft, Trash } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useNotepadContext } from "../../context/NotepadContext"
import { CopyButton } from "../lib/lib"

function History() {
  const accordionRef = useRef<HTMLDivElement>(null)
  const [Records, setRecords] = useState<NotepadWeeks | null>(null)
  const { Notepad, setNotepad } = useNotepadContext()

  useEffect(() => {
    const unsubscribe = SubscribeToNotepadHistory(docs => {
      const records = docs.records.sort((a, b) => b.timestamp - a.timestamp)
      const weeks: NotepadWeeks = {
        thisWeek: records.filter(record => isWithinThisWeek(record.timestamp)),
        lastWeek: records.filter(record => !isWithinThisWeek(record.timestamp)),
      }

      setRecords(weeks)
      setTimeout(() => {
        expandAll()
      }, 200);
    })
    return () => unsubscribe()
  }, [])

  const RecoverContent = async ({ content, timestamp }: NotepadDoc) => {
    if (!Records || !Notepad) return
    const { lastWeek, thisWeek } = Records
    const docs = [...thisWeek, ...lastWeek]
    await RecoverContentHistory(docs, timestamp, Notepad, content)

    setNotepad({
      content,
      timestamp: Date.now()
    })
  }

  const DeleteContent = (timestamp: number) => {
    if (!Records) return
    const { lastWeek, thisWeek } = Records
    const docs = [...thisWeek, ...lastWeek]
    DeleteHistoryRecord(docs, timestamp)
  }

  const expandAll = () => {
    if (!accordionRef.current) return
    const items = accordionRef.current.querySelectorAll<HTMLButtonElement>("div[data-state='closed'] button")
    items.forEach(item => {
      item.click()
    });
  }

  const AccordionItemContent = (record: NotepadDoc) => (
    <AccordionItem
      value={record.timestamp.toString()}
    >
      <AccordionTrigger title={getDate(record.timestamp, true)}>
        {dateToReadableRecent(record.timestamp)}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex gap-4 justify-between">
          <p className="word-break">
            {record.content.trim()}
          </p>
          <div className="flex gap-2 flex-col md:flex-row">
            <CopyButton
              kind='generic'
              textToCopy={record.content}
            >
              <Button
                variant="outline"
                size="icon"
                title="Copy content"
              >
                <Copy size={16} />
              </Button>
            </CopyButton>
            <Button
              variant="outline"
              size="icon"
              title="Recover content"
              onClick={() => RecoverContent(record)}
            >
              <CornerDownLeft size={16} />
            </Button>
            <Button
              variant="destructive"
              size="icon"
              title="Delete content"
              onClick={() => DeleteContent(record.timestamp)}
            >
              <Trash size={16} />
            </Button>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )

  return (
    <div className="container">
      <div className="pt-3">
        {!Records ?
          <div className="flex flex-col gap-3">
            {new Array(5).fill(0).map((_, i) =>
              <Skeleton
                className="w-full h-12 rounded-md"
                key={i}
              />
            )}
          </div>
          : (Records.thisWeek.length !== 0 || Records.lastWeek.length !== 0) ?
            <>
              {Records.thisWeek.length !== 0 && (
                <>
                  <h2 className="text-xl font-semibold">This week</h2>
                  <Accordion
                    type="multiple"
                    className="ml-5"
                    ref={accordionRef}
                  >
                    {Records.thisWeek.map(record =>
                      <AccordionItemContent {...record} key={record.timestamp} />
                    )}
                  </Accordion>
                </>
              )}
              {Records.lastWeek.length !== 0 && (
                <>
                  <h2 className="text-xl font-semibold pt-8">Last week</h2>
                  <Accordion
                    type="multiple"
                    className="ml-5"
                  >
                    {Records.lastWeek.map(record =>
                      <AccordionItemContent {...record} key={record.timestamp} />
                    )}
                  </Accordion>
                </>
              )}
            </>
            : <p>No records available...</p>
        }
      </div>
    </div>
  )
}

export default History