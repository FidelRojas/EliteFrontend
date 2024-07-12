import { Outlet } from "react-router-dom"
import { Suspense } from "react"
import { CircularProgress } from "@mui/material"
import React from "react"
import Header from "./Header"

export default function Layout() {
  return (
    <>
      <Header />
      <Suspense fallback={<CircularProgress />}>
        <Outlet />
      </Suspense>
    </>
  )
}
