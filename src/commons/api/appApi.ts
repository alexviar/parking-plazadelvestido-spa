import type { Action } from '@reduxjs/toolkit'
import { createApi, retry } from '@reduxjs/toolkit/query/react'
import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { REHYDRATE } from 'redux-persist'
import { baseQuery } from './baseQuery'
import { keysToCamel, keysToUnderscore } from './utils/keyMapper'
import { refreshSession, refreshSessionIfExpired } from './utils/session'

const staggeredBaseQuery = retry<typeof baseQuery>((async (args, api, extraOptions) => {
  if (typeof args === 'string') {
    args = {
      url: args,
    }
  }
  if (args.body && !(args.body instanceof FormData)) args.body = keysToUnderscore(args.body)
  args.credentials = "include"
  args.mode = "cors"

  await refreshSessionIfExpired()

  let result = await baseQuery(args, api, extraOptions)

  if (
    result.error?.status === 419
    && (result.error?.data as { message: string } | undefined)?.message === 'CSRF token mismatch.'
  ) {
    await refreshSession()
    result = await baseQuery(args, api, extraOptions)
  }

  result.data = keysToCamel(result.data)
  result.error = keysToCamel(result.error)

  if (result.error && result.meta?.request.method !== 'GET') {
    retry.fail(result.error, result.meta)
  }

  const status = result.error?.status
  if (typeof status === 'number') {
    retry.fail(result.error, result.meta)
  }

  return result

}) as typeof baseQuery, {
  maxRetries: 1,
})

function isHydrateAction(action: Action): action is Action<typeof REHYDRATE> & {
  key: string
  payload: any
  err: unknown
} {
  return action.type === REHYDRATE
}

export const appApi = createApi({
  baseQuery: staggeredBaseQuery,
  endpoints: () => ({}),
  keepUnusedDataFor: 60 * 60 * 24,
  refetchOnFocus: true,
  refetchOnMountOrArgChange: true,
  extractRehydrationInfo(action, { reducerPath }): any {
    if (isHydrateAction(action)) {
      // When persisting the root reducer
      return action.payload?.[reducerPath]
    }
  },
})

export function useResetApiState() {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(appApi.util.resetApiState())
  }, [dispatch])
}