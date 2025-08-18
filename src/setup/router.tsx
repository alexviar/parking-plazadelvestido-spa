import { createBrowserRouter } from "react-router";
import { PrivateRoute } from "../features/auth/components/PrivateRoute";
import { TicketScanner } from "../features/tickets/components/TicketScanner";

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <TicketScanner />
      }
    ]
  }
]);