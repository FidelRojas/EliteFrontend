// Login.tsx

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  TextField,
  Button,
  Grid,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material"
import { useForm } from "react-hook-form"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { client } from "../utils/client"
import { LOGIN_PATH } from "../../constants/endpointsConstants"

interface LoginForm {
  username: string
  password: string
}
const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: LoginForm) => {
    const {
      data: { token },
    } = await client.post(LOGIN_PATH, {
      userName: data.username,
      password: data.password,
    })
    window.localStorage.setItem("token", token)

    navigate("/")
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
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Ingresar
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  )
}

export default Login
