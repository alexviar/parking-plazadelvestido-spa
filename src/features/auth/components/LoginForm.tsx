import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import * as yup from 'yup'
import { LoadingButton } from '../../../commons/components/LoadingButton'
import { PasswordInput } from '../../../commons/components/PasswordInput'
import { ValidationError } from '../../../commons/components/ValidationError'
import { useServerValidationErrors } from '../../../commons/hooks/useServerValidationErrors'
import { useLoginMutation } from '../api/authApi'

const schema = yup.object({
  email: yup.string().required('El usuario es requerido'),
  password: yup.string().required('La contraseña es requerida'),
})

export default function LoginForm() {
  const [login, loginResult] = useLoginMutation()

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setError
  } = useForm({
    resolver: yupResolver(schema)
  })
  useServerValidationErrors(loginResult, setError)

  return (
    <form onSubmit={handleSubmit(async (data) => {
      try {
        await login(data).unwrap()
      } catch {
        //
      }
    })} className="space-y-6">
      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
          Correo electrónico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="username"
          className={twMerge(
            "w-full px-4 py-3 pr-12 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
            errors.email && "border-red-500 focus:ring-red-500/50"
          )}
          placeholder="Ingresa tu usuario"
          {...register('email')}
        />
        <ValidationError control={control} name="email" />
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
          Contraseña
        </label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          className={twMerge(
            "w-full px-4 py-3 pr-12 border border-gray-300 outline-none rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-transparent",
            errors.password && "border-red-500 focus:ring-red-500/50"
          )}
          placeholder="Ingresa tu contraseña"
          {...register('password')}
        />
        <ValidationError control={control} name="password" />
      </div>

      {/* Submit Button */}
      <LoadingButton
        type="submit"
        isLoading={loginResult.isLoading}
        loadingText="Iniciando sesión"
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Iniciar Sesión
      </LoadingButton>
    </form>
  )
}