import { appApi } from '../../../commons/api/appApi';
import type { Ticket } from './types';

export type CreateTicketQueryArg = Omit<Ticket, 'id'>

const TAG = 'Tickets'

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
      }),
    }),
  });

export const { useCreateTicketMutation } = ticketsApi;