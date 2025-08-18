import { differenceInHours } from "date-fns"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { ConnectivityStatusBar } from "../../../commons/components/ConnectivityStatusBar"
import QRScanner from "../../../commons/components/QRScanner"
import { MainLayout } from "../../../commons/layout/MainLayout"
import { getApplicableTariff } from "../../tariffs/utils/getApplicableTariff"
import type { Ticket } from "../api/types"
import { parseQRCode } from "../parseQrCode"
import { addItem } from "../redux/offlineQueueSlice"
import ScanResult from "./ScanResult"

export const TicketScanner = () => {
  const [currentTicket, setCurrentTicket] = useState<Ticket | undefined>()
  const [currentError, setCurrentError] = useState<string | undefined>()
  const dispatch = useDispatch()

  const handleScan = async (qrCode: string) => {
    const exitTime = new Date()
    const parsedQr = parseQRCode(qrCode)

    let ticket: Ticket | null = null
    if (parsedQr.isValid) {
      const duration = differenceInHours(exitTime, parsedQr.entryTime)
      const tariff = getApplicableTariff(duration)!
      ticket = {
        id: 0,
        code: qrCode,
        folio: parsedQr.folio,
        entryTime: parsedQr.entryTime,
        exitTime: exitTime,
        duration,
        amount: tariff.amount,
        tariff
      }
      setCurrentTicket(ticket)
    }
    else {
      setCurrentError(parsedQr.error)
    }

    if (ticket) {
      dispatch(addItem({
        data: ticket,
        status: 'pending',
      }))
    }
  }

  return (
    <MainLayout
      banner={<ConnectivityStatusBar />}
    >
      <div className="-mx-4 -my-6 flex-1 flex flex-col sm:flex-row">
        {/* Scanner */}
        <div className="flex-1 flex items-stretch">
          <QRScanner onScan={handleScan} isActive />
        </div>

        {/* Scan Result */}
        {(currentTicket || currentError) && (
          <div className="rounded-t-2xl overflow-hidden -mt-4 z-10 animate-scale-up">
            <ScanResult
              data={currentTicket}
              error={currentError}
            />
          </div>
        )}
      </div>
    </MainLayout>
  )
}