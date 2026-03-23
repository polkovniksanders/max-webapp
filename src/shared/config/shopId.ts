// Resolves shop ID with the following priority:
// 1. MAX Bridge deep link start_param (production, inside MAX messenger)
// 2. URL query param ?shop_id=... (web link to clients)
// Called lazily so window.WebApp is guaranteed to be initialized by call time.
export const getShopId = (): number => {
  const startParam = window.WebApp?.initDataUnsafe?.start_param
  if (startParam) {
    const id = parseInt(startParam, 10)
    if (!isNaN(id)) return id
  }

  const urlParam = new URLSearchParams(window.location.search).get('shop_id')
  if (urlParam) {
    const id = parseInt(urlParam, 10)
    if (!isNaN(id)) return id
  }

  return 369 // default fallback
}
