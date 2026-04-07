export function HelpCenterPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-3 text-4xl font-bold">Help Center</h1>
        <p className="mb-8 text-muted-foreground">
          Find quick answers about orders, trades, accounts, and delivery.
        </p>

        <div className="space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">Orders</h2>
            <p>
              Track order status from your dashboard. If an order is delayed, check shipping updates
              before contacting support.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">Trades</h2>
            <p>
              Open the marketplace to submit offers and monitor status changes in the trade flow.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">Account</h2>
            <p>
              Use Sign In/Sign Up screens for access. Keep credentials secure and update profile
              details from your dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
