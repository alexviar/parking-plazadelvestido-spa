import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { Ticket } from '../api/types';

export type OfflineItem = {
  id: string
  data: Ticket
  status: 'pending' | 'syncing' | 'synced' | 'failed'
}

type OfflineQueueState = OfflineItem[]

const initialState: OfflineQueueState = []

export const offlineQueueSlice = createSlice({
  name: 'offlineQueue',
  initialState,
  reducers: {
    addItem: {
      reducer(state, action: PayloadAction<OfflineItem>) {
        state.push(action.payload)
      },
      prepare(item: Omit<OfflineItem, 'id'> & { id?: string }) {
        return { payload: { ...item, id: item.id || uuidv4() } };
      },
    },
    updateItem: (state, action: PayloadAction<OfflineItem>) => {
      const index = state.findIndex(item => item.id === action.payload.id)
      if (index !== -1) {
        state[index] = action.payload
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state = state.filter(item => item.id !== action.payload)
    },
    clearAll: () => {
      return []
    },
  },
});

export const { addItem, updateItem, removeItem, clearAll } = offlineQueueSlice.actions