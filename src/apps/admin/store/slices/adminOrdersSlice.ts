import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminOrders, updateAdminOrder } from "../../services/adminApi";
import type { AdminOrder } from "../../types";

interface AdminOrdersState {
  entities: Record<string, AdminOrder>;
  ids: string[];
  nextCursor: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminOrdersState = {
  entities: {},
  ids: [],
  nextCursor: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const loadAdminOrders = createAsyncThunk(
  "adminOrders/load",
  async (payload: { status?: string; cursor?: string | null; limit?: number } | undefined) => {
    return fetchAdminOrders(payload ?? {});
  },
);

export const mutateAdminOrder = createAsyncThunk(
  "adminOrders/mutate",
  async (payload: { orderId: string; status?: string; paymentState?: string; reconciliationStatus?: string }) => {
    await updateAdminOrder(payload);
    return payload;
  },
);

const adminOrdersSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAdminOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nextCursor = action.payload.nextCursor;
        state.entities = {};
        state.ids = action.payload.items.map((item) => {
          state.entities[item.id] = item;
          return item.id;
        });
      })
      .addCase(loadAdminOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load orders.";
      })
      .addCase(mutateAdminOrder.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(mutateAdminOrder.fulfilled, (state, action) => {
        state.isUpdating = false;
        const existing = state.entities[action.payload.orderId];
        if (!existing) return;
        state.entities[action.payload.orderId] = {
          ...existing,
          ...(action.payload.status ? { status: action.payload.status } : {}),
          ...(action.payload.paymentState ? { paymentState: action.payload.paymentState } : {}),
          ...(action.payload.reconciliationStatus
            ? { reconciliationStatus: action.payload.reconciliationStatus }
            : {}),
        };
      })
      .addCase(mutateAdminOrder.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message ?? "Failed to update order.";
      });
  },
});

export const selectAdminOrders = (state: { adminOrders: AdminOrdersState }) =>
  state.adminOrders.ids.map((id) => state.adminOrders.entities[id]).filter(Boolean);

export default adminOrdersSlice.reducer;
