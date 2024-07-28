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
import { Expense } from "../../interfaces/expense.interface"
import { LoadingButton } from "@mui/lab"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import moment from "moment"
import dayjs from "dayjs"
import { IMaskInput } from "react-imask"
import { TruckAutoCompleate } from "../Truck/TruckAutoCompleate"
import { stopPropagate } from "../../utils/utils"
import { CategoryAutoCompleate } from "../Category/CategoryAutoCompleate"

const defaultValues = {
  date: moment(),
  detail: "",
  from: "",
  to: "",
  amountBs: null,
  amountSus: null,
  categoryId: null,
  truckId: null,
  notes: "",
}

interface CustomProps {
  onChange: (event: { target: { name: string; value: string } }) => void
  name: string
}

const TextMaskBs = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask={"Bs. num"}
        blocks={{
          num: {
            mask: Number,
            thousandsSeparator: " ",
          },
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
        unmask
      />
    )
  },
)

const TextMaskSus = React.forwardRef<HTMLInputElement, CustomProps>(
  function TextMaskCustom(props, ref) {
    const { onChange, ...other } = props
    return (
      <IMaskInput
        {...other}
        mask={"Bs. num"}
        blocks={{
          num: {
            mask: Number,
            thousandsSeparator: " ",
          },
        }}
        inputRef={ref}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
        unmask
      />
    )
  },
)

const ExpenseForm = ({ open, onClose, onSubmit, initialData }) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<Expense>({
    values: initialData
      ? { ...initialData, date: moment(initialData?.date) }
      : defaultValues,
  })

  React.useEffect(() => {
    reset(initialData)
  }, [initialData, reset])

  const _onSubmit = async (data) => {
    const newData: Expense = {
      ...data,
      truckId: data?.truck?.id,
      categoryId: data?.category?.id,
      date: data?.date.toDate(),
      amountBs: parseFloat(data.amountBs),
      amountSus: parseFloat(data.amountSus),
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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DialogTitle>
          {initialData ? "Editar Gasto" : "Añadir Gasto"}
        </DialogTitle>
        <DialogContent>
          <Controller
            control={control}
            rules={{
              required: "Detalle requerida",
            }}
            name="date"
            render={({ field }) => (
              <DatePicker
                onChange={(date) => field.onChange(date)}
                defaultValue={dayjs(field.value as Date)}
                label="Fecha"
                disablePast
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                    sx: { marginTop: 1 },
                    variant: "outlined",
                    error: !!errors.date,
                    helperText: errors.date?.message,
                  },
                }}
              />
            )}
          />
          <Controller
            name="detail"
            control={control}
            rules={{
              required: "Detalle requerida",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                required
                error={!!errors.detail}
                helperText={errors.detail?.message}
                label="Detalle"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="from"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Origen de los fondos"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="to"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Destino de los fondos"
                fullWidth
                margin="normal"
              />
            )}
          />
          <Controller
            name="amountBs"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Monto Bs"
                fullWidth
                margin="normal"
                InputProps={{
                  inputComponent: TextMaskBs as any,
                }}
              />
            )}
          />
          <Controller
            name="amountSus"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Monto Sus"
                fullWidth
                margin="normal"
                InputProps={{
                  inputComponent: TextMaskSus as any,
                }}
              />
            )}
          />

          <Controller
            name="truck"
            control={control}
            render={({ field }) => (
              <TruckAutoCompleate
                value={field.value}
                setValue={field.onChange}
              />
            )}
          />
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <CategoryAutoCompleate
                value={field.value}
                setValue={field.onChange}
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
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <LoadingButton
            loading={isSubmitting}
            type="submit"
            variant="contained"
          >
            {initialData ? "Editar" : "Añadir"}
          </LoadingButton>
        </DialogActions>
      </LocalizationProvider>
    </Dialog>
  )
}

export default ExpenseForm
