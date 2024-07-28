import React, { useState } from "react"
import { client } from "../utils/client"
import { EXPENSE_PATH } from "../constants/endpointsConstants"
import { CustomTable } from "../components/common/CustomTable"
import { Button, Grid, IconButton, Stack, Typography } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { Expense } from "../interfaces/expense.interface"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../constants/constansts"
import { useCustomTable } from "../hooks/useCustomTable"
import { useDialog } from "../context/dialog"
import ExpenseForm from "../components/Expense/ExpenseForm"
import moment from "moment"

interface ExpensesResponse {
  data: Expense[]
  total: number
}

export const ExpensesPage = () => {
  const fetchData = async (params) => {
    const { data } = await client.get<ExpensesResponse>(EXPENSE_PATH, {
      params,
    })
    return data
  }
  const [modalOpen, setModalOpen] = useState(false)
  const [initialData, setInitialData] = useState(null)
  const tableState = useCustomTable(fetchData)
  const showDialog = useDialog()

  const handleOpen = (expense: Expense = null) => {
    setInitialData(expense)
    setModalOpen(true)
  }

  const handleClose = () => {
    setModalOpen(false)
    setInitialData(null)
  }

  const handleCreateExpense = async (newExpense: Expense) => {
    try {
      const {
        data: { message, data: expense },
      } = await client.post(EXPENSE_PATH, newExpense)

      setInitialData(newExpense)
      tableState.setData([...tableState.data, expense])
      tableState.setTotal(tableState.total + 1)
      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }

  const handleUpdateExpense = async (updateExpense: Expense) => {
    try {
      const {
        data: { message, data: expense },
      } = await client.put(
        `${EXPENSE_PATH}/${updateExpense?.id}`,
        updateExpense,
      )

      const listUpdate = tableState.data.map((item) =>
        item.id === expense.id ? expense : item,
      )

      tableState.setData(listUpdate)

      toast.success(message)
      handleClose()
    } catch (error) {
      toast.error(error?.response?.data?.message || DEFAULT_ERROR)
    }
  }

  const handleDelete = async (expense: Expense = null) => {
    showDialog({
      title: "Eliminar Gasto",
      body: `¿Deseas eliminar la gasto "${expense.detail}"?`,
      confirmLabel: "Eliminar",
      cancelLabel: "Cancelar",
      onConfirm: () => {
        client
          .delete(`${EXPENSE_PATH}/${expense.id}`)
          .then(() => {
            const newList = tableState.data.filter(
              (_expense) => _expense.id !== expense.id,
            )
            tableState.setData(newList)
            tableState.setTotal(tableState.total - 1)

            toast.success("Gasto eliminado")
          })
          .catch((error) => {
            toast.error(error?.response?.data?.message || DEFAULT_ERROR)
          })
      },
    })
  }

  const fields = [
    {
      value: "date",
      label: "Fecha",
      content: (row: Expense) => moment(row.date).format("DD-MM-YYYY"),
    },
    { value: "detail", label: "Detalle", includeInSearch: true },
    { value: "from", label: "Origen", includeInSearch: true },
    { value: "to", label: "Destino", includeInSearch: true },
    { value: "amountBs", label: "Bs" },
    { value: "amountSus", label: "Sus" },
    { value: "truck.plate", label: "Camión" },
    { value: "category.name", label: "Categoría" },
    { value: "notes", label: "Notas", includeInSearch: true },

    {
      value: "action",
      label: "Acciones",
      enableSort: true,
      content: (row: Expense) => (
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
          <Typography variant="h3">Gastos</Typography>
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
      <ExpenseForm
        open={modalOpen}
        onClose={handleClose}
        onSubmit={initialData ? handleUpdateExpense : handleCreateExpense}
        initialData={initialData}
      />
    </>
  )
}
