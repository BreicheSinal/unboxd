# Rollback Runbook

## Rollback Conditions
- Data integrity regression.
- Error budget burn > threshold for 10+ minutes.
- Payment/order creation failing in production.

## Steps
1. Identify last healthy production deployment.
2. Promote rollback deployment in Vercel.
3. Confirm Vercel API route compatibility with current Firestore schema.
4. Validate smoke checks: sign-in, closet read, trade submit, COD order.
5. Announce incident status and track follow-up patch.

## Post Rollback
- Freeze further deploys to production until root cause is documented and fixed.
