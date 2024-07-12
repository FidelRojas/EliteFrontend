// Header.tsx

import React from "react"
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const Header: React.FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Elite
        </Typography>
        <IconButton color="inherit" onClick={handleLogout}>
          <ExitToAppIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  )
}

export default Header
