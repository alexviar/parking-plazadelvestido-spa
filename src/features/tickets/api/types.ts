import type { Tariff } from "../../tariffs/api/types"

export interface Ticket {
  id: number
  code: string
  entryTime: string
  exitTime: string
  duration: number
  amount: number
  folio: string

  tariff: Tariff
}