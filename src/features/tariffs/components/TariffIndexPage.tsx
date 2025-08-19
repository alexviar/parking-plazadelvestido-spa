import { LuClock, LuDollarSign, LuPen, LuTrash } from 'react-icons/lu'
import { Link } from 'react-router'
import { MainLayout } from '../../../commons/layout/MainLayout'
import { useDeleteTariffMutation, useGetTariffsQuery } from '../api/tariffsApi'

export const TariffIndexPage = () => {

  const getTariffs = useGetTariffsQuery({
    page: 1,
    pageSize: 50
  })

  const [deleteTariff] = useDeleteTariffMutation()

  return (
    <MainLayout>
      <div className='flex flex-col gap-4'>
        <Link to="/tariffs/new" className="ms-auto bg-blue-600 text-white px-4 py-2 rounded-md">
          Crear tarifa
        </Link>
        {getTariffs.data?.data?.map((tariff) => (
          <div key={tariff.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900">{tariff.name}</h3>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/tariffs/${tariff.id}/edit`}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <LuPen className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => {
                    deleteTariff(tariff.id)
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LuTrash className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-600">
                <LuClock className="h-4 w-4 mr-1" />
                <p className="text-sm text-gray-600">
                  A partir de {tariff.threshold} minutos
                </p>
              </div>
              <div className="flex items-center font-bold text-green-600">
                <LuDollarSign className="h-4 w-4 mr-1" />
                <span>${tariff.amount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </MainLayout>
  )
}