# Auth Outage Fallback Runbook

## Trigger
- Google/email login failures spike.
- `unauthenticated`/`permission-denied` across healthy sessions.

## Actions
1. Confirm Firebase Auth service status.
2. Validate frontend env and App Check site key.
3. Check token refresh behavior and logout/login recovery.
4. Pause risky writes by temporarily disabling actions that depend on fresh auth.

## User Messaging
- Show friendly banner: "Authentication is temporarily unavailable. Please retry shortly."

## Recovery Done When
- Sign-in success rate restored.
- Protected routes load and function calls succeed.
