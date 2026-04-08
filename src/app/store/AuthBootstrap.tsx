import { ReactNode, useEffect } from "react";
import { User, getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { upsertUserProfile } from "../services/userService";
import type { UserProfile } from "../types/domain";
import { useAppDispatch } from "./hooks";
import {
  authBootstrapCompleted,
  clearAuthenticatedUser,
  setAuthenticatedUser,
} from "./authSlice";

function fallbackProfileFromFirebaseUser(firebaseUser: User): UserProfile {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName: firebaseUser.displayName ?? (firebaseUser.email?.split("@")[0] ?? "User"),
    photoURL: firebaseUser.photoURL ?? undefined,
    provider: firebaseUser.providerData[0]?.providerId === "google.com" ? "google" : "email",
    role: "user",
    favoriteLeagues: [],
    sizePreferences: [],
    theme: "system",
  };
}

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth) {
      dispatch(authBootstrapCompleted());
      return;
    }

    // Process any pending redirect result before handling auth state.
    // On iOS, signInWithRedirect stores a pending credential that must be
    // consumed via getRedirectResult, otherwise onAuthStateChanged fires
    // null first and the app incorrectly lands back on the sign-in page.
    const redirectPromise = getRedirectResult(auth).catch((err) => {
      console.error("getRedirectResult failed:", err);
      return null;
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          // Wait for any pending redirect to resolve before clearing auth.
          // If the redirect signs the user in, onAuthStateChanged will fire
          // again with the user; otherwise we clear as normal.
          await redirectPromise;
          if (!auth.currentUser) {
            dispatch(clearAuthenticatedUser());
          }
          return;
        }

        const profile = await upsertUserProfile(firebaseUser);
        dispatch(setAuthenticatedUser(profile));
      } catch (error) {
        console.error("Firestore user bootstrap failed:", error);
        if (firebaseUser) {
          // Keep user signed in even if Firestore profile bootstrap fails.
          dispatch(setAuthenticatedUser(fallbackProfileFromFirebaseUser(firebaseUser)));
          return;
        }
        dispatch(clearAuthenticatedUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
