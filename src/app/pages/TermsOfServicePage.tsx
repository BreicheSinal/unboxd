export function TermsOfServicePage() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-3 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-muted-foreground">Last updated: March 25, 2026</p>

        <div className="space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By using Unboxd, you agree to these Terms of Service. If you do not agree,
              do not use the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">2. Accounts</h2>
            <p>
              You are responsible for maintaining account security and for all activity under
              your account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">3. Orders and Trades</h2>
            <p>
              Product listings, trade availability, and delivery estimates may change. We reserve
              the right to limit or cancel suspicious activity.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">4. Payments and Refunds</h2>
            <p>
              Payments must be authorized and valid. Refund eligibility depends on order state and
              platform policy.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">5. Prohibited Conduct</h2>
            <p>
              Fraud, abuse, harassment, or attempts to manipulate listings and trades are
              prohibited.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">6. Contact</h2>
            <p>
              For legal questions, contact support through the channels listed on the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
