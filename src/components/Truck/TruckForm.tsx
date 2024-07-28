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
import { Truck } from "../../interfaces/truck.interface"
import { LoadingButton } from "@mui/lab"
import { stopPropagate } from "../../utils/utils"
const defaultValues = {
  plate: "",
  brand: "",
  year: 2010,
  type: "",
  notes: "",
}
const TruckForm = ({ open, onClose, onSubmit, initialData, action }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<Truck>({
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
      onSubmit={stopPropagate(handleSubmit(_onSubmit))}
    >
      <DialogTitle>{`${action} Camión`}</DialogTitle>
      <DialogContent>
        <Controller
          name="plate"
          control={control}
          rules={{
            required: "Placa requerida",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              required
              error={!!errors.plate}
              helperText={errors.plate?.message}
              label="Placa"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Marca" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="year"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Año"
              type="number"
              fullWidth
              margin="normal"
            />
          )}
        />
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Tipo" fullWidth margin="normal" />
          )}
        />
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Notas" fullWidth margin="normal" />
          )}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
          {action}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

export default TruckForm
