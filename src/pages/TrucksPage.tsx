import React, { useState } from "react"

import { client } from "../utils/client"
import { TRUCK_PATH } from "../constants/endpointsConstants"
import { CustomTable } from "../components/common/CustomTable"
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { Truck } from "../interfaces/truck.interface"
import TruckForm from "../components/Truck/TruckForm"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../constants/constansts"
import { useCustomTable } from "../hooks/useCustomTable"
import { useDialog } from "../context/dialog"

interface TrucksResponse {
  data: Truck[]
  total: number
}

export const TrucksPage = () => {
  const fetchData = async (params) => {
    const { data } = await client.get<TrucksResponse>(TRUCK_PATH, {
      params,
    })
    return data
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const tableState = useCustomTable(fetchData)
  const showDialog = useDialog()

  const handleOpen = (truck: Truck = null) => {
    setInitialData(truck)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }

  const handleCreateTruck = async (newTruck: Truck) => {
    try {
      const {
        data: { message, data: truck },
      } = await client.post(TRUCK_PATH, newTruck)

      setInitialData(newTruck)
      tableState.setData([...tableState.data, truck])
      tableState.setTotal(tableState.total + 1)
      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleUpdateTruck = async (updateTruck: Truck) => {
    try {
      const {
        data: { message, data: truck },
      } = await client.put(`${TRUCK_PATH}/${updateTruck?.id}`, updateTruck)

      const listUpdate = tableState.data.map((item) =>
        item.id === truck.id ? truck : item,
      )

      tableState.setData(listUpdate)

      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || DEFAULT_ERROR)
    }
  }

  const handleDelete = async (truck: Truck = null) => {
    showDialog({
      title: "Eliminar camión",
      body: `¿Deseas eliminar el camión con placa "${truck.plate}"?`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        client
          .delete(`${TRUCK_PATH}/${truck.id}`)
          .then(() => {
            const newList = tableState.data.filter(
              (_truck) => _truck.id !== truck.id,
            )
            tableState.setData(newList)
            tableState.setTotal(tableState.total - 1)

            toast.success("Camión eliminado")
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || DEFAULT_ERROR)
          })
      },
    })
  }

  const fields = [
    { value: "plate", label: "Placa", includeInSearch: true },
    { value: "brand", label: "Marca", includeInSearch: true },
    { value: "year", label: "Año", includeInSearch: true },
    { value: "type", label: "Tipo", includeInSearch: true },
    { value: "notes", label: "Notas", includeInSearch: true },
    {
      value: "action",
      label: "Acciones",
      enableSort: true,
      content: (row: Truck) => (
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
          <Typography variant="h3">Camiones</Typography>
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
      <TruckForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={initialData ? handleUpdateTruck : handleCreateTruck}
        initialData={initialData}
      />
    </>
  )
}
