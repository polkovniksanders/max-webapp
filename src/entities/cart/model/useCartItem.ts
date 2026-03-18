import { useDispatch, useSelector } from 'react-redux'
import { useLazyReadCartQuery, useUpdateCartMutation, useDeleteCartMutation } from './cartApi'
import { addItem, removeItem, updateQuantity, setCartItemId } from './cartSlice'
import type { CartItem } from './cartSlice'
import { getShopId } from '@shared/config/shopId'
import { getMessengerUserId } from '@shared/config/userId'

export interface CartProduct {
  id: number
  title: string
  price: number
  old_price: number | null
  imageFile: string | null
}

type CartState = { cart: { items: CartItem[] } }

/**
 * Manages cart operations for a single product.
 *
 * Syncs Redux cart state with the backend API on every mutation.
 * After `add()`, immediately re-fetches the cart to obtain the server-assigned
 * cart item ID (needed for subsequent delete operations).
 *
 * @param product - The product to manage in the cart
 * @returns Cart item state and action handlers
 */
export const useCartItem = (product: CartProduct) => {
  const dispatch = useDispatch()
  const cartItem = useSelector((state: CartState) =>
    state.cart.items.find((i) => i.productId === product.id),
  )

  const [updateCart, { isLoading: isUpdating }] = useUpdateCartMutation()
  const [deleteCart, { isLoading: isDeleting }] = useDeleteCartMutation()
  const [readCart, { isFetching: isReading }] = useLazyReadCartQuery()

  const shopId = getShopId()
  const userId = getMessengerUserId()
  const quantity = cartItem?.quantity ?? 0
  const isLoading = isUpdating || isDeleting || isReading

  const add = async () => {
    await updateCart({
      messenger_user_id: userId,
      shop_id: shopId,
      product_id: product.id,
      quantity: 1,
    })
    dispatch(
      addItem({
        productId: product.id,
        title: product.title,
        price: product.price,
        old_price: product.old_price,
        imageFile: product.imageFile,
        quantity: 1,
      }),
    )
    // Fetch cart to get cartItemId assigned by API
    const result = await readCart({ shop_id: shopId, messenger_user_id: userId })
    const apiItem = result.data?.find((i) => i.product_id === product.id)
    if (apiItem) {
      dispatch(setCartItemId({ productId: product.id, cartItemId: apiItem.id }))
    }
  }

  const increment = async () => {
    const newQty = quantity + 1
    await updateCart({
      messenger_user_id: userId,
      shop_id: shopId,
      product_id: product.id,
      quantity: newQty,
    })
    dispatch(updateQuantity({ productId: product.id, quantity: newQty }))
  }

  const decrement = async () => {
    if (quantity <= 1) {
      if (cartItem?.cartItemId) {
        await deleteCart({
          id: cartItem.cartItemId,
          messenger_user_id: userId,
          shop_id: shopId,
        })
      }
      dispatch(removeItem(product.id))
    } else {
      const newQty = quantity - 1
      await updateCart({
        messenger_user_id: userId,
        shop_id: shopId,
        product_id: product.id,
        quantity: newQty,
      })
      dispatch(updateQuantity({ productId: product.id, quantity: newQty }))
    }
  }

  return { quantity, isLoading, add, increment, decrement }
}
