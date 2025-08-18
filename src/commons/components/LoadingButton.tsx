import type { ReactNode } from 'react'
import { LuLoaderCircle } from 'react-icons/lu'

type LoadingButtonProps = {
  icon?: ReactNode
  isLoading: boolean
  loadingText?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const LoadingButton = ({ isLoading, loadingText, icon, children, ...props }: LoadingButtonProps) => (
  <button
    {...props}
    className={`flex items-center justify-center gap-2 ${props.className}`}
    disabled={isLoading || props.disabled}
  >
    {isLoading ? (
      <LuLoaderCircle className={`animate-spin h-5 w-5`} role='status' aria-label='Cargando' />
    ) : (
      icon
    )}
    {isLoading && loadingText || children}
  </button>
);