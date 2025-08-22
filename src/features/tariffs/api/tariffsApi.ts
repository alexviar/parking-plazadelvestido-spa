import { appApi } from "../../../commons/api/appApi"
import type { IndexParams, Paginated } from "../../../commons/api/types"
import type { Tariff } from "./types"

const TAG = 'Tariff' as const

export const tariffsApi = appApi
  .enhanceEndpoints({
    addTagTypes: [TAG]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getTariffs: builder.query<Paginated<Tariff>, IndexParams>({
        query: (params) => ({
          url: 'api/tariffs',
          method: 'GET',
          params
        }),
        providesTags(result) {
          const tags = []
          if (result) {
            result.data.forEach((tariff) => {
              tags.push({ type: TAG, id: String(tariff.id) })
            })
            tags.push({ type: TAG, id: '*' })
          }
          return tags
        },
        async onQueryStarted(_, { queryFulfilled, dispatch }) {
          try {
            const { data } = await queryFulfilled
            data.data.forEach((tariff) => {
              dispatch(
                tariffsApi.util.upsertQueryData(
                  'getTariff',
                  tariff.id,
                  tariff
                )
              )
            })
          } catch (error) {
            console.log(error)
          }
        },
      }),

      getTariff: builder.query<Tariff, number>({
        query: (id) => ({
          url: `api/tariffs/${id}`,
          method: 'GET',
        }),
        providesTags(result) {
          const tags = []
          if (result) {
            tags.push({ type: TAG, id: String(result.id) })
          }
          return tags
        },
      }),
      createTariff: builder.mutation<Tariff, Omit<Tariff, 'id'>>({
        query: (newTariff) => ({
          url: 'api/tariffs',
          method: 'POST',
          body: newTariff,
        }),
        invalidatesTags: (result) => {
          const tags = []
          if (result) {
            tags.push({ type: TAG, id: '*' })
          }
          return tags
        },
      }),
      updateTariff: builder.mutation<Tariff, Tariff>({
        query: (updatedTariff) => ({
          url: `api/tariffs/${updatedTariff.id}`,
          method: 'PUT',
          body: updatedTariff,
        }),
        invalidatesTags: (result) => {
          const tags = []
          if (result) {
            tags.push({ type: TAG, id: String(result.id) })
            tags.push({ type: TAG, id: '*' })
          }
          return tags
        },
      }),
      deleteTariff: builder.mutation<void, number>({
        query: (id) => ({
          url: `api/tariffs/${id}`,
          method: 'DELETE',
        }),
        invalidatesTags: (_, error, id) => {
          const tags = []
          if (!error) {
            tags.push({ type: TAG, id: String(id) })
            tags.push({ type: TAG, id: '*' })
          }
          return tags
        },
      }),
    }),
  })

export const {
  useGetTariffsQuery,
  useLazyGetTariffsQuery,
  useGetTariffQuery,
  useCreateTariffMutation,
  useUpdateTariffMutation,
  useDeleteTariffMutation,
} = tariffsApi
