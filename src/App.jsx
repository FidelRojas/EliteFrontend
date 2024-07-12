import { RouterProvider, createBrowserRouter } from "react-router-dom"
import "./App.css"
import PrivateRoutes from "./routes/Private"
import PublicRoutes from "./routes/Public"
import { validateToken } from "./utils/auth"
function App() {
  const router = createBrowserRouter([
    validateToken() ? PrivateRoutes() : {},
    ...PublicRoutes(),
  ])
  return <RouterProvider router={router} />
}

export default App
