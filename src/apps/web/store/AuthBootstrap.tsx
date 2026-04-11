import { ReactNode, useEffect } from "react";
import { User, getRedirectResult, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { hasAdminClaim, isAdminOnlyEmail } from "../services/adminOnlyAccess";
import { startPresenceTracking, stopPresenceTracking } from "../services/presenceService";
import { upsertUserProfile } from "../services/userService";
import type { UserProfile } from "../types/domain";
import { useAppDispatch } from "./hooks";
import {
  authBootstrapCompleted,
  clearAuthenticatedUser,
  setAuthenticatedUser,
} from "./authSlice";

function profileFromFirebaseUser(firebaseUser: User): UserProfile {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? "",
    displayName:
      firebaseUser.displayName ?? (firebaseUser.email?.split("@")[0] ?? "User"),
    photoURL: firebaseUser.photoURL ?? undefined,
    provider:
      firebaseUser.providerData[0]?.providerId === "google.com" ? "google" : "email",
    role: "user",
    favoriteLeagues: [],
    sizePreferences: [],
    theme: "dark",
  };
}

export function AuthBootstrap({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!auth) {
      dispatch(authBootstrapCompleted());
      return;
    }

    // Consume any pending redirect result first. We no longer use
    // signInWithRedirect, but call this as a safety net for any session that
    // was initiated before this version was deployed.
    const redirectPromise = getRedirectResult(auth).catch((err) => {
      console.error("getRedirectResult failed:", err);
      return null;
    });

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        stopPresenceTracking();
        // Wait for a potential redirect result before declaring the user
        // signed out. This avoids a flash to sign-in on redirect return.
        await redirectPromise;
        if (!auth.currentUser) {
          dispatch(clearAuthenticatedUser());
        }
        return;
      }

      const blockedByEmail = isAdminOnlyEmail(firebaseUser.email);
      const blockedByClaim = blockedByEmail
        ? false
        : await hasAdminClaim(firebaseUser, true).catch(() => false);
      if (blockedByEmail || blockedByClaim) {
        stopPresenceTracking();
        await signOut(auth).catch(() => undefined);
        dispatch(clearAuthenticatedUser());
        return;
      }

      startPresenceTracking(firebaseUser);

      // Immediately admit the user with Firebase Auth data so the app is
      // accessible without blocking on Firestore round-trips. Critical on iOS
      // where network latency or App Check can make Firestore slow to respond.
      dispatch(setAuthenticatedUser(profileFromFirebaseUser(firebaseUser)));

      // Enrich with full Firestore profile in the background.
      try {
        const profile = await upsertUserProfile(firebaseUser);
        dispatch(setAuthenticatedUser(profile));
      } catch (error) {
        console.error("Firestore profile sync failed:", error);
        // User is already signed in with the fallback profile above; no action needed.
      }
    });

    return () => {
      unsubscribe();
      stopPresenceTracking();
    };
  }, [dispatch]);

  return <>{children}</>;
}
