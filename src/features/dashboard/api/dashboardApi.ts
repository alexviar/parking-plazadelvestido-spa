import { appApi } from "../../../commons/api/appApi";
import type { Stats } from "./types";

const dashboardApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    getDailyStats: build.query<Stats, { date: string }>({
      query: (params) => ({
        url: "api/stats/daily",
        params
      }),
    })
  })
})

export const { useGetDailyStatsQuery } = dashboardApi
