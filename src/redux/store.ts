import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit"

import { useDispatch } from "react-redux"
import rootReducer, { RootState } from "./rootReducer"

const store = configureStore({
  reducer: rootReducer,
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
