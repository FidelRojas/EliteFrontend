import { Moment } from "moment"
import { Truck } from "./truck.interface"
import { Category } from "./category.interface"

export interface Expense {
  id?: number
  date: Date | Moment
  detail: string
  from: string
  to: string
  amountBs: number
  amountSus: number
  categoryId: number
  truckId: number
  truck: Truck
  category: Category
  notes: string
  status: number
  updatedBy: string
  createdAt: Date
  updatedAt: Date
}
