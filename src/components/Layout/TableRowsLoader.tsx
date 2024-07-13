import { Skeleton, TableCell, TableRow } from "@mui/material"
import React from "react"

export const TableRowsLoader = ({ rowsNum, columsNum }) => {
  return [...Array(rowsNum)].map((row, index) => (
    <TableRow key={index}>
      {[...Array(columsNum)].map((row, index) => (
        <TableCell component="th" scope="row">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      ))}
    </TableRow>
  ))
}
