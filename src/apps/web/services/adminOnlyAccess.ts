import type { User } from "firebase/auth";

const ADMIN_ONLY_EMAILS = new Set([
  "sinalbreiche@gmail.com",
  "jadbr22@gmail.com",
]);

export function normalizeEmail(value: string | null | undefined): string {
  return String(value ?? "").trim().toLowerCase();
}

export function isAdminOnlyEmail(value: string | null | undefined): boolean {
  const email = normalizeEmail(value);
  return email.length > 0 && ADMIN_ONLY_EMAILS.has(email);
}

export async function hasAdminClaim(user: User, forceRefresh = false): Promise<boolean> {
  const token = await user.getIdTokenResult(forceRefresh);
  return token.claims.admin === true;
}

export function createAdminOnlyWebAccessError() {
  return Object.assign(
    new Error("This account can only sign in through the admin portal."),
    { code: "auth/admin-only-web-access" },
  );
}

