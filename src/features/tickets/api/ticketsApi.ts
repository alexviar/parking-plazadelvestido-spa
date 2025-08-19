import { appApi } from '../../../commons/api/appApi';
import type { IndexParams, Paginated } from '../../../commons/api/types';
import type { Ticket } from './types';

export type CreateTicketQueryArg = Omit<Ticket, 'id'>

const TAG = 'Tickets' as const

export const ticketsApi = appApi
  .enhanceEndpoints({
    addTagTypes: [TAG]
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      createTicket: builder.mutation<Ticket, CreateTicketQueryArg>({
        query: (ticket) => ({
          url: 'api/tickets',
          method: 'POST',
          body: ticket,
        }),
        invalidatesTags: (result) => {
          const tags = []
          if (result) {
            tags.push({ type: TAG, id: '*' })
          }
          return tags
        },
      }),
      getTickets: builder.query<Paginated<Ticket>, IndexParams<{ date?: string }>>({
        query: (params) => ({
          url: 'api/tickets',
          method: 'GET',
          params
        }),
        providesTags(result) {
          const tags = []
          if (result) {
            result.data.forEach((ticket) => {
              tags.push({ type: TAG, id: String(ticket.id) })
            })
            tags.push({ type: TAG, id: '*' })
          }
          return tags
        },
        async onQueryStarted(_, { queryFulfilled, dispatch }) {
          try {
            const { data } = await queryFulfilled
            data.data.forEach((ticket) => {
              dispatch(
                ticketsApi.util.upsertQueryData(
                  'getTicket',
                  ticket.id,
                  ticket
                )
              )
            })
          } catch (error) {
            console.log(error)
          }
        },
      }),

      getTicket: builder.query<Ticket, number>({
        query: (id) => ({
          url: `api/tickets/${id}`,
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
      updateTicket: builder.mutation<Ticket, Ticket>({
        query: (updatedTicket) => ({
          url: `api/tickets/${updatedTicket.id}`,
          method: 'PUT',
          body: updatedTicket,
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
      deleteTicket: builder.mutation<void, number>({
        query: (id) => ({
          url: `api/tickets/${id}`,
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
  });

export const {
  useGetTicketsQuery,
  useGetTicketQuery,
  useCreateTicketMutation,
  useUpdateTicketMutation,
  useDeleteTicketMutation,
} = ticketsApi;