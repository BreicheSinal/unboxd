interface FirebaseLikeError {
  code?: string;
  message?: string;
}

export function mapFirebaseError(error: unknown): string {
  const candidate = error as FirebaseLikeError;
  const code = candidate?.code ?? "unknown";

  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Invalid email or password.";
    case "auth/email-already-in-use":
      return "This email is already registered.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completion.";
    case "auth/popup-blocked":
      return "Popup was blocked by the browser. Allow popups for this site and try again.";
    case "auth/operation-not-supported-in-this-environment":
      return "This browser environment blocks popup sign-in. Try again or use redirect sign-in.";
    case "auth/operation-not-allowed":
      return "Google sign-in is disabled in Firebase. Enable Google provider in Firebase Auth > Sign-in method.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for Firebase Auth. Add it in Firebase Auth > Settings > Authorized domains.";
    case "auth/invalid-app-credential":
      return "Firebase app credential is invalid. Verify your Firebase web app config values.";
    case "auth/network-request-failed":
      return "Network error while contacting Firebase Auth. Check connection and try again.";
    case "permission-denied":
    case "firestore/permission-denied":
      return "You do not have permission to perform this action.";
    case "failed-precondition":
      return "This action is not allowed in the current state.";
    case "unavailable":
      return "Service is temporarily unavailable. Please try again.";
    case "unauthenticated":
      return "Your session has expired. Please sign in again.";
    default:
      return candidate?.message || "Something went wrong. Please try again.";
  }
}
