import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAdminListings, moderateAdminListing } from "../../services/adminApi";
import type { AdminListing } from "../../types";

interface AdminListingsState {
  entities: Record<string, AdminListing>;
  ids: string[];
  nextCursor: string | null;
  hasLoaded: boolean;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminListingsState = {
  entities: {},
  ids: [],
  nextCursor: null,
  hasLoaded: false,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const loadAdminListings = createAsyncThunk(
  "adminListings/load",
  async (payload: { status?: string; cursor?: string | null; limit?: number } | undefined) => {
    return fetchAdminListings(payload ?? {});
  },
);

export const moderateListing = createAsyncThunk(
  "adminListings/moderate",
  async (payload: { listingId: string; action: "approve" | "reject" }) => {
    await moderateAdminListing(payload);
    return payload;
  },
);

const adminListingsSlice = createSlice({
  name: "adminListings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminListings.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAdminListings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.nextCursor = action.payload.nextCursor;
        state.entities = {};
        state.ids = action.payload.items.map((item) => {
          state.entities[item.id] = item;
          return item.id;
        });
      })
      .addCase(loadAdminListings.rejected, (state, action) => {
        state.isLoading = false;
        state.hasLoaded = true;
        state.error = action.error.message ?? "Failed to load listings.";
      })
      .addCase(moderateListing.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(moderateListing.fulfilled, (state, action) => {
        state.isUpdating = false;
        const listingId = action.payload.listingId;
        delete state.entities[listingId];
        state.ids = state.ids.filter((id) => id !== listingId);
      })
      .addCase(moderateListing.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message ?? "Failed to moderate listing.";
      });
  },
});

export const selectAdminListings = (state: { adminListings: AdminListingsState }) =>
  state.adminListings.ids.map((id) => state.adminListings.entities[id]).filter(Boolean);

export default adminListingsSlice.reducer;
