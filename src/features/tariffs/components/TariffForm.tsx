import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import * as yup from 'yup'
import { LoadingButton } from '../../../commons/components/LoadingButton'
import { ValidationError } from '../../../commons/components/ValidationError'
import { useCreateTariffMutation, useUpdateTariffMutation } from "../api/tariffsApi"
import type { Tariff } from "../api/types"

const schema = yup.object({
  name: yup.string().required('El nombre es obligatorio'),
  amount: yup.number().min(1, 'Debe ser mayor o igual a 1').required('El monto es obligatorio'),
  threshold: yup.number().integer().min(0, 'Debe ser mayor o igual a 0').required('El umbral es obligatorio'),
})

interface FormData {
  name: string
  amount: number
  threshold: number
}

type TariffFormProps = {
  tariff?: Partial<Tariff>
  onSuccess: () => void
  onCancel: () => void
}

export const TariffForm = ({ tariff, onSuccess, onCancel }: TariffFormProps) => {
  const isEditing = Boolean(tariff?.id)
  console.log(isEditing, tariff)

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: tariff?.name || '',
      amount: tariff?.amount || 1,
      threshold: tariff?.threshold || 0,
    }
  })

  const [createTariff, createResult] = useCreateTariffMutation()
  const [updateTariff, updateResult] = useUpdateTariffMutation()
  const submitResult = isEditing ? updateResult : createResult

  const onSubmit = async (data: FormData) => {
    try {
      const tariffData: Tariff = {
        id: tariff?.id || 0, // ID will be ignored for creation, but needed for update
        name: data.name,
        amount: data.amount,
        threshold: data.threshold,
      }

      console.log(isEditing, 234)
      if (isEditing) {
        await updateTariff(tariffData).unwrap()
      } else {
        await createTariff(tariffData).unwrap()
      }
      onSuccess()
    } catch (error) {
      console.error('Error saving tariff:', error)
      // Optionally, handle error state in the form
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nombre de la tarifa
        </label>
        <input
          type="text"
          className={twMerge(
            "w-full px-4 py-3 pr-12 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
            errors.name && "border-red-500 focus:ring-red-500/50"
          )}
          placeholder="Ej: Primera hora"
          {...register('name')}
        />
        <ValidationError control={control} name="name" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto
          </label>
          <input
            {...register('amount', { valueAsNumber: true })}
            type="number"
            min="1"
            step="1"
            className={twMerge(
              "w-full px-4 py-3 pr-12 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
              errors.amount && "border-red-500 focus:ring-red-500/50"
            )}
          />
          <ValidationError control={control} name="amount" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Umbral
          </label>
          <input
            type="number"
            min="0"
            step="1"
            className={twMerge(
              "w-full px-4 py-3 pr-12 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
              errors.threshold && "border-red-500 focus:ring-red-500/50"
            )}
            {...register('threshold', { valueAsNumber: true })}
          />
          <ValidationError control={control} name="threshold" />
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
          disabled={submitResult.isLoading}

        >
          Cancelar
        </button>
        <LoadingButton
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          isLoading={submitResult.isLoading}
          loadingText={isEditing ? 'Actualizando' : 'Guardando'}
        >
          {isEditing ? 'Actualizar' : 'Guardar'}
        </LoadingButton>
      </div>
    </form>
  )
}