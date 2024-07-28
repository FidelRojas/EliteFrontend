import { City } from "./city.interface"
import { Truck } from "./truck.interface"

export interface Travel {
  id?: number
  truckId: number
  truck: Truck
  from: number
  fromCity: City
  to: number
  toCity: City
  arrivalDate: Date
  departureDate: Date
  notes: string
  status: number
  createdAt: Date
  updatedAt: Date
}
