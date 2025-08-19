import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore, type PersistConfig } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { appApi } from '../commons/api/appApi'
import { authSlice } from '../features/auth/redux/authSlice'
import { tariffsSlice } from '../features/tariffs/api/tariffsSlice'
import { offlineQueueSlice } from '../features/tickets/redux/offlineQueueSlice'

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  [authSlice.reducerPath]: authSlice.reducer,
  [tariffsSlice.reducerPath]: tariffsSlice.reducer,
  offlineQueue: offlineQueueSlice.reducer,
})

type RootState = ReturnType<typeof rootReducer>


const persistConfig: PersistConfig<RootState> = {
  key: 'root',
  storage,
  blacklist: [appApi.reducerPath],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER', 'persist/FLUSH'],
      },
    }).concat(
      appApi.middleware
    )
})

setupListeners(store.dispatch)

export const persistor = persistStore(store)