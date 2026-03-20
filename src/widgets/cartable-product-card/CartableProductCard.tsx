import { ProductCard } from '@entities/product'
import type { ApiProduct } from '@entities/product'
import { useCartItem } from '@entities/cart'

interface CartableProductCardProps {
  /** The product to render. */
  product: ApiProduct
  /** Called when the user taps the card body (navigate to product detail). */
  onClick: () => void
}

/**
 * ProductCard wired to cart state.
 *
 * Combines `ProductCard` with the `useCartItem` hook so every call-site
 * gets quantity controls and the "go to cart" icon without duplicating
 * the wiring logic. Used on both `MainPage` and `CategoryProductsPage`.
 *
 * @param product - The product to display.
 * @param onClick - Handler for tapping the card body.
 */
export const CartableProductCard = ({ product, onClick }: CartableProductCardProps) => {
  const { quantity, isLoading, add, increment, decrement } = useCartItem({
    id: product.id,
    title: product.title,
    price: product.price,
    old_price: product.old_price,
    imageFile: product.images?.[0]?.file ?? null,
    buyable: product.buyable,
  })

  return (
    <ProductCard
      product={product}
      onClick={onClick}
      cartQuantity={quantity}
      cartLoading={isLoading}
      onAddToCart={() => add()}
      onIncrement={() => increment()}
      onDecrement={() => decrement()}
    />
  )
}
