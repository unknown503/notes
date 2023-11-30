import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '../ui/card';
import { FileUp, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from "@/components/ui/use-toast"
import { ReactNode, useCallback } from 'react';
import { GetFileName } from '@/lib/db';
import { customToast } from '@/lib/utils';

interface DropzoneProps {
  Files: File[],
  setFiles: (v: File[]) => void
}

export default function Dropzone({ Files, setFiles }: DropzoneProps) {
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles([...Files, ...acceptedFiles])
  }, [Files])

  const { getRootProps, getInputProps, isDragReject, isFocused, isDragActive } = useDropzone({
    maxFiles: 8,
    onDrop,
    onDropRejected: () => {
      toast(customToast("You cannot drop more than 8 files at the same time.", true))
    },
  });

  function RemoveFile(file: File) {
    const newFiles = [...Files]
    newFiles.splice(newFiles.indexOf(file), 1)
    setFiles(newFiles)
  }

  return (
    <div className="flex flex-col gap-3">
      <Card className='border-none shadow-none'>
        <CardContent {...getRootProps({
          className: `rounded-sm flex items-center justify-center text-muted-foreground px-2 py-4 text-xs gap-1 border-dashed border-gray-500 border-2 hover:cursor-pointer bg-muted
            ${isDragReject ? "border-red-500" : ""}
            ${isFocused ? "border-primary" : ""}
            ${isDragActive ? "border-green-500" : ""}`
        })}
        >
          <FileUp className="h-6 w-6 text-muted-foreground" />
          <span className="font-medium">Drop files here</span>
          <input {...getInputProps()} />
        </CardContent>
      </Card>
      {Files.length !== 0 &&
        <FilesList files={Files} onFileClick={RemoveFile} />
      }
    </div>
  );
}

interface FilesListProps {
  files: File[]
  onFileClick: (v: File) => void
}

const FilesList = ({ files, onFileClick }: FilesListProps) => (
  <div className='flex flex-col gap-1'>
    {files.map(file =>
      <Button
        variant="ghost"
        className='flex flex-row justify-start items-center gap-2'
        key={file.lastModified}
        onClick={() => onFileClick(file)}
        title={file.name}
      >
        <span className="text-primary min-w-[1.125rem]">
          <XCircle size={18} />
        </span>
        <span className='text-xs text-start word-break line-clamp-1'>
          {file.name}
        </span>
      </Button>
    )}
  </div>
)
