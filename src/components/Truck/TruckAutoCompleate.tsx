import React, { useEffect, useState } from "react"
import TruckForm from "./TruckForm"
import { Truck } from "../../interfaces/truck.interface"
import { TRUCK_PATH } from "../../constants/endpointsConstants"
import { client } from "../../utils/client"
import { toast } from "react-toastify"
import {
  Autocomplete,
  Box,
  createFilterOptions,
  TextField,
} from "@mui/material"
import { useSelector } from "react-redux"
import { fetchTrucks, selectAllTrucks } from "../../redux/truckSlice"
import { useAppDispatch } from "../../redux/store"

const filter = createFilterOptions<TruckOptionType>()

export const TruckAutoCompleate = ({ value, setValue }) => {
  //   const [value, setValue] = React.useState<TruckOptionType | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)

  const trucks = useSelector(selectAllTrucks) as readonly TruckOptionType[]

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTrucks())
  }, [dispatch])

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }
  const handleCreateTruck = async (newTruck: Truck) => {
    try {
      const {
        data: { message, data: truck },
      } = await client.post(TRUCK_PATH, newTruck)

      setValue(truck)
      toast.success(message)
      handleClose()
      return
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <Box sx={{ marginTop: 3, marginBottom: 2 }}>
      <TruckForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleCreateTruck}
        initialData={initialData}
        action="Añadir"
      />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            // timeout to avoid instant validation of the dialog's form.
            setTimeout(() => {
              setModalOpen(true)
              setInitialData({
                plate: newValue,
                brand: "",
                year: 2010,
                type: "",
                notes: "",
              })
            })
          } else if (newValue && newValue.inputValue) {
            setModalOpen(true)
            setInitialData({
              plate: newValue.inputValue,
              brand: "",
              year: 2010,
              type: "",
              notes: "",
            })
          } else {
            setValue(newValue)
          }
        }}
        filterOptions={(options, params) => {
          const filtered = filter(options, params)

          if (params.inputValue !== "") {
            filtered.push({
              inputValue: params.inputValue,
              plate: `Añadir "${params.inputValue}"`,
            })
          }

          return filtered
        }}
        options={trucks}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option
          }
          if (option.inputValue) {
            return option.inputValue
          }
          return option.plate
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => {
          const { key, ...optionProps } = props
          return (
            <li key={option.plate || key} {...optionProps}>
              {option.plate}
            </li>
          )
        }}
        fullWidth
        freeSolo
        renderInput={(params) => <TextField {...params} label="Placa Camión" />}
      />
    </Box>
  )
}

interface TruckOptionType {
  inputValue?: string
  plate: string
}
