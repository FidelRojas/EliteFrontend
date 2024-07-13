import { LoadingButton } from "@mui/lab"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { client } from "../../utils/client"
import { CHANGE_PASSWORD_PATH } from "../../constants/endpointsConstants"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../../constants/constansts"
interface ResetPassForm {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ChangePassword = ({ open, onClose }) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPassForm>({ mode: "onBlur" })

  const [showOldPass, setShowOldPass] = useState(false)
  const [showNewPass, setShowNewPass] = useState(false)
  const [showConfirmPass, setShowConfirmPass] = useState(false)

  const handleCloseModal = () => {
    reset()
    onClose()
  }

  const handleChangePassword = async (data: ResetPassForm) => {
    try {
      const {
        data: { message },
      } = await client.post(CHANGE_PASSWORD_PATH, data)
      toast.success(message)
      handleCloseModal()
    } catch (error) {
      toast.error(error?.response?.data?.message ?? DEFAULT_ERROR)
    }
  }

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <form onSubmit={handleSubmit(handleChangePassword)} noValidate>
        <DialogTitle sx={{ textAlign: "center" }}>
          Cambiar Contraseña
        </DialogTitle>
        <DialogContent>
          <Grid sx={{ marginBlock: { sm: "0px", xs: "10px" } }} container>
            <Grid item xs={12}>
              <TextField
                {...register("oldPassword", {
                  required: "Anterior contraseña requerida",
                })}
                required
                label="Anterior contraseña"
                placeholder="Ingrese la contraseña antigua"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.oldPassword}
                helperText={errors.oldPassword?.message}
                type={showNewPass ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPass(!showNewPass)}
                        edge="end"
                      >
                        {showNewPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("newPassword", {
                  required: "Nueva contraseña requerida",
                  minLength: {
                    value: 8,
                    message:
                      "Nueva contraseña tiene que tener almenos 8 caracteres",
                  },
                })}
                label="Nueva contraseña"
                placeholder="Ingrese su nueva contraseña"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.newPassword}
                helperText={errors.newPassword?.message}
                type={showConfirmPass ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPass(!showConfirmPass)}
                        edge="end"
                      >
                        {showConfirmPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...register("confirmPassword", {
                  required: "Confirmación de contraseña requerida",
                  validate: (val: string) => {
                    if (watch("newPassword") != val) {
                      return "Contraseña no conincide"
                    }
                  },
                })}
                label="Confirmar contraseña"
                placeholder="Repita la nueva contraseña"
                variant="outlined"
                fullWidth
                margin="normal"
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                type={showOldPass ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowOldPass(!showOldPass)}
                        edge="end"
                      >
                        {showOldPass ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
          >
            Cambiar
          </LoadingButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default ChangePassword
