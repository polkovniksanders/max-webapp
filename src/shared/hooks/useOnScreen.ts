import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Определяет видимость элемента-сентинела через IntersectionObserver.
 * Используется для infinite scroll: когда targetRef-элемент попадает
 * во viewport, isOnScreen становится true → триггер загрузки данных.
 */
export function useOnScreen() {
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetNodeRef = useRef<Element | null>(null)
  const [isOnScreen, setIsOnScreen] = useState(false)

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => setIsOnScreen(entry.isIntersecting),
      { threshold: 0.01 },
    )

    if (targetNodeRef.current) {
      observerRef.current.observe(targetNodeRef.current)
    }

    return () => {
      observerRef.current?.disconnect()
    }
  }, [])

  const targetRef = useCallback((node: Element | null) => {
    if (targetNodeRef.current) {
      observerRef.current?.unobserve(targetNodeRef.current)
    }
    if (node) {
      targetNodeRef.current = node
      observerRef.current?.observe(node)
    }
  }, [])

  return { isOnScreen, targetRef }
}
