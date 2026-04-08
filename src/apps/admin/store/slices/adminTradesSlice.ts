import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminTrades, transitionAdminTrade } from "../../services/adminApi";
import type { AdminTrade } from "../../types";

interface AdminTradesState {
  entities: Record<string, AdminTrade>;
  ids: string[];
  nextCursor: string | null;
  hasLoaded: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminTradesState = {
  entities: {},
  ids: [],
  nextCursor: null,
  hasLoaded: false,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const loadAdminTrades = createAsyncThunk(
  "adminTrades/load",
  async (payload: { status?: string; cursor?: string | null; limit?: number } | undefined) => {
    return fetchAdminTrades(payload ?? {});
  },
);

export const transitionTrade = createAsyncThunk(
  "adminTrades/transition",
  async (payload: { offerId: string; toStatus: string }) => {
    await transitionAdminTrade(payload);
    return payload;
  },
);

const adminTradesSlice = createSlice({
  name: "adminTrades",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminTrades.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAdminTrades.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.nextCursor = action.payload.nextCursor;
        state.entities = {};
        state.ids = action.payload.items.map((item) => {
          state.entities[item.id] = item;
          return item.id;
        });
      })
      .addCase(loadAdminTrades.rejected, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = action.error.message ?? "Failed to load trades.";
      })
      .addCase(transitionTrade.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(transitionTrade.fulfilled, (state, action) => {
        state.isUpdating = false;
        const existing = state.entities[action.payload.offerId];
        if (existing) {
          existing.status = action.payload.toStatus;
        }
      })
      .addCase(transitionTrade.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message ?? "Failed to transition trade.";
      });
  },
});

export const selectAdminTrades = (state: { adminTrades: AdminTradesState }) =>
  state.adminTrades.ids.map((id) => state.adminTrades.entities[id]).filter(Boolean);

export default adminTradesSlice.reducer;
