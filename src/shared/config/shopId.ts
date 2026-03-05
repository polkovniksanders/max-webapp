// Resolves shop ID from MAX deep link start_param, falls back to mock ID.
// Called lazily so window.WebApp is guaranteed to be initialized by call time.
export const getShopId = (): number => {
  const startParam = window.WebApp?.initDataUnsafe?.start_param
  if (startParam) {
    const id = parseInt(startParam, 10)
    if (!isNaN(id)) return id
  }
  return 12 // mock fallback
}