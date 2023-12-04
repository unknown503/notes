"use client"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CapitalizedCase, LoadAndDeleteLocalStorage, SentenceCase, WordCount } from '@/lib/utils'
import { Baseline, CaseLower, CaseSensitive, CaseUpper, Clipboard, Copy, Eraser, LucideIcon, Scissors } from 'lucide-react'
import { useEffect, useState } from 'react'
import { CopyButton } from '../common'
import { Button, ButtonProps } from '../ui/button'

export default function TextareaField() {
  const [Text, setText] = useState("")

  useEffect(() => {
    setText(LoadAndDeleteLocalStorage("note"))
  }, [])

  return (
    <div className="container py-4 lg:py-6 w-full gap-x-4 lg:gap-x-8 gap-y-4 grid grid-cols-12">
      <Label
        htmlFor="content"
        className='col-span-12'
      >
        Text content
      </Label>
      <div className="flex flex-wrap gap-2 lg:hidden col-span-12">
        <VerticalButtons
          Text={Text}
          setText={setText}
        />
      </div>
      <Textarea
        placeholder="Type or paste something"
        className="min-h-[18rem] h-40 max-h-60 col-span-12 lg:col-span-10"
        id='content'
        onChange={e => setText(e.currentTarget.value)}
        value={Text}
      />
      <div className="hidden lg:flex flex-col gap-3 col-span-2">
        <VerticalButtons
          Text={Text}
          setText={setText}
        />
      </div>
      <div className="flex flex-wrap gap-2 lg:gap-3 col-span-12">
        <CustomButton
          Icon={CaseSensitive}
          children="Sentence case"
          onClick={() => setText(text => SentenceCase(text))}
        />
        <CustomButton
          Icon={Baseline}
          children="Capitalized Case"
          onClick={() => setText(text => CapitalizedCase(text))}
        />
        <CustomButton
          Icon={CaseLower}
          children="lower case"
          onClick={() => setText(text => text.toLowerCase())}
        />
        <CustomButton
          Icon={CaseUpper}
          children="UPPER CASE"
          onClick={() => setText(text => text.toUpperCase())}
        />
      </div>
      <div className="flex flex-col gap-2 col-span-12 text-sm">
        <p>
          Character Count: {Text.length}
        </p>
        <p>
          Word Count: {Text === "" ? 0 : WordCount(Text)}
        </p>
      </div>
    </div>
  )
}

type CustomButtonProps = ButtonProps & { Icon: LucideIcon, isVertical?: boolean }
function CustomButton({ Icon, children, isVertical, ...props }: CustomButtonProps) {
  return (
    <Button
      className={`text-white flex ${isVertical ? "lg:w-full gap-0.5" : "gap-1"}`}
      variant="secondary"
      {...props}
    >
      <Icon size={18} />
      {children}
    </Button>
  )
}

type VerticalButtonsProps = {
  Text: string, setText: (v: string) => void
}
function VerticalButtons({ Text, setText }: VerticalButtonsProps) {
  const Paste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text)
  }

  return (
    <>
      <CustomButton
        Icon={Clipboard}
        children="Paste"
        onClick={Paste}
        isVertical
      />
      <CopyButton
        kind='generic'
        textToCopy={Text}
      >
        <CustomButton
          Icon={Copy}
          children="Copy"
          isVertical
        />
      </CopyButton>
      <CopyButton
        kind='generic'
        textToCopy={Text}
        onClick={() => setText("")}
      >
        <CustomButton
          Icon={Scissors}
          children="Cut"
          isVertical
        />
      </CopyButton>
      <CustomButton
        Icon={Eraser}
        children="Clear"
        isVertical
        onClick={() => setText("")}
      />
    </>
  )
}
