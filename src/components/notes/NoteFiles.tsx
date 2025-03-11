import { GetFileName } from "@/lib/db"
import { customToast, IsImage, IsPDF, ViewPDF } from "@/lib/utils"
import { Download, Link, ImageIcon, FileText } from "lucide-react"
import { Button } from "../ui/button"
import { useToast } from "../ui/use-toast"

type FilesProps = {
  files: string[]
  onFileClick: (url: string, name: string) => void
}

export default function NoteFiles({ files, onFileClick }: FilesProps) {
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
            {IsImage(name) &&
              <Button
                variant="secondary"
                size="icon"
                asChild
                aria-label="View image"
                title="View image"
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
            {IsPDF(name) &&
              <Button
                variant="secondary"
                size="icon"
                aria-label="View pdf file"
                title="View pdf file"
                onClick={() => ViewPDF(file)}
              >
                <FileText size={16} />
              </Button>
            }
          </div>
        )
      }
      )}
    </div>
  )

}