export interface Stats {
  date: string
  totalTickets: number
  totalAmount: number

  gaps: { from: number, to: number }[]
}