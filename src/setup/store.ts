import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { appApi } from '../commons/api/appApi'
import { offlineQueueSlice } from '../features/tickets/redux/offlineQueueSlice'

const rootReducer = combineReducers({
  [appApi.reducerPath]: appApi.reducer,
  offlineQueue: offlineQueueSlice.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
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