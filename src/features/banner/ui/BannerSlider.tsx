import { useEffect, useRef, useState } from 'react'
import type { ApiBanner } from '@entities/shop'
import { getWebApp } from '@shared/bridge'
import styles from './BannerSlider.module.css'

const AUTOPLAY_INTERVAL = 4000

interface BannerSliderProps {
  banners: ApiBanner[]
}

export const BannerSlider = ({ banners }: BannerSliderProps) => {
  const sorted = [...banners].sort((a, b) => a.position - b.position)
  const [activeIndex, setActiveIndex] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const isScrollingByCode = useRef(false)

  // Scroll to slide whenever activeIndex changes (from autoplay or dot click)
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const slide = track.children[activeIndex] as HTMLElement | undefined
    if (!slide) return
    isScrollingByCode.current = true
    slide.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    // Reset flag after animation
    const t = setTimeout(() => {
      isScrollingByCode.current = false
    }, 400)
    return () => clearTimeout(t)
  }, [activeIndex])

  // Sync dots when user manually swipes
  const handleScroll = () => {
    if (isScrollingByCode.current) return
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.clientWidth
    if (!slideWidth) return
    const idx = Math.round(track.scrollLeft / slideWidth)
    setActiveIndex(Math.min(idx, sorted.length - 1))
  }

  // Autoplay
  useEffect(() => {
    if (sorted.length <= 1) return
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sorted.length)
    }, AUTOPLAY_INTERVAL)
    return () => clearInterval(id)
  }, [sorted.length])

  const handleBannerClick = (url: string | null) => {
    if (!url) return
    getWebApp()?.openLink(url)
  }

  if (!sorted.length) return null

  return (
    <div className={styles.root}>
      <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
        {sorted.map(({ id, images, url }) => (
          <div
            key={id}
            className={styles.slide}
            onClick={() => handleBannerClick(url)}
            role={url ? 'button' : undefined}
            tabIndex={url ? 0 : undefined}
          >
            <img
              src={images.original}
              alt=""
              className={styles.image}
              loading="lazy"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {sorted.length > 1 && (
        <div className={styles.dots} aria-hidden="true">
          {sorted.map((_, i) => (
            <button
              key={i}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
