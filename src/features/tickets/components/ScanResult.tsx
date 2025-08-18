import { LuCircleCheck, LuCircleX, LuClock, LuQrCode } from 'react-icons/lu'
import type { Ticket } from '../api/types'

type ScanResultProps = {
  data?: Ticket
  error?: string
}

export default function ScanResult({ data, error }: ScanResultProps) {
  return (
    <div className="bg-white p-4 w-full">
      {error ? (
        // Error State
        <div className="text-center">
          <LuCircleX className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      ) : data && (
        // Success State
        <div className="space-y-3">
          <div className="text-center">
            <LuCircleCheck className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900">¡Boleto procesado!</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center">
                <LuQrCode className="text-[1.25em] text-gray-500 mr-2" />
                <span className="text-gray-600">Folio</span>
              </div>
              <span className="font-semibold text-gray-900">{data.folio}</span>
            </div>

            <div className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg text-sm">
              <div className="flex items-center">
                <LuClock className="text-[1.25em] text-gray-500 mr-2" />
                <span className="text-gray-600">Tiempo</span>
              </div>
              <span className="font-semibold text-gray-900">{data.duration} h</span>
            </div>

          </div>
          <div className="flex flex-col items-start">
            <span className="text-lg text-gray-700 mb-1">Total:</span>
            <div className="w-full flex items-center justify-end p-3 bg-green-50 rounded-lg border border-green-200">
              <span className="font-bold text-green-700 text-6xl">${data.amount.toFixed(0)}</span>
            </div>
            <span className="mt-1 text-xs text-gray-500">Tarifa aplicada: {data.tariff.name}</span>

          </div>
        </div>
      )}
    </div>
  )
}