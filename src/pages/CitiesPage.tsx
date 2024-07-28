import React, { useState } from "react"
import { client } from "../utils/client"
import { CITY_PATH } from "../constants/endpointsConstants"
import { CustomTable } from "../components/common/CustomTable"
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { City } from "../interfaces/city.interface"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../constants/constansts"
import { useCustomTable } from "../hooks/useCustomTable"
import { useDialog } from "../context/dialog"
import CityForm from "../components/City/CityForm"

interface CitiesResponse {
  data: City[]
  total: number
}

export const CitiesPage = () => {
  const fetchData = async (params) => {
    const { data } = await client.get<CitiesResponse>(CITY_PATH, {
      params,
    })
    return data
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const tableState = useCustomTable(fetchData)
  const showDialog = useDialog()

  const handleOpen = (city: City = null) => {
    setInitialData(city)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }

  const handleCreateCity = async (newCity: City) => {
    try {
      const {
        data: { message, data: city },
      } = await client.post(CITY_PATH, newCity)

      setInitialData(newCity)
      tableState.setData([...tableState.data, city])
      tableState.setTotal(tableState.total + 1)
      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleUpdateCity = async (updateCity: City) => {
    try {
      const {
        data: { message, data: city },
      } = await client.put(`${CITY_PATH}/${updateCity?.id}`, updateCity)

      const listUpdate = tableState.data.map((item) =>
        item.id === city.id ? city : item,
      )

      tableState.setData(listUpdate)

      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || DEFAULT_ERROR)
    }
  }

  const handleDelete = async (city: City = null) => {
    showDialog({
      title: "Eliminar Ciudad",
      body: `¿Deseas eliminar la ciudad "${city.name}"?`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        client
          .delete(`${CITY_PATH}/${city.id}`)
          .then(() => {
            const newList = tableState.data.filter(
              (_city) => _city.id !== city.id,
            )
            tableState.setData(newList)
            tableState.setTotal(tableState.total - 1)

            toast.success("Ciudad eliminada")
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || DEFAULT_ERROR)
          })
      },
    })
  }

  const fields = [
    { value: "name", label: "Nombre", includeInSearch: true },
    {
      value: "action",
      label: "Acciones",
      enableSort: true,
      content: (row: City) => (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary" onClick={() => handleOpen(row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(row)}>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ]

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="space-between"
        alignItems="flex-end"
        sx={{ mb: 2 }}
      >
        <Grid item xs={12} sm={10}>
          <Typography variant="h3">Ciudades</Typography>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Button
            fullWidth
            variant="contained"
            endIcon={<AddIcon />}
            onClick={() => handleOpen()}
          >
            Añadir
          </Button>
        </Grid>
      </Grid>
      <CustomTable fields={fields} tableState={tableState} />
      <CityForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={initialData ? handleUpdateCity : handleCreateCity}
        initialData={initialData}
      />
    </>
  )
}
