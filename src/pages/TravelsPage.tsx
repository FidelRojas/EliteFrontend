import React, { useState } from "react"

import { client } from "../utils/client"
import { TRAVEL_PATH } from "../constants/endpointsConstants"
import { CustomTable } from "../components/common/CustomTable"
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { Travel } from "../interfaces/travel.interface"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../constants/constansts"
import { useCustomTable } from "../hooks/useCustomTable"
import { useDialog } from "../context/dialog"
import TravelForm from "../components/Travel/TravelForm"

interface TravelsResponse {
  data: Travel[]
  total: number
}

export const TravelsPage = () => {
  const fetchData = async (params) => {
    const { data } = await client.get<TravelsResponse>(TRAVEL_PATH, {
      params,
    })
    return data
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const tableState = useCustomTable(fetchData)
  const showDialog = useDialog()

  const handleOpen = (travel: Travel = null) => {
    setInitialData(travel)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }

  const handleCreateTravel = async (newTravel: Travel) => {
    try {
      const {
        data: { message, data: travel },
      } = await client.post(TRAVEL_PATH, newTravel)

      setInitialData(newTravel)
      tableState.setData([...tableState.data, travel])
      tableState.setTotal(tableState.total + 1)
      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleUpdateTravel = async (updateTravel: Travel) => {
    try {
      const {
        data: { message, data: travel },
      } = await client.put(`${TRAVEL_PATH}/${updateTravel?.id}`, updateTravel)

      const listUpdate = tableState.data.map((item) =>
        item.id === travel.id ? travel : item,
      )

      tableState.setData(listUpdate)

      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || DEFAULT_ERROR)
    }
  }

  const handleDelete = async (travel: Travel = null) => {
    showDialog({
      title: "Eliminar Viaje",
      body: `¿Deseas eliminar el viaje del camión "${travel.truckId}"?`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        client
          .delete(`${TRAVEL_PATH}/${travel.id}`)
          .then(() => {
            const newList = tableState.data.filter(
              (_travel) => _travel.id !== travel.id,
            )
            tableState.setData(newList)
            tableState.setTotal(tableState.total - 1)

            toast.success("Viaje eliminado")
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || DEFAULT_ERROR)
          })
      },
    })
  }

  const fields = [
    { value: "truck.plate", label: "Camion" },
    { value: "fromCity.name", label: "Origen" },
    { value: "toCity.name", label: "Destino" },
    { value: "notes", label: "Notas", includeInSearch: true },
    {
      value: "action",
      label: "Acciones",
      enableSort: true,
      content: (row: Travel) => (
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
          <Typography variant="h3">Viajes</Typography>
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
      {modalOpen && (
        <TravelForm
          open={modalOpen}
          onClose={handleClose}
          onSubmit={initialData ? handleUpdateTravel : handleCreateTravel}
          initialData={initialData}
        />
      )}
    </>
  )
}
