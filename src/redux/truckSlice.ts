import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Truck } from "../interfaces/truck.interface"
import { client } from "../utils/client"
import { TRUCK_PATH } from "../constants/endpointsConstants"
import { AppThunk } from "./store"

interface TrucksState {
  trucks: Truck[]
  loading: boolean
  error: string | null
}

const initialState: TrucksState = {
  trucks: [],
  loading: false,
  error: null,
}
const trucksSlice = createSlice({
  name: "trucks",
  initialState,
  reducers: {
    fetchTrucksStart(state) {
      state.loading = true
      state.error = null
    },
    fetchTrucksSuccess(state, action: PayloadAction<Truck[]>) {
      state.loading = false
      state.trucks = action.payload
    },
    fetchTrucksFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
})
export const { fetchTrucksStart, fetchTrucksSuccess, fetchTrucksFailure } =
  trucksSlice.actions

export const selectAllTrucks = (state: { trucks: TrucksState }) =>
  state.trucks.trucks
export const selectTrucksLoading = (state: { trucks: TrucksState }) =>
  state.trucks.loading
export const selectTrucksError = (state: { trucks: TrucksState }) =>
  state.trucks.error

export const fetchTrucks = (): AppThunk => async (dispatch) => {
  dispatch(fetchTrucksStart())
  try {
    const { data } = await client.get(TRUCK_PATH)

    dispatch(fetchTrucksSuccess(data?.data))
  } catch (error) {
    dispatch(fetchTrucksFailure(error.message))
  }
}

export default trucksSlice.reducer
