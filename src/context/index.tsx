import { FC } from "react"
import DialogProvider from "./dialog"
import { combineComponents } from "./combineComponents"

const providers: FC[] = [DialogProvider as React.FC]

export const AppContextProvider = combineComponents(...providers)
