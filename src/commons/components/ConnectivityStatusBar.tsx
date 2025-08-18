import { useEffect, useRef, useState } from 'react'
import { LuWifi, LuWifiOff } from 'react-icons/lu'
import { useIsOnline } from '../hooks/useIsOnline'
import { Alert } from './Alert'

type ConnectivityStatusBarProps = {
  onReconnect?: () => void
}

export const ConnectivityStatusBar = ({
  onReconnect
}: ConnectivityStatusBarProps) => {
  const previousIsOnlineRef = useRef(navigator.onLine)
  const isOnline = useIsOnline()
  const [isVisible, setIsVisible] = useState(!isOnline)

  useEffect(() => {
    if (isOnline) {
      if (!previousIsOnlineRef.current) {
        onReconnect?.()
      }
      const timeoutId = setTimeout(() => {
        setIsVisible(false)
      }, 5000)
      return () => {
        clearTimeout(timeoutId)
      }
    }
    else {
      setIsVisible(true)
    }

    previousIsOnlineRef.current = isOnline
  }, [isOnline, onReconnect, previousIsOnlineRef])

  if (!isVisible) return null

  return (
    <Alert
      message={isOnline ? 'Conectado' : 'Sin conexión'}
      type={isOnline ? 'success' : 'warning'}
      icon={isOnline ? <LuWifi size="1.25em" /> : <LuWifiOff size="1.25em" />}
      className="text-xs py-2"
    />
  )
}