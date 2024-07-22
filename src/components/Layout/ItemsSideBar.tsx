import React, { useState } from "react"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import LocalShippingIcon from "@mui/icons-material/LocalShipping"
import VpnKeyIcon from "@mui/icons-material/VpnKey"
import PlaceIcon from "@mui/icons-material/Place"
import RouteIcon from '@mui/icons-material/Route';
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined"
import { useLocation, useNavigate } from "react-router-dom"
import ChangePassword from "../User/ChangePassword"
import { useAppDispatch } from "../../redux/store"
import { clearToken, setAuthState } from "../../redux/authSlice"

const ItemsSideBar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { pathname } = useLocation()

  const [openChangePassword, setOpenChangePassword] = useState(false)
  const handleLogout = () => {
    dispatch(clearToken())
    dispatch(setAuthState(false))
  }
  const FIRST_LIST = [
    { name: "Viajes", icon: <RouteIcon />, to: "/" },
    { name: "Camiones", icon: <LocalShippingIcon />, to: "/trucks" },
    { name: "Ciudades", icon: <PlaceIcon />, to: "/cities" },
  ]
  const SECOND_LIST = [
    {
      name: "Cambiar Contraseña",
      icon: <VpnKeyIcon />,
      action: () => setOpenChangePassword(true),
    },
    {
      name: "Cerrar sesion",
      icon: <ExitToAppOutlinedIcon />,
      action: handleLogout,
    },
  ]
  return (
    <>
      <List>
        {FIRST_LIST.map((item, index) => (
          <ListItem
            disablePadding
            sx={{ display: "block" }}
            key={item.name}
            onClick={() => navigate(item.to)}
          >
            <ListItemButton
              selected={item.to === pathname}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {SECOND_LIST.map((item, index) => (
          <ListItem
            key={item.name}
            disablePadding
            sx={{ display: "block" }}
            onClick={item.action}
          >
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.name}
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <ChangePassword
        open={openChangePassword}
        onClose={() => setOpenChangePassword(false)}
      />
    </>
  )
}

export default ItemsSideBar
