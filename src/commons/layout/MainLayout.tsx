import { type ReactNode } from 'react';
import { LuChartBar, LuHouse, LuLogOut, LuQrCode, LuSettings } from 'react-icons/lu';
import { NavLink } from 'react-router';
import logo from '../../assets/logo.jpg';
import { useLogoutMutation } from '../../features/auth/api/authApi';
import { UserRoles } from '../../features/auth/api/types';
import { useUser } from '../../features/auth/hooks/useUser';

interface AppLayoutProps {
  children?: ReactNode;
  banner?: ReactNode;
}

export function MainLayout({ children, banner }: AppLayoutProps) {

  const [logout] = useLogoutMutation()

  const operatorNavItems = [
    { name: 'Escanear', path: '/scanner', icon: LuQrCode },
  ];

  const adminNavItems = [
    { name: 'Dashboard', path: '/', icon: LuHouse },
    { name: 'Tarifas', path: '/tariffs', icon: LuSettings },
    { name: 'Historial', path: '/history', icon: LuChartBar },
  ];

  const user = useUser()
  const navItems = user?.role === UserRoles.Admin ? adminNavItems : operatorNavItems;

  return (
    <div className="min-h-dvh flex flex-col bg-gray-50">

      {/* Header */}
      <header className="relative z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Plaza del vestido</h1>
              <p className="text-xs text-gray-500">Usuario</p>
            </div>
          </div>
          <div className='flex items-center gap-2'>
            {/* {user?.role === UserRoles.Admin && <Link
              to="/tickets/scanner"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LuScanQrCode className="h-5 w-5 text-gray-600" />
            </Link>} */}
            <button
              onClick={() => logout()}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LuLogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className='relative'>
        <div className="absolute top-0 left-0 right-0 z-50">
          {banner}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 flex-1 flex flex-col">
        {children}
      </main>

      {/* Bottom Navigation */}
      {navItems.length > 1 && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="px-4">
            <div className="flex">
              {navItems.map((item) => {
                return (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    className={({ isActive }) => `flex-1 flex flex-col items-center py-3 px-3 text-xs ${isActive
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-blue-600'
                      }`}
                  >
                    <item.icon className="h-6 w-6 mb-1" />
                    <span>{item.name}</span>
                  </NavLink>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}