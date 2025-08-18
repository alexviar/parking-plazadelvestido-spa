import { createBrowserRouter } from "react-router";
import { LoginPage } from "../features/auth/components/LoginPage";
import { PrivateRoute } from "../features/auth/components/PrivateRoute";
import { TicketScanner } from "../features/tickets/components/TicketScanner";

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <TicketScanner />
      },
      {
        path: '/login',
        element: <LoginPage />
      }
    ]
  }
]);