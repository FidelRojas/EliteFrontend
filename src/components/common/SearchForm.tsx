import React from "react"
import { useForm, Controller } from "react-hook-form"
import { TextField, MenuItem, Button, Grid, Paper } from "@mui/material"
import { LoadingButton } from "@mui/lab"

interface SearchFormProps {
  onSubmit: (data: SearchFormData) => void
  fields: {
    value: string
    label: string
  }[]
  isLoading: boolean
}

export interface SearchFormData {
  search: string
  field: string
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSubmit,
  fields,
  isLoading,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SearchFormData>()
  const searchField = watch("search", "")

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Controller
            name="search"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                label="Buscar"
                variant="outlined"
                fullWidth
                error={!!errors.search}
                helperText={errors.search ? errors.search.message : ""}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Controller
            name="field"
            control={control}
            defaultValue={""}
            rules={{
              validate: (value) => {
                if (searchField && !value) {
                  return "Este campo es requerido para buscar"
                }
                return true
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                size="small"
                select
                label="Buscar por"
                variant="outlined"
                fullWidth
                error={!!errors.field}
                helperText={errors.field ? errors.field.message : ""}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {fields.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            loading={isLoading}
          >
            Search
          </LoadingButton>
        </Grid>
      </Grid>
    </form>
  )
}

export default SearchForm
