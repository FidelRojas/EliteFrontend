import React, { useEffect, useState } from "react"
import CityForm from "../City/CityForm"
import { City } from "../../interfaces/city.interface"
import { CITY_PATH } from "../../constants/endpointsConstants"
import { client } from "../../utils/client"
import { toast } from "react-toastify"
import {
  Autocomplete,
  Box,
  createFilterOptions,
  TextField,
} from "@mui/material"

const filter = createFilterOptions<CityOptionType>()

export const CityAutoCompleate = ({
  value,
  setValue,
  helperText = "",
  label = "Ciudad",
  error = false,
  margin = false,
}) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const [cities, setCities] = useState([])

  const fetchData = async () => {
    const { data } = await client.get(CITY_PATH)
    setCities(data.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }
  const handleCreateCity = async (newCity: City) => {
    try {
      const {
        data: { message, data: city },
      } = await client.post(CITY_PATH, newCity)

      setValue(city)
      toast.success(message)
      handleClose()
      return
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <Box sx={margin ? { marginTop: 3, marginBottom: 2 } : {}}>
      <CityForm
        action="Añadir"
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleCreateCity}
        initialData={initialData}
      />
      <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          if (typeof newValue === "string") {
            setTimeout(() => {
              setModalOpen(true)
              setInitialData({
                name: newValue,
              })
            })
          } else if (newValue && newValue.inputValue) {
            setModalOpen(true)
            setInitialData({
              name: newValue.inputValue,
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
              name: `Añadir "${params.inputValue}"`,
            })
          }

          return filtered
        }}
        options={cities}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option
          }
          if (option.inputValue) {
            return option.inputValue
          }
          return option.name
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        renderOption={(props, option) => {
          const { key, ...optionProps } = props
          return (
            <li key={option.name || key} {...optionProps}>
              {option.name}
            </li>
          )
        }}
        fullWidth
        freeSolo
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={error}
            helperText={helperText}
          />
        )}
      />
    </Box>
  )
}

interface CityOptionType {
  inputValue?: string
  name: string
}
