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

export interface ActivityLogEntry {
  id: number;
  description: string;
  causer: {
    id: number;
    name: string;
    email: string;
  } | null;
  subjectType: string;
  subjectId: number;
  properties: any;
  createdAt: string;
}

export const { useGetDailyStatsQuery } = dashboardApi
