import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { City } from "../interfaces/city.interface"
import { client } from "../utils/client"
import { CITY_PATH } from "../constants/endpointsConstants"
import { AppThunk } from "./store"

interface CitiesState {
  cities: City[]
  loading: boolean
  error: string | null
}

const initialState: CitiesState = {
  cities: [],
  loading: false,
  error: null,
}
const citiesSlice = createSlice({
  name: "cities",
  initialState,
  reducers: {
    fetchCitiesStart(state) {
      state.loading = true
      state.error = null
    },
    fetchCitiesSuccess(state, action: PayloadAction<City[]>) {
      state.loading = false
      state.cities = action.payload
    },
    fetchCitiesFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
})
export const { fetchCitiesStart, fetchCitiesSuccess, fetchCitiesFailure } =
  citiesSlice.actions

export const selectAllCities = (state: { cities: CitiesState }) =>
  state.cities.cities
export const selectCitiesLoading = (state: { cities: CitiesState }) =>
  state.cities.loading
export const selectCitiesError = (state: { cities: CitiesState }) =>
  state.cities.error

export const fetchCities = (): AppThunk => async (dispatch) => {
  dispatch(fetchCitiesStart())
  try {
    const { data } = await client.get(CITY_PATH)

    dispatch(fetchCitiesSuccess(data?.data))
  } catch (error) {
    dispatch(fetchCitiesFailure(error.message))
  }
}

export default citiesSlice.reducer
