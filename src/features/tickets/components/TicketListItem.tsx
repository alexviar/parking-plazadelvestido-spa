import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Ticket } from "../api/types"

type TicketListItemProps = {
  ticket: Ticket
}

export const TicketListItem = ({ ticket }: TicketListItemProps) => {
  return (
    <div key={ticket.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">#{ticket.folio}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(ticket.exitTime), "d MMM yyyy, HH:mm", { locale: es })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-green-600">${ticket.amount}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-600">Entrada</p>
          <p className="font-medium text-gray-900">
            {format(new Date(ticket.entryTime), "HH:mm")}
          </p>
        </div>
        <div>
          <p className="text-gray-600">Duración</p>
          <p className="font-medium text-gray-900">{ticket.duration} min</p>
        </div>
      </div>
    </div>
  )
}

TicketListItem.Skeleton = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse">
    <div className="flex justify-between items-start mb-3">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <div className="h-3 bg-gray-200 rounded w-32"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-16"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="h-3 bg-gray-200 rounded"></div>
      <div className="h-3 bg-gray-200 rounded"></div>
    </div>
  </div>
)