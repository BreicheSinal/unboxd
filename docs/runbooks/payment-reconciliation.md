# Payment Reconciliation Failure Runbook

## Trigger
- `wishWebhook` failures.
- Unreconciled `orders` with provider `wish` for > 10 minutes.

## Actions
1. Check webhook signature failures in function logs.
2. Verify `WISH_WEBHOOK_SECRET` and `WISH_API_KEY` are current.
3. Retry reconciliation manually by replaying webhook payload.
4. For prolonged incident, disable Wish via feature flag and enforce COD.

## Data Checks
- `orders/{orderId}`: `paymentState`, `reconciliationStatus`, `updatedAt`.
- `transactions` document existence for paid orders.

## Recovery Done When
- Webhook success rate normal.
- Backlog of unreconciled orders cleared.
