import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Truck } from "../interfaces/truck.interface"

const trucks = createSlice({
  name: "trucks",
  initialState: [] as Truck[],
  reducers: {
    setTrucks(state, { payload }: PayloadAction<Truck[] | null>) {
      return (state = payload != null ? payload : [])
    },
    updateTruck(state, { payload }: PayloadAction<Truck>) {
      const { id } = payload
      const index = state.findIndex((e) => e.id === id)
      if (index !== -1) {
        state.splice(index, 1, payload)
      }
    },
    addTruck(state, { payload }: PayloadAction<Truck>) {
      return [...state, payload]
    },
  },
})

export const { setTrucks, updateTruck } = trucks.actions

export default trucks.reducer
