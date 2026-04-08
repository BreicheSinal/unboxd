import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";
import { auth, googleProvider } from "../../../web/firebase/config";

interface AdminAuthUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
}

interface AdminAuthState {
  user: AdminAuthUser | null;
  isBootstrapping: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AdminAuthState = {
  user: null,
  isBootstrapping: true,
  isLoading: false,
  error: null,
};

async function mapAdminUser(firebaseUser: User, forceRefresh = false): Promise<AdminAuthUser> {
  const token = await firebaseUser.getIdTokenResult(forceRefresh);
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? firebaseUser.email?.split("@")[0] ?? "Admin",
    isAdmin: token.claims.admin === true,
  };
}

export const adminSignInWithEmail = createAsyncThunk(
  "adminAuth/signInWithEmail",
  async ({ email, password }: { email: string; password: string }) => {
    if (!auth) throw new Error("Firebase Auth is not configured.");
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return mapAdminUser(credential.user, true);
  },
);

export const adminSignInWithGoogle = createAsyncThunk("adminAuth/signInWithGoogle", async () => {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  const credential = await signInWithPopup(auth, googleProvider);
  return mapAdminUser(credential.user, true);
});

export const adminSignOut = createAsyncThunk("adminAuth/signOut", async () => {
  if (!auth) throw new Error("Firebase Auth is not configured.");
  await signOut(auth);
});

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminUser(state, action: { payload: AdminAuthUser | null }) {
      state.user = action.payload;
      state.isBootstrapping = false;
      state.error = null;
    },
    setAdminBootstrapped(state) {
      state.isBootstrapping = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminSignInWithEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminSignInWithGoogle.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(adminSignInWithEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(adminSignInWithGoogle.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(adminSignOut.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
      })
      .addMatcher(
        (action) =>
          action.type === adminSignInWithEmail.rejected.type ||
          action.type === adminSignInWithGoogle.rejected.type ||
          action.type === adminSignOut.rejected.type,
        (state, action: any) => {
          state.isLoading = false;
          state.error = action.error?.message ?? "Authentication failed.";
        },
      );
  },
});

export function subscribeAdminAuth(dispatch: (action: unknown) => void) {
  if (!auth) {
    dispatch(setAdminBootstrapped());
    return () => {};
  }

  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser) {
      dispatch(setAdminUser(null));
      return;
    }
    const adminUser = await mapAdminUser(firebaseUser).catch(() => null);
    dispatch(setAdminUser(adminUser));
  });
}

export const { setAdminUser, setAdminBootstrapped } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
