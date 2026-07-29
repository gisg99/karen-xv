import { useState, useRef, useEffect, useCallback } from 'react'

/* ------------------------------------------------------------------ Canción
   Fuente: preview oficial de 30s de Apple/iTunes (uso legal, sin descargar el
   MP3 con copyright). Para poner la canción COMPLETA, reemplaza `src` por la
   ruta de tu propio archivo, p.ej. '/music/a-sky-full-of-stars.mp3'. */
export const SONG = {
  title: 'A Sky Full of Stars',
  artist: 'Coldplay',
  src: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a2/31/4b/a2314b97-10b6-190c-72b3-45cc21bbf56b/mzaf_740612971315603868.plus.aac.p.m4a',
}

/* Hook reutilizable para reproducir una pista con un reproductor propio.
   Devuelve estado y controles; crea un HTMLAudioElement fuera del DOM. */
export function useAudioPlayer(src, { autoStart = false } = {}) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)

  useEffect(() => {
    const a = new Audio(src)
    a.preload = 'metadata'
    audioRef.current = a

    const onTime = () => setTime(a.currentTime)
    const onMeta = () => setDur(a.duration || 0)
    const onEnd = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)

    // Arranca al abrir la invitación (el clic en la bienvenida es el gesto
    // de usuario que permite el autoplay con sonido).
    const onOpen = () => { a.play().catch(() => {}) }
    if (autoStart) window.addEventListener('invite:open', onOpen)

    return () => {
      a.pause()
      a.removeEventListener('timeupdate', onTime)
      a.removeEventListener('loadedmetadata', onMeta)
      a.removeEventListener('ended', onEnd)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
      if (autoStart) window.removeEventListener('invite:open', onOpen)
      audioRef.current = null
    }
  }, [src, autoStart])

  const toggle = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    if (a.paused) a.play().catch(() => {})
    else a.pause()
  }, [])

  const seek = useCallback((ratio) => {
    const a = audioRef.current
    if (a && a.duration) a.currentTime = Math.max(0, Math.min(1, ratio)) * a.duration
  }, [])

  const restart = useCallback(() => {
    const a = audioRef.current
    if (!a) return
    a.currentTime = 0
    a.play().catch(() => {})
  }, [])

  const progress = dur ? time / dur : 0
  return { playing, progress, time, dur, toggle, seek, restart }
}
