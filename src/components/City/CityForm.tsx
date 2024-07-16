import React from "react"
import { useForm, Controller } from "react-hook-form"
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material"
import { City } from "../../interfaces/city.interface"
import { LoadingButton } from "@mui/lab"
const defaultValues = {
  name: "",
}
const CityForm = ({ open, onClose, onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<City>({
    values: initialData || defaultValues,
  })

  React.useEffect(() => {
    reset(initialData)
  }, [initialData, reset])

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
      <DialogTitle>
        {initialData ? "Editar Ciudad" : "Añadir Ciudad"}
      </DialogTitle>
      <DialogContent>
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Nombre requerido",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors.name}
              helperText={errors.name?.message}
              label="Nombre"
              fullWidth
              margin="normal"
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

export default CityForm
