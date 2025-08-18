import { useState, type ReactNode } from 'react'
import { LuCircleAlert, LuCircleCheck, LuCircleX, LuInfo, LuX } from 'react-icons/lu'
import { twMerge } from 'tailwind-merge'

interface AlertProps {
  message: string
  type?: 'info' | 'success' | 'warning' | 'error'
  onDismiss?: () => void
  dismissible?: boolean
  position?: 'top' | 'bottom'
  children?: ReactNode
  className?: string
  icon?: ReactNode
}

const styles = {
  info: 'bg-blue-600 text-white',
  success: 'bg-green-600 text-white',
  warning: 'bg-yellow-500 text-black',
  error: 'bg-red-600 text-white',
}

const icons = {
  info: <LuInfo size="1.25em" />,
  success: <LuCircleCheck size="1.25em" />,
  warning: <LuCircleAlert size="1.25em" />,
  error: <LuCircleX size="1.25em" />,
}

export const Alert = ({
  message,
  type = 'info',
  onDismiss,
  dismissible,
  children,
  className
}: AlertProps) => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className={twMerge(`p-3 text-center font-medium flex items-center justify-center gap-2 ${styles[type]}`, className)}>
      <div className="flex-1">
        <div className="flex items-center justify-center gap-2">
          <span className="flex-shrink-0">{icons[type]}</span>
          <span>{message}</span>
        </div>
        {children}
      </div>

      {dismissible && (
        <button
          className="bg-opacity-20 hover:bg-opacity-30 rounded transition"
          onClick={() => {
            setIsVisible(false)
            onDismiss?.()
          }}
          aria-label="Cerrar"
        >
          <LuX />
        </button>
      )}
    </div>
  )
}