import logo from '../../../assets/logo.jpg'
import LoginForm from './LoginForm'

export const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-600 rounded-full overflow-hidden mb-4">
              <img
                src={logo}
                alt="App logo"
                className="w-full h-full"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Plaza del Vestido</h1>
            <p className="text-gray-600 mt-2">Sistema de Gestión de Estacionamiento</p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}