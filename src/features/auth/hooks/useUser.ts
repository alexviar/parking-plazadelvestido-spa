import { useSelector } from "react-redux"
import type { AuthAwareState } from "../redux/authSlice"

export function useUser() {
    return useSelector((state: AuthAwareState) => state.auth?.user)
}