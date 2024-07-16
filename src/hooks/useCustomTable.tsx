import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { DEFAULT_ERROR } from "../constants/constansts"

export interface useCustomTableType {
  data: any[]
  order: "desc" | "asc"
  orderBy: string
  page: number
  total: number
  rowsPerPage: number
  search: string
  searchBy: string
  isLoading: boolean
  setData: React.Dispatch<React.SetStateAction<any[]>>
  setOrder: React.Dispatch<React.SetStateAction<"asc" | "desc">>
  setOrderBy: React.Dispatch<React.SetStateAction<string>>
  setPage: React.Dispatch<React.SetStateAction<number>>
  setTotal: React.Dispatch<React.SetStateAction<number>>
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  setSearchBy: React.Dispatch<React.SetStateAction<string>>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const useCustomTable = (fetchData): useCustomTableType => {
  const [data, setData] = useState<any[]>([])
  const [order, setOrder] = useState<"asc" | "desc">("asc")
  const [orderBy, setOrderBy] = useState("")
  const [page, setPage] = useState(0)
  const [total, setTotal] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const [searchBy, setSearchBy] = useState("")
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

  return {
    data,
    order,
    orderBy,
    page,
    total,
    rowsPerPage,
    search,
    searchBy,
    isLoading,
    setData,
    setOrder,
    setOrderBy,
    setPage,
    setTotal,
    setRowsPerPage,
    setSearch,
    setSearchBy,
    setIsLoading,
  }
}
