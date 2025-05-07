"use client"
import { ReplaceAll } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import TextareaField from './TextareaField'
import { useState } from 'react'
import { useTextareaFieldState } from '@/context/TextareaContext'

const CaseReplace = () => (
  <TextareaField>
    <TextareaField.Right>
      <ReplaceInputs />
    </TextareaField.Right>
  </TextareaField>
)

const ReplaceInputs = () => {
  const { Text, setText } = useTextareaFieldState()
  const [Search, setSearch] = useState("")
  const [Replace, setReplace] = useState("")

  const onReplaceAll = () => {
    const newThing = Text.replaceAll(Search, Replace)
    setText(newThing)
    setSearch("")
    setReplace("")
  }

  return (
    <div className='flex flex-col gap-2'>
      <Input
        placeholder='Search'
        value={Search}
        onChange={e => setSearch(e.target.value)}
      />
      <Input
        placeholder='Replace'
        value={Replace}
        onChange={e => setReplace(e.target.value)}
      />
      <Button
        className="flex gap-1"
        variant="secondary"
        onClick={onReplaceAll}
      >
        <ReplaceAll size={15} />
        Replace all
      </Button>
    </div>
  )
}


export default CaseReplace
