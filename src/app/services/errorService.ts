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
