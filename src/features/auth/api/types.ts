export interface User {
  id: number
  name: string
  email: string
  role: UserRoles
}

export const UserRoles = {
  Admin: 1,
  Operator: 2,
} as const

export type UserRoles = (typeof UserRoles)[keyof typeof UserRoles]
