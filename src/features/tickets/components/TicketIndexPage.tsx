import { useState } from "react"
import { LuCalendar, LuChevronLeft, LuChevronRight, LuSearch } from "react-icons/lu"
import { useDebouncedValue } from "../../../commons/hooks/useDebounced"
import { MainLayout } from "../../../commons/layout/MainLayout"
import { useGetTicketsQuery } from "../api/ticketsApi"
import { TicketList } from "./TicketList"

export const TicketIndexPage = () => {
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDate, setSelectedDate] = useState('')

  const getTickets = useGetTicketsQuery({
    page,
    pageSize: 15,
    filter: { date: selectedDate },
    search: useDebouncedValue(searchTerm)
  })

  return (
    <MainLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-gray-900">Historial de Boletos</h1>
        <div className="text-sm text-gray-600">
          {getTickets.data?.total} boleto{getTickets.data?.total !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 space-y-4 mb-4">
        <div className="flex flex-col space-y-3">
          {/* Search */}
          <div className="relative">
            <LuSearch className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por folio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Date Filter */}
          <div className="relative">
            <LuCalendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Clear Filters */}
          {(searchTerm || selectedDate) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedDate('');
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      <div>
        {getTickets.data
          ? <TicketList tickets={getTickets.data.data} />
          : getTickets.isFetching
            ? <TicketList.Skeleton />
            : null}
      </div>

      {/* Pagination */}
      {getTickets.data && getTickets.data?.lastPage > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <LuChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-sm text-gray-600 px-4">
            Página {page} de {getTickets.data?.lastPage}
          </span>

          <button
            onClick={() => setPage(prev => Math.min(prev + 1, getTickets.data?.lastPage!))}
            disabled={page === getTickets.data?.lastPage}
            className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            <LuChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </MainLayout>
  )
}