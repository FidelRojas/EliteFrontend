import { combineReducers } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import userReducer from "./userSlice"
import truckReducer from "./truckSlice"
import cityReducer from "./citySlice"

export const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  trucks: truckReducer,
  cities: cityReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export default rootReducer
