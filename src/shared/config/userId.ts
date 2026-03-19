import { getWebApp } from '@shared/bridge'

/** Dev fallback user ID — mirrors the hardcoded ID used in API files */
const DEV_FALLBACK_USER_ID = 5492444

/**
 * Returns the current MAX messenger user ID.
 *
 * Priority:
 * 1. MAX Bridge `initDataUnsafe.user.id` (production, inside MAX)
 * 2. Hardcoded dev fallback (development without MAX Bridge)
 *
 * @returns Messenger user ID, always defined
 */
export const getMessengerUserId = (): number => {
  const bridgeId = getWebApp()?.initDataUnsafe?.user?.id
  return bridgeId ?? DEV_FALLBACK_USER_ID
}