import React, { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
  Paper,
} from "@mui/material"
import SearchForm, { SearchFormData } from "./SearchForm"
import { TableRowsLoader } from "../Layout/TableRowsLoader"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../../constants/constansts"

interface CustomTableProps {
  fields: {
    value: string
    label: string
  }[]
  fetchData: (data) => Promise<any>
}

export const CustomTable = ({ fields, fetchData }: CustomTableProps) => {
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [orderBy, setOrderBy] = useState("")
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState("")
  const [data, setData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        setIsLoading(true)
        const { data, total } = await fetchData({
          order,
          orderBy,
          page,
          rowsPerPage,
          search,
          searchBy,
        })
        setData(data ?? [])
        setTotal(total ?? 0)
      } catch (error) {
        toast.error(error?.response?.data?.message ?? DEFAULT_ERROR)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
  }, [
    order,
    orderBy,
    page,
    rowsPerPage,
    search,
    searchBy,
    setIsLoading,
    setData,
    toast,
  ])

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSearchChange = (data: SearchFormData) => {
    setSearch(data.search)
    setSearchBy(data.field)
    setPage(0)
  }

  return (
    <>
      <SearchForm
        fields={fields}
        onSubmit={handleSearchChange}
        isLoading={isLoading}
      />
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              {fields.map((field) => (
                <TableCell
                  key={field.value}
                  sortDirection={orderBy === field.value ? order : false}
                >
                  <TableSortLabel
                    active={orderBy === field.value}
                    direction={orderBy === field.value ? order : "asc"}
                    onClick={() => handleRequestSort(field.value)}
                  >
                    {field.label}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRowsLoader
                rowsNum={rowsPerPage}
                columsNum={fields.length}
              />
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell align="center" colSpan={fields.length}>
                  Tabla vacía
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {fields.map((field) => (
                    <TableCell key={field.value}>{row[field.value]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50]}
        component="div"
        count={total}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
      />
    </>
  )
}
