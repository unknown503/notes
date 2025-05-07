"use client"
import { ChildrenReceptor } from "@/types/common"
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react"

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
  const [Text, setText] = useState("");

  return (
    <TextContext.Provider value={{ Text, setText }}>
      {children}
    </TextContext.Provider>
  );
};
