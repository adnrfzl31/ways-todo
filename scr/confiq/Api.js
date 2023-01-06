import axios from "axios"

export const API = axios.create({
  baseURL: `https://api.kontenbase.com/query/api/v1/4812a89a-daa1-4c74-8c0d-a3ee60e3d3da`,
})

export function setAuthorization(token) {
  if (!token) {
    delete API.defaults.headers.common
    return
  }
  API.defaults.headers.common["Authorization"] = `Bearer ${token}`
}
