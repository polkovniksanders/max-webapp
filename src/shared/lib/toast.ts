import { toast as sonnerToast } from 'sonner'

/**
 * App-wide toast notification helpers.
 *
 * Wraps `sonner` with consistent durations and styles so call sites
 * never have to configure options themselves.
 *
 * Usage:
 *   import { toast } from '@shared/lib/toast'
 *   toast.success('Товар добавлен в корзину')
 *   toast.error('Не удалось оформить заказ')
 */
export const toast = {
  success: (message: string) =>
    sonnerToast.success(message, { duration: 3000 }),

  error: (message: string) =>
    sonnerToast.error(message, { duration: 5000 }),

  info: (message: string) =>
    sonnerToast(message, { duration: 3000 }),

  warning: (message: string) =>
    sonnerToast.warning(message, { duration: 4000 }),

  /** Promise toast — shows loading → success/error automatically */
  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) =>
    sonnerToast.promise(promise, messages),
}
