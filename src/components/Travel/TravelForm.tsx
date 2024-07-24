import React, { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material"
import { Travel } from "../../interfaces/travel.interface"
import { LoadingButton } from "@mui/lab"
import { useSelector } from "react-redux"
const defaultValues = {
  truckId: null,
  form: null,
  to: null,
  notes: "",
}
import {
  fetchTrucks,
  selectAllTrucks,
  selectTrucksLoading,
  selectTrucksError,
} from "../../redux/truckSlice"
import { useAppDispatch } from "../../redux/store"
import { fetchCities, selectAllCities } from "../../redux/citySlice"

const TravelForm = ({ open, onClose, onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<Travel>({
    values: initialData || defaultValues,
  })

  const dispatch = useAppDispatch()
  const trucks = useSelector(selectAllTrucks)
  const cities = useSelector(selectAllCities)

  useEffect(() => {
    reset(initialData)
  }, [initialData, reset])

  useEffect(() => {
    dispatch(fetchTrucks())
    dispatch(fetchCities())
  }, [dispatch])

  const _onSubmit = async (data) => {
    await onSubmit(data)
    reset()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        component: "form",
        noValidate: true,
      }}
      onSubmit={handleSubmit(_onSubmit)}
    >
      <DialogTitle>{initialData ? "Editar Viaje" : "Añadir Viaje"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Camión</InputLabel>
          <Controller
            name="truckId"
            control={control}
            rules={{
              required: "Camión requerido",
            }}
            render={({ field }) => (
              <Select
                {...field}
                value={field?.value || ""}
                required
                label="Camión"
                error={!!errors?.truckId} 
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {trucks.map((truck) => (
                  <MenuItem key={truck.id} value={truck.id}>
                    {truck.plate}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText error={!!errors.truckId}>
            {errors.truckId?.message}
          </FormHelperText>
        </FormControl>
        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Origen</InputLabel>
          <Controller
            name="from"
            control={control}
            rules={{
              required: "Oigen requerido",
            }}
            render={({ field }) => (
              <Select
                {...field}
                value={field?.value || ""}
                required
                label="Origen"
                error={!!errors?.from}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText error={!!errors.from}>
            {errors.from?.message}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth variant="outlined" margin="normal">
          <InputLabel>Destino</InputLabel>
          <Controller
            name="to"
            control={control}
            rules={{
              required: "Destino requerido",
            }}
            render={({ field }) => (
              <Select
                {...field}
                value={field?.value || ""}
                required
                label="Destino"
                error={!!errors?.to}
              >
                <MenuItem value="">
                  <em>Ninguno</em>
                </MenuItem>
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText error={!!errors.to}>
            {errors.to?.message}
          </FormHelperText>{" "}
        </FormControl>

        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Notas"
              fullWidth
              margin="normal"
              multiline
              rows={2}
            />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          {initialData ? "Editar" : "Añadir"}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default TravelForm
