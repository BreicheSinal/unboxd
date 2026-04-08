import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminTransactions } from "../../services/adminApi";
import type { AdminTransaction } from "../../types";

interface AdminTransactionsState {
  entities: Record<string, AdminTransaction>;
  ids: string[];
  nextCursor: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminTransactionsState = {
  entities: {},
  ids: [],
  nextCursor: null,
  isLoading: false,
  error: null,
};

export const loadAdminTransactions = createAsyncThunk(
  "adminTransactions/load",
  async (payload: { status?: string; type?: string; cursor?: string | null; limit?: number } | undefined) => {
    return fetchAdminTransactions(payload ?? {});
  },
);

const adminTransactionsSlice = createSlice({
  name: "adminTransactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAdminTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nextCursor = action.payload.nextCursor;
        state.entities = {};
        state.ids = action.payload.items.map((item) => {
          state.entities[item.id] = item;
          return item.id;
        });
      })
      .addCase(loadAdminTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load transactions.";
      });
  },
});

export const selectAdminTransactions = (state: { adminTransactions: AdminTransactionsState }) =>
  state.adminTransactions.ids.map((id) => state.adminTransactions.entities[id]).filter(Boolean);

export default adminTransactionsSlice.reducer;
