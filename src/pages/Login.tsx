// Login.tsx

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  TextField,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material"
import LoadingButton from "@mui/lab/LoadingButton"
import { useForm } from "react-hook-form"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { client } from "../utils/client"
import { LOGIN_PATH, USER_PATH } from "../constants/endpointsConstants"
import { useAppDispatch } from "../redux/store"
import { saveToken, setAuthState } from "../redux/authSlice"
import { setUser } from "../redux/userSlice"
import { decodeToken } from "../utils/auth"
import axios from "axios"

interface LoginForm {
  username: string
  password: string
}
const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>()
  const dispatch = useAppDispatch()

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const onSubmit = async (data: LoginForm) => {
    try {
      setErrorMessage("")
      const {
        data: { token },
      } = await axios.post(`${import.meta.env.VITE_API_URL}/${LOGIN_PATH}`, {
        userName: data.username,
        password: data.password,
      })

      const { id } = decodeToken(token)
      dispatch(saveToken(token))

      const { data: resp } = await client.get(`${USER_PATH}/${id}`)

      dispatch(setUser(resp?.data))
      dispatch(setAuthState(true))
      navigate("/")
    } catch (error) {
      setErrorMessage(error?.response?.data?.message ?? "Algo no salio bien")
    }
  }

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ height: "100vh" }}
    >
      <Grid item xs={10} sm={6} md={4}>
        <Paper elevation={3} style={{ padding: 20 }}>
          <Typography variant="h5" gutterBottom>
            Iniciar Sesión
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              {...register("username", {
                required: "Se requiere usuario",
              })}
              label="Usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.username}
              helperText={errors.username?.message}
              inputProps={{
                autoCapitalize: "none",
              }}
            />
            <TextField
              {...register("password", {
                required: "Se requiere contraseña",
              })}
              label="Contraseña"
              variant="outlined"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
              type={showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {errorMessage && (
              <Alert sx={{ marginBottom: 1 }} severity="error">
                {errorMessage}
              </Alert>
            )}
            <LoadingButton
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              loading={isSubmitting}
            >
              Ingresar
            </LoadingButton>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Login
