import { createSlice } from "@reduxjs/toolkit";
import { tariffsApi } from "./tariffsApi";
import type { Tariff } from "./types";

export const tariffsSlice = createSlice({
  name: 'tariffs',
  initialState: [] as Tariff[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      (action) => tariffsApi.endpoints.getTariffs.matchFulfilled(action),
      (_, { payload }) => {
        return payload.data
      }
    )
  }

})