import React, { useEffect, useState } from "react"
import CategoryForm from "../Category/CategoryForm"
import { Category } from "../../interfaces/category.interface"
import { CATEGORY_PATH } from "../../constants/endpointsConstants"
import { client } from "../../utils/client"
import { toast } from "react-toastify"
import {
  Autocomplete,
  Box,
  createFilterOptions,
  TextField,
} from "@mui/material"
import { useSelector } from "react-redux"
import { useAppDispatch } from "../../redux/store"

const filter = createFilterOptions<CategoryOptionType>()

export const CategoryAutoCompleate = ({ value, setValue, margin = false }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const [categories, setCategories] = useState([])
  //  as readonly CategoryOptionType[]

  const fetchData = async () => {
    const { data } = await client.get(CATEGORY_PATH)
    setCategories(data.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }
  const handleCreateCategory = async (newCategory: Category) => {
    try {
      const {
        data: { message, data: category },
      } = await client.post(CATEGORY_PATH, newCategory)

      setValue(category)
      toast.success(message)
      handleClose()
      return
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <Box sx={margin ? { marginTop: 3, marginBottom: 2 } : {}}>
      <CategoryForm
        action="Añadir"
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleCreateCategory}
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
        options={categories}
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
        renderInput={(params) => <TextField {...params} label="Categoría" />}
      />
    </Box>
  )
}

interface CategoryOptionType {
  inputValue?: string
  name: string
}
