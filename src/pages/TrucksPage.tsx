import React from "react"

import { client } from "../utils/client"
import { TRUNK_PATH } from "../constants/endpointsConstants"
import { Truck } from "../models/models"
import { CustomTable } from "../components/common/CustomTable"
import { Typography } from "@mui/material"

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
  ]

  const fetchData = async (params) => {
    const { data } = await client.get<TrucksResponse>(TRUNK_PATH, {
      params,
    })
    return data
  }

  return (
    <>
      <Typography variant="h3" marginBottom={4}>
        Camiones
      </Typography>
      <CustomTable fields={fields} fetchData={fetchData} />
    </>
  )
}
