import React from "react"

import { client } from "../utils/client"
import { TRUNK_PATH } from "../constants/endpointsConstants"
import { Truck } from "../models/models"
import { CustomTable } from "../components/common/CustomTable"
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

interface TrucksResponse {
  data: Truck[]
  total: number
}

export const TrucksPage = () => {
  const fields = [
    { value: "plate", label: "Placa" },
    { value: "brand", label: "Marca" },
    { value: "year", label: "Año" },
    { value: "type", label: "Tipo" },
    { value: "notes", label: "Notas" },
    {
      value: "action",
      label: "Acciones",
      enableSort: true,
      content: (
        <Stack direction="row" spacing={1}>
          <IconButton color="primary">
            <EditIcon />
          </IconButton>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Stack>
      ),
    },
  ]

  const fetchData = async (params) => {
    const { data } = await client.get<TrucksResponse>(TRUNK_PATH, {
      params,
    })
    return data
  }

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
          <Button fullWidth variant="contained" endIcon={<AddIcon />}>
            Añadir
          </Button>
        </Grid>
      </Grid>
      <CustomTable fields={fields} fetchData={fetchData} />
    </>
  )
}
