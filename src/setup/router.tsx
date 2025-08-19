import { useEffect } from "react";
import { createBrowserRouter } from "react-router";
import { MainLayout } from "../commons/layout/MainLayout";
import { UserRoles } from "../features/auth/api/types";
import { LoginPage } from "../features/auth/components/LoginPage";
import { PrivateRoute } from "../features/auth/components/PrivateRoute";
import { useUser } from "../features/auth/hooks/useUser";
import { tariffsApi } from "../features/tariffs/api/tariffsApi";
import { TariffFormPage } from "../features/tariffs/components/TariffFormPage";
import { TariffIndexPage } from "../features/tariffs/components/TariffIndexPage";
import { TicketIndexPage } from "../features/tickets/components/TicketIndexPage";
import { TicketScanner } from "../features/tickets/components/TicketScanner";

const Home = () => {
  const user = useUser()

  const prefetch = tariffsApi.usePrefetch('getTariffs')
  useEffect(() => {
    prefetch({ page: 1, pageSize: 50 })
  }, [])


  return user?.role === UserRoles.Admin ? <MainLayout></MainLayout> : <TicketScanner />

}

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: '/tickets/scanner',
        element: <TicketScanner />
      },
      {
        path: '/login',
        element: <LoginPage />
      },
      {
        path: '/tariffs',
        children: [
          {
            index: true,
            element: <TariffIndexPage />
          },
          {
            path: 'new',
            element: <TariffFormPage key="new" />
          },
          {
            path: ':tariffId/edit',
            element: <TariffFormPage key="edit" />
          }
        ]
      },
      {
        path: '/tickets',
        children: [
          {
            index: true,
            element: <TicketIndexPage />
          }
        ]
      }
    ]
  },
  {
    path: '*',
    element: <MainLayout></MainLayout>
  }
]);