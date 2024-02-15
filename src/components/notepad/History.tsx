"use client"
import { DeleteHistoryRecord, RecoverContentHistory, SubscribeToNotepadHistory } from "@/lib/db"
import { getDate } from "@/lib/utils"
import { Copy, CornerDownLeft, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { CopyButton } from "../common"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { Skeleton } from "../ui/skeleton"
import { useNotepadContext } from "./NotepadContext"

function History() {
  const [Records, setRecords] = useState<NotepadDoc[] | null>(null)
  const { Notepad, setNotepad } = useNotepadContext()

  useEffect(() => {
    const unsubscribe = SubscribeToNotepadHistory(docs => {
      const records = docs.records.sort((a, b) => b.timestamp - a.timestamp)
      setRecords(records)
    })
    return () => unsubscribe()
  }, [])

  const RecoverContent = async ({ content, timestamp }: NotepadDoc) => {
    if (!Records || !Notepad) return
    await RecoverContentHistory(Records, timestamp, Notepad, content)

    setNotepad({
      content,
      timestamp: Date.now()
    })
  }

  const DeleteContent = (timestamp: number) => {
    if (!Records) return
    DeleteHistoryRecord(Records, timestamp)
  }

  return (
    <div className="container">
      <h2 className="text-xl font-semibold">History</h2>
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
          : Records.length !== 0 ?
            <Accordion
              type="single"
              defaultValue={Records.length !== 0 ? Records[0].timestamp.toString() : undefined}
            >
              {Records.map(record => (
                <AccordionItem
                  value={record.timestamp.toString()}
                  key={record.timestamp}
                >
                  <AccordionTrigger>
                    {getDate(record.timestamp)}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex gap-4 justify-between">
                      <p className="word-break">
                        {record.content}
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
              ))}
            </Accordion>
            : <p>No records available...</p>
        }
      </div>
    </div>
  )
}

export default History