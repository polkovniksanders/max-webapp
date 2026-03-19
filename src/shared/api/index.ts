import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getWebApp } from '@shared/bridge'

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const initData = getWebApp()?.initData
      if (initData) headers.set('init-data', initData)
      return headers
    },
  }),
  // Global defaults — overridden per-endpoint where needed
  keepUnusedDataFor: 300,    // 5 min fallback for anything not explicitly set
  refetchOnFocus: false,     // mini-app: no tab-switch refetches
  refetchOnReconnect: true,  // re-fetch stale data when network comes back
  endpoints: () => ({}),
})
