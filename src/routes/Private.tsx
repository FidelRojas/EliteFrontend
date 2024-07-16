import React from "react"
import { useEffect } from "react"
import { useNavigate, Outlet, Navigate } from "react-router-dom"

const PrivateRoute = ({ isAuth, ...rest }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuth) {
      navigate("/login", { replace: true })
    }
  }, [isAuth, navigate])

  return isAuth ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute
