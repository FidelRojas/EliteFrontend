import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import "react-toastify/dist/ReactToastify.css"

import PublicRoute from "./routes/Public"
import { ToastContainer } from "react-toastify"

import { AppContextProvider } from "./context/index"
import { useSelector } from "react-redux"
import { RootState } from "./redux/rootReducer"
import React from "react"
import Login from "./pages/Login"
import PrivateRoute from "./routes/Private"
import { TrucksPage } from "./pages/TrucksPage"
import Layout from "./components/Layout/Layout"

function App() {
  const isLoggedIn = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  )

  const router = createBrowserRouter([
    {
      path: "/login",
      element: <PublicRoute isAuth={isLoggedIn} />,
      children: [
        {
          index: true,
          element: <Login />,
        },
      ],
    },
    {
      path: "/",
      element: <PrivateRoute isAuth={isLoggedIn} />,
      children: [
        {
          path: "/",
          element: <Layout />,
          children: [
            {
              index: true,
              element: <TrucksPage />,
            },
            {
              path: "trucks",
              element: <TrucksPage />,
            },
          ],
        },
      ],
    },
  ])

  return (
    <>
      <AppContextProvider>
        <ToastContainer />
        <RouterProvider router={router} />
      </AppContextProvider>
    </>
  )
}

export default App
