import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import "react-toastify/dist/ReactToastify.css"

import PrivateRoutes from "./routes/Private"
import PublicRoutes from "./routes/Public"
import { validateToken } from "./utils/auth"
import { ToastContainer } from "react-toastify"
function App() {
  const router = createBrowserRouter([
    validateToken() ? PrivateRoutes() : {},
    ...PublicRoutes(),
    ,
  ])
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  )
}

export default App
