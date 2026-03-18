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
  endpoints: () => ({}),
})
