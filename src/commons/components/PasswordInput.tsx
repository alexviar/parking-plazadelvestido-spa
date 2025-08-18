import { useState } from 'react'
import { LuEye, LuEyeOff } from 'react-icons/lu'

type PasswordInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  iconColor?: string
}

export const PasswordInput = ({ iconColor, ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <input
        type={showPassword ? 'text' : 'password'}
        {...props}
      />
      <button
        type="button"
        tabIndex={-1}
        title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <LuEyeOff className="h-5 w-5" /> : <LuEye className="h-5 w-5" />}
      </button>
    </div>
  )
}