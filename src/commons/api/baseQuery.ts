import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import Qs from 'qs'
import { getCookie } from "./utils/getCookie"
import { keysToUnderscore } from "./utils/keyMapper"

export const apiUrl = import.meta.env.VITE_API_URL

export const baseQuery = fetchBaseQuery({
  baseUrl: apiUrl,
  prepareHeaders: async (headers) => {
    const csrfToken = decodeURIComponent(getCookie("XSRF-TOKEN"))
    headers.set("X-XSRF-TOKEN", csrfToken)
    headers.set("Accept", "application/json")
    return headers
  },
  paramsSerializer: params => {
    return Qs.stringify(keysToUnderscore(params), {
      arrayFormat: "brackets",
      encode: false,
      filter: (_, value) => {
        if (typeof value === "boolean") {
          return value ? 1 : 0
        }
        if (value === "") return undefined
        return value
      }
    });
  }
})