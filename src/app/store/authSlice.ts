import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { upsertUserProfile } from "../services/userService";
import type { UserProfile } from "../types/domain";

interface AuthState {
  user: UserProfile | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isBootstrapping: true,
  error: null,
};

let persistenceInitialized = false;

async function getFirebaseAuth() {
  if (!auth) {
    throw new Error("Firebase Auth is not configured");
  }

  if (!persistenceInitialized) {
    await setPersistence(auth, browserLocalPersistence);
    persistenceInitialized = true;
  }

  return auth;
}

export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }: { email: string; password: string }) => {
    const firebaseAuth = await getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    await upsertUserProfile(credential.user);
  },
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const firebaseAuth = await getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    if (name.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }
    await upsertUserProfile(credential.user);
  },
);

export const signInWithGoogle = createAsyncThunk("auth/signInWithGoogle", async () => {
  const firebaseAuth = await getFirebaseAuth();
  const credential = await signInWithPopup(firebaseAuth, googleProvider);
  await upsertUserProfile(credential.user);
});

export const signOutUser = createAsyncThunk("auth/signOut", async () => {
  const firebaseAuth = await getFirebaseAuth();
  await signOut(firebaseAuth);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authBootstrapCompleted(state) {
      state.isBootstrapping = false;
      state.isLoading = false;
    },
    setAuthenticatedUser(state, action: PayloadAction<UserProfile>) {
      state.user = action.payload;
      state.error = null;
      state.isBootstrapping = false;
      state.isLoading = false;
    },
    clearAuthenticatedUser(state) {
      state.user = null;
      state.error = null;
      state.isBootstrapping = false;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        (action) =>
          action.type === signInWithEmail.rejected.type ||
          action.type === signUpWithEmail.rejected.type ||
          action.type === signInWithGoogle.rejected.type ||
          action.type === signOutUser.rejected.type,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error.message ?? "Authentication request failed";
        },
      )
      .addMatcher(
        (action) =>
          action.type === signInWithEmail.fulfilled.type ||
          action.type === signUpWithEmail.fulfilled.type ||
          action.type === signInWithGoogle.fulfilled.type ||
          action.type === signOutUser.fulfilled.type,
        (state) => {
          state.isLoading = false;
        },
      );
  },
});

export const { authBootstrapCompleted, setAuthenticatedUser, clearAuthenticatedUser } = authSlice.actions;
export default authSlice.reducer;
