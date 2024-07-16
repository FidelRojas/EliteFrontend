import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import userReducer from "./userSlice"
import truckReducer from "./truckSlice"

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  trucks: truckReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
