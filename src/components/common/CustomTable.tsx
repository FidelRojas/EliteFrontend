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
  Grid,
} from "@mui/material"
import SearchForm, { SearchFormData } from "./SearchForm"
import { TableRowsLoader } from "../Layout/TableRowsLoader"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../../constants/constansts"
import { useCustomTableType } from "../../hooks/useCustomTable"

interface CustomTableProps {
  fields: {
    value: string
    label: string
    includeInSearch?: boolean
    enableSort?: boolean
    content?: (rowsPerPage) => React.ReactNode
  }[]
  tableState: useCustomTableType
}

export const CustomTable = ({
  fields,
  tableState: {
    data,
    order,
    orderBy,
    page,
    total,
    rowsPerPage,
    isLoading,
    setOrder,
    setOrderBy,
    setPage,
    setRowsPerPage,
    setSearch,
    setSearchBy,
  },
}: CustomTableProps) => {
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
                    disabled={field.enableSort}
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
                  {fields.map((field) => {
                    const keys = field.value.split(".")
                    let result = row
                    for (const key of keys) {
                      result = result ? result[key] : ""
                    }
                    return (
                      <TableCell key={field.value}>
                        {field.content ? field.content(row) : result}
                      </TableCell>
                    )
                  })}
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
