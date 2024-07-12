import { client } from "./client"
import { USER_PATH } from "../../constants/endpointsConstants"
import * as jose from "jose"

export const validateToken = () => {
  const token = localStorage.getItem("token")

  if (token) {
    try {
      const { id } = decodeToken(token)

      if (id) {
        return true
      }
    } catch (error) {
      return false
    }
  }
  return false
}

export const decodeToken = (token) => {
  return jose.decodeJwt(token)
}
