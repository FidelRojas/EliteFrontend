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
} from "@mui/material"
import { Travel } from "../../interfaces/travel.interface"
import { LoadingButton } from "@mui/lab"
const defaultValues = {
  truckId: null,
  form: null,
  to: null,
  notes: "",
  departureDate: null,
  arrivalDate: null,
}

import { useAppDispatch } from "../../redux/store"
import { TruckAutoCompleate } from "../Truck/TruckAutoCompleate"
import { CityAutoCompleate } from "../City/CityAutoCompleate"
import { stopPropagate } from "../../utils/utils"
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs from "dayjs"

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

  useEffect(() => {
    reset(initialData)
  }, [initialData, reset])

  const _onSubmit = async (data) => {
    const newData = {
      ...data,
      truckId: data?.truck?.id,
      from: data?.fromCity?.id,
      to: data?.toCity?.id,
    }
    await onSubmit(newData)
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
      onSubmit={stopPropagate(handleSubmit(_onSubmit))}
    >
      <DialogTitle>{initialData ? "Editar Viaje" : "Añadir Viaje"}</DialogTitle>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl fullWidth variant="outlined" margin="normal">
            <Controller
              name="truck"
              control={control}
              rules={{
                required: "Camión requerido",
              }}
              render={({ field }) => (
                <TruckAutoCompleate
                  value={field.value}
                  setValue={field.onChange}
                  error={!!errors?.truck}
                  helperText={errors?.truck?.message}
                />
              )}
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" margin="normal">
            <Controller
              name="fromCity"
              control={control}
              rules={{
                required: "Oigen requerido",
              }}
              render={({ field }) => (
                <CityAutoCompleate
                  value={field.value}
                  label="Ciudad Origen"
                  setValue={field.onChange}
                  error={!!errors?.fromCity}
                  helperText={errors?.fromCity?.message}
                />
              )}
            />
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <Controller
              name="toCity"
              control={control}
              rules={{
                required: "Destino requerido",
              }}
              render={({ field }) => (
                <CityAutoCompleate
                  value={field.value}
                  setValue={field.onChange}
                  label="Ciudad Destino"
                  error={!!errors?.toCity}
                  helperText={errors?.toCity?.message}
                />
              )}
            />
          </FormControl>
          <Controller
            control={control}
            name="departureDate"
            render={({ field }) => (
              <DateTimePicker
                onChange={(date) => field.onChange(date)}
                defaultValue={field.value ? dayjs(field.value) : null}
                label="Fecha de Salida"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { marginTop: 1 },
                    variant: "outlined",
                    error: !!errors.departureDate,
                    helperText: errors.departureDate?.message,
                  },
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="arrivalDate"
            render={({ field }) => (
              <DateTimePicker
                onChange={(date) => field.onChange(date)}
                defaultValue={field.value ? dayjs(field.value) : null}
                label="Fecha de Llegada"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: { marginTop: 1 },
                    variant: "outlined",
                    error: !!errors.arrivalDate,
                    helperText: errors.arrivalDate?.message,
                  },
                }}
              />
            )}
          />

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
        </LocalizationProvider>
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
