import { createSlice, isRejectedWithValue, type Slice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import type { User } from "../api/types";

export type AuthState = { user: User | null | undefined }

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null
  } as AuthState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => authApi.endpoints.login.matchFulfilled(action),
      (state, { payload }) => {
        state.user = payload.user
      }
    ).addMatcher(
      (action) => {
        return authApi.endpoints.logout.matchFulfilled(action)
          || (isRejectedWithValue(action) && action.payload.status === 401)
      },
      (state) => {
        state.user = null
      }
    )
  },
})

type InferedAwareState<T> = T extends Slice<infer State, any, infer Name> ? { [key in Name]: State } : never

export type AuthAwareState = InferedAwareState<typeof authSlice>