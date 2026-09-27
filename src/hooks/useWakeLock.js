import { useEffect } from 'react'

// Mantiene la pantalla encendida mientras la app está abierta (fiesta, debate…)
export function useWakeLock() {
  useEffect(() => {
    let lock = null

    async function acquire() {
      try {
        lock = await navigator.wakeLock?.request('screen')
      } catch {
        /* no soportado o sin permiso */
      }
    }

    function onVisible() {
      if (document.visibilityState === 'visible') acquire()
    }

    acquire()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release?.().catch(() => {})
    }
  }, [])
}
