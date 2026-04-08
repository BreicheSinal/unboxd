import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { deleteAdminUser, fetchAdminUsers, setAdminUserAccess } from "../../services/adminApi";
import type { AdminUser } from "../../types";

interface AdminUsersState {
  entities: Record<string, AdminUser>;
  ids: string[];
  nextCursor: string | null;
  isLoading: boolean;
  isUpdating: boolean;
  error: string | null;
}

const initialState: AdminUsersState = {
  entities: {},
  ids: [],
  nextCursor: null,
  isLoading: false,
  isUpdating: false,
  error: null,
};

export const loadAdminUsers = createAsyncThunk(
  "adminUsers/load",
  async (payload: { query?: string; cursor?: string | null; limit?: number } | undefined) => {
    return fetchAdminUsers(payload ?? {});
  },
);

export const changeAdminUserAccess = createAsyncThunk(
  "adminUsers/changeAccess",
  async (payload: { uid: string; disabled: boolean }) => {
    await setAdminUserAccess(payload);
    return payload;
  },
);

export const deleteAdminUserAccount = createAsyncThunk(
  "adminUsers/deleteUser",
  async (payload: { uid: string }) => {
    await deleteAdminUser(payload);
    return payload;
  },
);

const adminUsersSlice = createSlice({
  name: "adminUsers",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAdminUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loadAdminUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nextCursor = action.payload.nextCursor;
        state.entities = {};
        state.ids = action.payload.items.map((item) => {
          state.entities[item.uid] = item;
          return item.uid;
        });
      })
      .addCase(loadAdminUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? "Failed to load users.";
      })
      .addCase(changeAdminUserAccess.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(changeAdminUserAccess.fulfilled, (state, action) => {
        state.isUpdating = false;
        const existing = state.entities[action.payload.uid];
        if (existing) {
          existing.disabled = action.payload.disabled;
        }
      })
      .addCase(changeAdminUserAccess.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message ?? "Failed to change user access.";
      })
      .addCase(deleteAdminUserAccount.pending, (state) => {
        state.isUpdating = true;
      })
      .addCase(deleteAdminUserAccount.fulfilled, (state, action) => {
        state.isUpdating = false;
        delete state.entities[action.payload.uid];
        state.ids = state.ids.filter((id) => id !== action.payload.uid);
      })
      .addCase(deleteAdminUserAccount.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.error.message ?? "Failed to delete user.";
      });
  },
});

export const selectAdminUsers = (state: { adminUsers: AdminUsersState }) =>
  state.adminUsers.ids.map((id) => state.adminUsers.entities[id]).filter(Boolean);

export default adminUsersSlice.reducer;
