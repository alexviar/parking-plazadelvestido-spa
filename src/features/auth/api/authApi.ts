import { appApi } from "../../../commons/api/appApi";
import type { User } from "./types";

type Credentials = {
  email: string
  password: string
}

const TAG = 'Auth' as const

export const authApi = appApi
  .enhanceEndpoints({
    addTagTypes: [TAG]
  })
  .injectEndpoints({
    endpoints: (build) => ({
      getUser: build.query<User, void>({
        query: () => ({
          method: 'GET',
          url: 'user'
        }),
        providesTags: [TAG]

      }),

      login: build.mutation<{
        message: string
        user: User
      }, Credentials>({
        query: (body) => ({
          method: 'POST',
          url: 'login',
          body
        })
      }),

      logout: build.mutation<void, void>({
        query: () => ({
          method: 'POST',
          url: 'logout'
        })
      }),

      forgotPassword: build.mutation<void, {
        email: string
      }>({
        query: (body) => ({
          method: 'POST',
          url: 'forgot-password',
          body
        })
      }),

      resetPassword: build.mutation<void, {
        token: string
        email: string
        password: string
        passwordConfirmation: string
      }>({
        query: (body) => ({
          method: 'POST',
          url: 'reset-password',
          body
        })
      })
    })
  })

export const {
  useLoginMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation
} = authApi