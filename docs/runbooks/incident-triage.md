# Incident Triage Runbook

## Trigger
- Alert from Sentry/Firebase logs/CI deploy checks.

## Immediate Steps
1. Identify scope (auth, firestore, functions, payments).
2. Confirm environment affected (staging or production).
3. Check latest deploy and rollback candidate.
4. Assign incident owner and start timeline log.

## Diagnosis
1. Review Sentry issue traces and release tags.
2. Check Vercel function logs for error spikes.
3. Validate Firestore/Rules deployment status.
4. Validate external provider health (Wish API).

## Mitigation
1. Disable Wish flow (`VITE_WISH_ENABLED=false`) if payment instability detected.
2. Re-route to COD-only fallback.
3. Rollback to last healthy release if data integrity is at risk.

## Exit Criteria
- Error rates return to baseline.
- Critical user flow test passes (signin, listing, trade submit, order create).
- Post-incident report created.
