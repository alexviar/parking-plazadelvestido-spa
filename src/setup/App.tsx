import { LuLoaderCircle } from "react-icons/lu"
import { Provider } from "react-redux"
import { RouterProvider } from "react-router"
import { PersistGate } from "redux-persist/integration/react"
import { router } from "./router"
import { persistor, store } from "./store"

function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={<div className="h-dvh flex items-center justify-center"><LuLoaderCircle size='6rem' className="animate-spin" /></div>} persistor={persistor}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  )
}

export default App
