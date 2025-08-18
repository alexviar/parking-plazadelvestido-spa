import type { Tariff } from "../api/types"

export const getApplicableTariff = (duration: number) => {
  const tariffs: Tariff[] = [
    { id: 1, name: 'Primera hora', threshold: 0, amount: 20 },
    { id: 2, name: 'Hora adicional', threshold: 1, amount: 35 },
    { id: 3, name: 'Día completo', threshold: 24, amount: 80 }
  ]

  const applicableTariff = tariffs.sort((a, b) => b.threshold - a.threshold).find(tariff => duration > tariff.threshold)

  return applicableTariff
}