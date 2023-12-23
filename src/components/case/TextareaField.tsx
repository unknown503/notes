"use client"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { LineCount, LoadAndDeleteLocalStorage, WordCount } from '@/lib/utils'
import { Children, Dispatch, ReactNode, SetStateAction, createContext, isValidElement, useContext, useEffect, useMemo, useState } from 'react'

type ChildrenReceptor = {
  children: ReactNode
}

export default function TextareaField({ children }: ChildrenReceptor) {
  const { Text, setText } = useTextareaFieldState()

  useEffect(() => {
    const saved = LoadAndDeleteLocalStorage("note")
    if (saved !== "") setText(saved)
  }, [])

  const underneath = useMemo(() =>
    Children.toArray(children).find((child) =>
      isValidElement(child) && child.type === TextareaField.Underneath
    ), [children]
  )

  const right = useMemo(() =>
    Children.toArray(children).find((child) =>
      isValidElement(child) && child.type === TextareaField.Right
    ), [children]
  )

  return (
    <div className="container py-4 lg:py-6 w-full gap-x-4 lg:gap-x-8 gap-y-4 grid grid-cols-12">
      <Label
        htmlFor="content"
        className='col-span-12'
      >
        Text content
      </Label>
      <div className="flex flex-wrap gap-2 lg:hidden col-span-12">
        {right}
      </div>
      <Textarea
        placeholder="Type or paste something"
        className="min-h-[18rem] h-40 max-h-60 col-span-12 lg:col-span-10"
        id='content'
        onChange={e => setText(e.currentTarget.value)}
        value={Text}
      />
      <div className="hidden lg:flex flex-col gap-3 col-span-2">
        {right}
      </div>
      {underneath &&
        <div className="flex flex-wrap gap-2 lg:gap-3 col-span-12">
          {underneath}
        </div>
      }
      <div className="flex flex-col gap-2 col-span-12 text-sm">
        <p>
          Characters: {Text.length}
        </p>
        <p>
          Words: {WordCount(Text)}
        </p>
        <p>
          Lines: {LineCount(Text)}
        </p>
      </div>
    </div>
  )
}

TextareaField.Right = ({ children }: ChildrenReceptor) => children
TextareaField.Underneath = ({ children }: ChildrenReceptor) => children

type TextContextProps = {
  Text: string,
  setText: Dispatch<SetStateAction<string>>

}

const TextContext = createContext<TextContextProps>({
  Text: "",
  setText: () => { },
});

export function useTextareaFieldState() {
  return useContext(TextContext);
}

export const TextareaFieldProvider = ({ children }: ChildrenReceptor) => {
  const [Text, setText] = useState<string>("");

  return (
    <TextContext.Provider value={{ Text, setText }}>
      {children}
    </TextContext.Provider>
  );
};
