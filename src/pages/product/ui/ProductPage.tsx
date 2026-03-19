import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetProductQuery, buildImageUrl } from '@entities/product'
import { useCartItem } from '@entities/cart'
import { useBackButton } from '@shared/hooks/useBackButton'
import { SkeletonLine, SkeletonBlock } from '@shared/ui'
import { ROUTES } from '@shared/config/routes'
import styles from './ProductPage.module.css'

// ─── Gallery ─────────────────────────────────────────────────────────────────

interface GalleryProps {
  images: Array<{ id: number; file: string | null }>
  discount: number
}

const Gallery = ({ images, discount }: GalleryProps) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const hasImages = images.length > 0
  const urls = images.map((img) => buildImageUrl(img.file))

  // Track scroll position to update active dot
  const handleScroll = () => {
    const track = trackRef.current
    if (!track) return
    const slideWidth = track.offsetWidth
    if (slideWidth === 0) return
    const idx = Math.round(track.scrollLeft / slideWidth)
    setActiveIndex(idx)
  }

  const scrollTo = (idx: number) => {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: idx * track.offsetWidth, behavior: 'smooth' })
  }

  if (!hasImages) {
    return <div className={styles.galleryPlaceholder} />
  }

  return (
    <div className={styles.gallery}>
      <div className={styles.galleryTrack} ref={trackRef} onScroll={handleScroll}>
        {urls.map((url, i) => (
          <div className={styles.gallerySlide} key={images[i].id}>
            {url && (
              <>
                {/* Blurred background — ref: ProductImage.tsx photoBackgroundBlur */}
                <img
                  src={url}
                  alt=""
                  className={styles.galleryBgBlur}
                  aria-hidden="true"
                />
                <img
                  src={url}
                  alt={i === 0 ? 'Фото товара' : `Фото ${i + 1}`}
                  className={styles.galleryImg}
                  loading={i === 0 ? 'eager' : 'lazy'}
                />
              </>
            )}
            {/* Discount badge on the first slide only */}
            {i === 0 && discount > 0 && (
              <span className={styles.discountBadge}>–{discount}%</span>
            )}
          </div>
        ))}
      </div>

      {/* Dots pagination — only when > 1 image, ref: SliderDots.tsx */}
      {urls.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Фотографии товара">
          {urls.map((_, i) => (
            <button
              key={i}
              role="tab"
              aria-selected={i === activeIndex}
              aria-label={`Фото ${i + 1}`}
              className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Description with expand/collapse ────────────────────────────────────────

const Description = ({ text }: { text: string }) => {
  const [expanded, setExpanded] = useState(false)
  const [isClamped, setIsClamped] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Check if text overflows the 3-line clamp
    setIsClamped(el.scrollHeight > el.clientHeight + 2)
  }, [text])

  return (
    <div className={styles.descriptionWrap}>
      <p
        ref={ref}
        className={`${styles.description} ${expanded ? styles.descriptionExpanded : ''}`}
        dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }}
      />
      {/* Only show toggle when text is actually clamped or was clamped */}
      {(isClamped || expanded) && (
        <button
          className={styles.descriptionToggle}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Скрыть' : 'Показать больше'}
        </button>
      )}
    </div>
  )
}

// ─── Attributes collapse (ref: CommonAttributeList + Collapse) ───────────────

const AttributesSection = ({ attributes }: { attributes: Record<string, string> }) => {
  const [open, setOpen] = useState(false)
  const entries = Object.entries(attributes).filter(([, v]) => v != null && v !== '')

  if (entries.length === 0) return null

  return (
    <div className={styles.attrsSection}>
      <button
        className={styles.attrsToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Arrow icon — ref: ArrowIcon in Collapse.tsx, rotates on open */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${styles.arrowIcon} ${open ? styles.arrowIconOpen : ''}`}
          aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
        Все характеристики
      </button>

      {open && (
        <div className={styles.attrs} role="table" aria-label="Характеристики товара">
          {entries.map(([key, value]) => (
            <div key={key} className={styles.attrRow} role="row">
              <span className={styles.attrKey} role="rowheader">{key}</span>
              <span className={styles.attrDots} aria-hidden="true" />
              <span className={styles.attrVal} role="cell">{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main ProductPage ─────────────────────────────────────────────────────────

export const ProductPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data: product, isLoading, isError } = useGetProductQuery(Number(id), { skip: !id })

  const { quantity, isLoading: isCartLoading, add, increment, decrement } = useCartItem(
    product
      ? {
          id: product.id,
          title: product.title,
          price: product.price,
          old_price: product.old_price,
          imageFile: product.images?.[0]?.file ?? null,
        }
      : { id: 0, title: '', price: 0, old_price: null, imageFile: null },
  )

  useBackButton()

  useEffect(() => {
    if (isError) navigate(-1)
  }, [isError, navigate])

  // ── Skeleton ──────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={styles.page}>
        <SkeletonBlock aspectRatio="4/3" borderRadius="0" />
        <div className={styles.content} style={{ gap: '12px', paddingTop: 20 }}>
          <SkeletonLine width="70%" height={22} />
          <SkeletonLine width="40%" height={28} />
          <SkeletonLine />
          <SkeletonLine />
          <SkeletonLine width="60%" />
        </div>
      </div>
    )
  }

  if (!product) return null

  const discount = product.discount ?? 0
  const hasAttrs =
    product.attributes != null && Object.keys(product.attributes).length > 0

  return (
    <div className={styles.page}>
      {/* Photo gallery — ref: ProductsSlider.tsx */}
      <Gallery images={product.images ?? []} discount={discount} />

      {/* Main content */}
      <div className={styles.content}>
        {/* Title — ref: TitleModule.tsx, 18px semi-bold */}
        <h1 className={styles.title}>{product.title}</h1>

        {/* Price row — ref: PriceModule (not shown but inferred from styles) */}
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {product.price.toLocaleString('ru-RU')} ₽
          </span>
          {product.old_price != null && product.old_price > product.price && (
            <span className={styles.oldPrice}>
              {product.old_price.toLocaleString('ru-RU')} ₽
            </span>
          )}
        </div>

        {/* Description — ref: ProductDescription.tsx, 3-line clamp + expand */}
        {product.description && (
          <Description text={product.description} />
        )}

        {/* Attributes collapse — ref: CommonAttributeList + Collapse */}
        {hasAttrs && (
          <AttributesSection attributes={product.attributes!} />
        )}
      </div>

      {/* Sticky bottom bar — ref: ProductButton.tsx / Actions */}
      <div className={styles.bottomBar}>
        {quantity > 0 ? (
          <div className={styles.bottomBarRow}>
            <div className={styles.stepper} role="group" aria-label="Количество в корзине">
              <button
                className={styles.stepBtn}
                onClick={decrement}
                disabled={isCartLoading}
                aria-label="Уменьшить количество"
              >
                −
              </button>
              <span className={styles.stepQty} aria-live="polite">{quantity}</span>
              <button
                className={styles.stepBtn}
                onClick={increment}
                disabled={isCartLoading}
                aria-label="Увеличить количество"
              >
                +
              </button>
            </div>
            <button
              className={`${styles.cartBtn} ${styles.cartBtnInCart}`}
              onClick={() => navigate(ROUTES.CART)}
              style={{ flex: 1 }}
            >
              В корзину
            </button>
          </div>
        ) : (
          <button
            className={styles.cartBtn}
            onClick={add}
            disabled={isCartLoading}
          >
            {isCartLoading ? 'Добавляем...' : 'Добавить в корзину'}
          </button>
        )}
      </div>
    </div>
  )
}
