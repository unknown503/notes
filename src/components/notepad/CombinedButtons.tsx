"use client"
import ManualSave from '@/components/notepad/ManualSave'
import { Copy } from 'lucide-react'
import { CopyButton, useIsMobile } from '../common'
import { useNotepadContext } from './NotepadContext'
import { CustomButton } from '../case/CaseTab'

export default function CombinedButtons() {
  const { Notepad } = useNotepadContext()
  const isMobile = useIsMobile()

  return (
    <div className='flex gap-3'>
      <ManualSave />
      <CopyButton
        kind='generic'
        textToCopy={Notepad?.content}
      >
        <CustomButton
          Icon={Copy}
          children={!isMobile && "Copy"}
        />
      </CopyButton>
    </div>
  )
}
