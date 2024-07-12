import { Navigate } from "react-router-dom"
import Login from "../pages/Login"
import React from "react"

export default function PublicRoutes() {
  return [
    { path: "/login", element: <Login /> },
    { path: "*", element: <Navigate to="/login" replace /> },
  ]
}
