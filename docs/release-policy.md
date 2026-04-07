# Release Policy

## Environments
- `dev`: active development and emulator testing.
- `staging`: full integration validation and smoke tests.
- `prod`: public traffic.

## Promotion Rules
1. All CI jobs must pass on `staging` before promoting to `main`.
2. `production-secret-gate` must pass before production release.
3. Any failing security scan blocks release.

## Branch Protection Requirements
- Require pull request reviews before merge to `main`.
- Require status checks: quality, functions, e2e-smoke, security.
- Disallow direct pushes to `main`.

## Rollback Rule
- Rollback immediately when user-facing critical flows fail or data integrity is at risk.
