import { skipToken } from '@reduxjs/toolkit/query'
import { useNavigate, useParams } from 'react-router'
import { MainLayout } from '../../../commons/layout/MainLayout'
import { useGetTariffQuery } from '../api/tariffsApi'
import { TariffForm } from './TariffForm'

export const TariffFormPage = () => {
  const { tariffId } = useParams<{ tariffId: string }>()
  const navigate = useNavigate()
  const getTariff = useGetTariffQuery(tariffId ? Number(tariffId) : skipToken)

  return (
    <MainLayout>
      {getTariff.data || !tariffId ? (
        <TariffForm
          tariff={getTariff.data}
          onSuccess={() => {
            navigate('/tariffs')
          }}
          onCancel={() => {
            navigate('/tariffs')
          }}
        />
      ) : null}
    </MainLayout>
  )
}