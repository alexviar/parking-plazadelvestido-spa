import { createBrowserRouter } from "react-router";
import { TicketScanner } from "../features/tickets/components/TicketScanner";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <TicketScanner />
  }
]);