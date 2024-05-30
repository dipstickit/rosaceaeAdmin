import { User } from '../../types/user.type'

const userToken = localStorage.getItem('userToken') ?? null

type initialAuthStateTypes = {
  isLoading: boolean
  userInfo: User | null
  userToken: string | null
  error: any
  isSuccess: boolean
}

export const initialAuthState: initialAuthStateTypes = {
  isLoading: false,
  userInfo: null,
  userToken,
  error: null,
  isSuccess: false
}

export interface LoginArgs {
  email: string
  password: string
}
