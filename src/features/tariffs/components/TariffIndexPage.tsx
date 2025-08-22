import { LuClock, LuDollarSign, LuPen, LuRefreshCw, LuTrash } from 'react-icons/lu'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { twMerge } from 'tailwind-merge'
import { getErrorMessage } from '../../../commons/api/utils/getErrorMessage'
import { Alert } from '../../../commons/components/Alert'
import { MainLayout } from '../../../commons/layout/MainLayout'
import { useUser } from '../../auth/hooks/useUser'
import { useDeleteTariffMutation, useGetTariffsQuery } from '../api/tariffsApi'
import type { Tariff } from '../api/types'

export const TariffIndexPage = () => {
  const user = useUser()

  const getTariffs = useGetTariffsQuery({
    page: 1,
    pageSize: 50
  })
  const tariffs = useSelector((state: any) => state.tariffs) as Tariff[]

  const [deleteTariff] = useDeleteTariffMutation()

  return (
    <MainLayout>
      <div className='flex flex-col gap-4'>
        <div className="w-full flex items-stretch justify-between gap-2">
          <h1 className="text-2xl font-bold">Tarifas</h1>
          <div className="flex items-center gap-2">
            {user?.role == 2 && <button
              onClick={() => {
                getTariffs.refetch()
              }}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white p-2 rounded-md"
            >
              <LuRefreshCw className={twMerge("w-6 h-6", tariffs && getTariffs.isFetching && "animate-spin [animation-duration:2s]")} /> Sincronizar
            </button>}
            {user?.role == 1 && (
              <Link to="/tariffs/new" className="bg-blue-600 text-white px-4 py-2 rounded-md">
                Crear tarifa
              </Link>
            )}
          </div>
        </div>

        {getTariffs.isError && (
          <Alert type='error' message={getErrorMessage(getTariffs.error)} />
        )}

        {tariffs ?
          tariffs.length == 0 ? (
            <p>No hay tarifas</p>
          ) : (
            <div className='flex flex-col gap-4'>
              {tariffs.map((tariff) => (
                <div key={tariff.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-gray-900">{tariff.name}</h3>
                    {user?.role == 1 && <div className="flex items-center space-x-2">
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
                    </div>}
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
          ) : getTariffs.isFetching ? (
            <div className='flex flex-col gap-4'>
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse">
                  <div className="flex justify-between items-start mb-3">
                    <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                      <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-5 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : null
        }
      </div>
    </MainLayout>
  )
}