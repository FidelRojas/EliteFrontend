import { lazy } from "react"
import { Navigate } from "react-router-dom"
import Layout from "../components/Layout/Layout"
import React from "react"

const Home = lazy(() =>
  import("../pages/TrucksPage").then(({ TrucksPage: Home }) => ({
    default: Home,
  })),
)

export default function PrivateRoutes() {
  return {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  }
}
