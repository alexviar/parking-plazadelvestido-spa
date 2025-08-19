import type { Ticket } from "../api/types"
import { TicketListItem } from "./TicketListItem"

type TicketListProps = {
  tickets: Ticket[]
}

export const TicketList = ({ tickets }: TicketListProps) => {
  if (tickets.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No se encontraron boletos</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {tickets.map(ticket => (
        <TicketListItem key={ticket.id} ticket={ticket} />
      ))}
    </div>
  )
}

TicketList.Skeleton = ({ count = 15 }: { count?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: count }, (_, i) => (
      <TicketListItem.Skeleton key={i} />
    ))}
  </div>
)