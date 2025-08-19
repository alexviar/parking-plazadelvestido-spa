import QrScanner from 'qr-scanner'
import { useEffect, useRef, useState } from 'react'
import { LuCircleX, LuQrCode } from 'react-icons/lu'

interface QRScannerProps {
  onScan: (result: string) => void
  isActive: boolean
}

export default function QRScanner({ onScan, isActive }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const qrScannerRef = useRef<QrScanner | null>(null)
  const [hasCamera, setHasCamera] = useState<boolean>()
  const [error, setError] = useState<string>('')

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    const playBeep = async () => {
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        if (audioContextRef.current.state === 'suspended') {
          await audioContextRef.current.resume();
        }

        const oscillator = audioContextRef.current.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(1000, audioContextRef.current.currentTime);
        oscillator.connect(audioContextRef.current.destination);
        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + 0.1);
      } catch (err) {
        console.error('Error playing beep:', err);
      }
    }

    let cancelled = false
    const initScanner = async () => {
      try {
        if (cancelled) return
        const hasCamera = await QrScanner.hasCamera()
        if (cancelled) return
        setHasCamera(hasCamera)

        if (!hasCamera) {
          setError('No se encontró cámara disponible')
          return
        }

        let lastScannedCode: string = ''
        qrScannerRef.current = new QrScanner(
          videoElement,
          (result) => {
            if (!cancelled && isActive && result.data !== lastScannedCode) {
              playBeep()
              lastScannedCode = result.data
              onScan(result.data)
            }
          },
          {
            maxScansPerSecond: 1,
            returnDetailedScanResult: true,
            // highlightScanRegion: true,
            // highlightCodeOutline: true
          }
        )

        await qrScannerRef.current.start()
      } catch (err) {
        if (!cancelled) {
          console.error('Error initializing scanner:', err)
          setError('Error al inicializar la cámara')
        }
      }
    }

    initScanner()

    return () => {
      cancelled = true
      if (qrScannerRef.current) {
        qrScannerRef.current.stop()
        qrScannerRef.current.destroy()
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    }
  }, [])

  useEffect(() => {
    if (qrScannerRef.current) {
      if (isActive) {
        qrScannerRef.current.start()
      } else {
        qrScannerRef.current.stop()
      }
    }
  }, [isActive])

  return (
    <div className="w-full relative bg-black">
      <div className='absolute inset-0'>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />
      </div>

      {hasCamera === false ? (
        <div className="text-center text-white p-6">
          <LuQrCode className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p className="text-sm">Verificando cámara...</p>
        </div>
      ) : error ? (
        <div className="text-center text-white p-6">
          <LuCircleX className="h-12 w-12 mx-auto mb-3 text-red-400" />
          <p className="text-sm">{error}</p>
        </div>
      ) : (
        // Use this if cqw/cqh is not available
        // <div className="absolute inset-1/10 flex items-center justify-center pointer-events-none">
        //   {/* <div className="w-4/5 h-4/5 flex items-center"> */}
        //   <div className='relative w-full max-h-full aspect-square flex justify-center'>
        //     <div className='h-full max-w-full aspect-square'>
        //       {/* Scanning frame */}
        //       <div className="w-full h-full rounded-lg relative animate-scale">
        //         <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg"></div>
        //         <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-lg"></div>
        //         <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-lg"></div>
        //         <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg"></div>
        //       </div>
        //     </div>
        //     {/* Instructions */}
        //     <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 text-center">
        //       <p className="text-white text-sm font-medium">
        //         {isActive ? 'Enfoca el código QR' : 'Escáner pausado'}
        //       </p>
        //     </div>
        //     {/* </div> */}
        //   </div>
        // </div>
        <div
          className="absolute inset-0 p-12 flex flex-col items-center justify-center pointer-events-none"
          style={{ containerType: 'size' }} // habilita cqw/cqh en este contenedor
        >
          <div className='relative'>
            {/* Marco cuadrado = 80% de min(ancho, alto) del contenedor */}
            <div className="relative w-[min(100cqw,100cqh)] h-[min(100cqw,100cqh)] rounded-lg animate-scale">
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />
            </div>
            {/* Instructions */}
            <div className="absolute -bottom-8 w-full text-center">
              <p className="text-white text-sm font-medium">
                {isActive ? 'Enfoca el código QR' : 'Escáner pausado'}
              </p>
            </div>
          </div>

        </div>
      )
      }
    </div >
  )
}