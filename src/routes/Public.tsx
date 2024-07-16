import React from "react"
import { useEffect } from "react"
import { useNavigate, Outlet, Navigate } from "react-router-dom"

const PublicRoute = ({ isAuth, ...rest }) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuth) {
      navigate("/", { replace: true })
    }
  }, [isAuth, navigate])

  return !isAuth ? <Outlet /> : <Navigate to="/" />
}

export default PublicRoute
