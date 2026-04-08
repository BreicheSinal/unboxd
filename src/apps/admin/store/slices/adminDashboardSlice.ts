import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminSummary } from "../../services/adminApi";
import type { AdminSummary } from "../../types";

interface AdminDashboardState {
  summary: AdminSummary | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminDashboardState = {
  summary: null,
  isLoading: false,
  error: null,
};

export const loadAdminSummary = createAsyncThunk("adminDashboard/loadSummary", async () => {
  return fetchAdminSummary();
});

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAdminSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(loadAdminSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load admin summary.";
      });
  },
});

export default adminDashboardSlice.reducer;
