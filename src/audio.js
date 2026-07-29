import { useState, useRef, useEffect, useCallback } from 'react'

/* ------------------------------------------------------------------ Canción
   `src`      → canción COMPLETA. Sube tu archivo a `public/music/` con ese
                nombre exacto y sonará completa automáticamente.
   `fallback` → preview oficial de 30s de Apple (uso legal). Se usa solo si el
                archivo de arriba todavía no existe, para que nada se rompa. */
export const SONG = {
  title: 'A Sky Full of Stars',
  artist: 'Coldplay',
  src: '/music/a-sky-full-of-stars.mp3',
  fallback: 'https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/a2/31/4b/a2314b97-10b6-190c-72b3-45cc21bbf56b/mzaf_740612971315603868.plus.aac.p.m4a',
}

/* Hook reutilizable para reproducir una pista con un reproductor propio.
   Devuelve estado y controles; crea un HTMLAudioElement fuera del DOM.
   Si `src` no se puede cargar (p.ej. aún no subes el MP3) y hay `fallback`,
   cambia automáticamente a la fuente de respaldo. */
export function useAudioPlayer(src, { autoStart = false, fallback = null } = {}) {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [dur, setDur] = useState(0)

  useEffect(() => {
    const a = new Audio()
    a.preload = 'metadata'
    a.src = src
    audioRef.current = a
    let usedFallback = false

    const onTime = () => setTime(a.currentTime)
    const onMeta = () => setDur(a.duration || 0)
    const onEnd = () => setPlaying(false)
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    // Si la fuente principal falla, cae al respaldo sin perder la reproducción.
    const onError = () => {
      if (fallback && !usedFallback) {
        usedFallback = true
        const wasPlaying = !a.paused && a.currentTime > 0
        a.src = fallback
        a.load()
        if (wasPlaying) a.play().catch(() => {})
      } else {
        setPlaying(false)
      }
    }
    a.addEventListener('timeupdate', onTime)
    a.addEventListener('loadedmetadata', onMeta)
    a.addEventListener('ended', onEnd)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)
    a.addEventListener('error', onError)

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
      a.removeEventListener('error', onError)
      if (autoStart) window.removeEventListener('invite:open', onOpen)
      audioRef.current = null
    }
  }, [src, autoStart, fallback])

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
