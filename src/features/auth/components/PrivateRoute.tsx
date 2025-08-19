import { useSelector } from "react-redux"
import { Navigate, Outlet, useLocation, useMatch } from "react-router"
import { type AuthState } from "../redux/authSlice"

export const PrivateRoute = () => {
    const matchLogin = useMatch('login')
    const location = useLocation()
    // const { from = '/' } = location.state ?? {}
    const user = useSelector((state: { auth: AuthState }) => state.auth.user)

    if (!user && !matchLogin) {
        return <Navigate to="login" state={{ from: location.pathname }} replace />
    }
    if (user && matchLogin) {
        return <Navigate to={'/'} replace />
    }

    return <Outlet />
}