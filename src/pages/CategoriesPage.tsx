import React, { useState } from "react"
import { client } from "../utils/client"
import { CATEGORY_PATH } from "../constants/endpointsConstants"
import { CustomTable } from "../components/common/CustomTable"
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { Category } from "../interfaces/category.interface"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../constants/constansts"
import { useCustomTable } from "../hooks/useCustomTable"
import { useDialog } from "../context/dialog"
import CategoryForm from "../components/Category/CategoryForm"

interface CategoriesResponse {
  data: Category[]
  total: number
}

export const CategoriesPage = () => {
  const fetchData = async (params) => {
    const { data } = await client.get<CategoriesResponse>(CATEGORY_PATH, {
      params,
    })
    return data
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const tableState = useCustomTable(fetchData)
  const showDialog = useDialog()

  const handleOpen = (category: Category = null) => {
    setInitialData(category)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }

  const handleCreateCategory = async (newCategory: Category) => {
    try {
      const {
        data: { message, data: category },
      } = await client.post(CATEGORY_PATH, newCategory)

      setInitialData(newCategory)
      tableState.setData([...tableState.data, category])
      tableState.setTotal(tableState.total + 1)
      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleUpdateCategory = async (updateCategory: Category) => {
    try {
      const {
        data: { message, data: category },
      } = await client.put(
        `${CATEGORY_PATH}/${updateCategory?.id}`,
        updateCategory,
      )

      const listUpdate = tableState.data.map((item) =>
        item.id === category.id ? category : item,
      )

      tableState.setData(listUpdate)

      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || DEFAULT_ERROR)
    }
  }

  const handleDelete = async (category: Category = null) => {
    showDialog({
      title: "Eliminar Categoría",
      body: `¿Deseas eliminar la categoría "${category.name}"?`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        client
          .delete(`${CATEGORY_PATH}/${category.id}`)
          .then(() => {
            const newList = tableState.data.filter(
              (_category) => _category.id !== category.id,
            )
            tableState.setData(newList)
            tableState.setTotal(tableState.total - 1)

            toast.success("Categoría eliminada")
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
      content: (row: Category) => (
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
          <Typography variant="h3">Categorías</Typography>
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
      <CategoryForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={initialData ? handleUpdateCategory : handleCreateCategory}
        initialData={initialData}
        action={initialData ? "Añadir" : "Editar"}
      />
    </>
  )
}
