import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { LuCalendar, LuDollarSign, LuSquareParking } from "react-icons/lu";
import { MainLayout } from "../../../commons/layout/MainLayout";
import { useGetDailyStatsQuery } from "../api/dashboardApi";

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const getDailyStats = useGetDailyStatsQuery({ date: format(selectedDate, 'yyyy-MM-dd') })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <div className="relative">
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <LuCalendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Date Display */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            {format(selectedDate, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
          </p>
        </div>

        {getDailyStats.data ? (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <LuSquareParking className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Boletos</p>
                    <p className="text-2xl font-bold text-gray-900">{getDailyStats.data.totalTickets}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <LuDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Ingresos</p>
                    <p className="text-2xl font-bold text-green-600">${getDailyStats.data.totalAmount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/tickets"
                  className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                >
                  <LuSquareParking className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-blue-700 font-medium">Ver Historial</span>
                </Link>
                <Link
                  to="/tariffs"
                  className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                >
                  <LuSettings className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-700 font-medium">Configurar Tarifas</span>
                </Link>
              </div>
            </div> */}
          </>
        ) : getDailyStats.isFetching ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-3"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </MainLayout>
  );
}