import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { upsertUserProfile } from "../services/userService";
import type { UserProfile } from "../types/domain";

type SerializableUserProfile = Omit<UserProfile, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

interface AuthState {
  user: SerializableUserProfile | null;
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

function serializeUserProfile(profile: UserProfile): SerializableUserProfile {
  return {
    ...profile,
    createdAt: profile.createdAt ? profile.createdAt.toISOString() : undefined,
    updatedAt: profile.updatedAt ? profile.updatedAt.toISOString() : undefined,
  };
}

function getFirebaseAuth() {
  if (!auth) {
    throw new Error("Firebase Auth is not configured");
  }
  return auth;
}


export const signInWithEmail = createAsyncThunk(
  "auth/signInWithEmail",
  async ({ email, password }: { email: string; password: string }) => {
    const firebaseAuth = getFirebaseAuth();
    const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    await upsertUserProfile(credential.user);
  },
);

export const signUpWithEmail = createAsyncThunk(
  "auth/signUpWithEmail",
  async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const firebaseAuth = getFirebaseAuth();
    const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

    if (name.trim()) {
      await updateProfile(credential.user, { displayName: name.trim() });
    }
    await upsertUserProfile(credential.user);
  },
);

export const signInWithGoogle = createAsyncThunk("auth/signInWithGoogle", async () => {
  // getFirebaseAuth is now synchronous — no await means the user-gesture context is
  // preserved on iOS Safari, which requires window.open() to be reachable without
  // crossing an async boundary caused by a network/storage operation.
  const firebaseAuth = getFirebaseAuth();

  try {
    const credential = await signInWithPopup(firebaseAuth, googleProvider);
    await upsertUserProfile(credential.user);
  } catch (error: unknown) {
    const code = (error as { code?: string } | null)?.code;
    if (
      code === "auth/popup-blocked" ||
      code === "auth/operation-not-supported-in-this-environment"
    ) {
      await signInWithRedirect(firebaseAuth, googleProvider);
      return;
    }
    throw error;
  }
});

export const signOutUser = createAsyncThunk("auth/signOut", async () => {
  const firebaseAuth = getFirebaseAuth();
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
    setAuthenticatedUser: {
      reducer(state, action: PayloadAction<SerializableUserProfile>) {
        state.user = action.payload;
        state.error = null;
        state.isBootstrapping = false;
        state.isLoading = false;
      },
      prepare(profile: UserProfile) {
        return { payload: serializeUserProfile(profile) };
      },
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
