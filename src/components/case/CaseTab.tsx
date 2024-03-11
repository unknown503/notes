"use client"
import { CapitalizedCase, SentenceCase } from '@/lib/utils'
import { Baseline, CaseLower, CaseSensitive, CaseUpper, Clipboard, Copy, Eraser, LucideIcon, Scissors } from 'lucide-react'
import { CopyButton } from '../common'
import { Button, ButtonProps } from '../ui/button'
import TextareaField, { useTextareaFieldState } from './TextareaField'

const CaseTab = () => (
  <TextareaField>
    <TextareaField.Right>
      <VerticalButtons />
    </TextareaField.Right>
    <TextareaField.Underneath>
      <UnderneathButtons />
    </TextareaField.Underneath>
  </TextareaField>
)

type CustomButtonProps = ButtonProps & { Icon: LucideIcon, isVertical?: boolean }
const CustomButton = ({ Icon, children, isVertical, ...props }: CustomButtonProps) => (
  <Button
    className={`text-white flex ${isVertical ? "lg:w-full gap-0.5" : "gap-2"}`}
    variant="secondary"
    {...props}
  >
    <Icon size={18} />
    {children}
  </Button>
)

function VerticalButtons() {
  const { Text, setText } = useTextareaFieldState()

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

function UnderneathButtons() {
  const { setText } = useTextareaFieldState()

  return (
    <>
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
    </>
  )
}

export default CaseTab