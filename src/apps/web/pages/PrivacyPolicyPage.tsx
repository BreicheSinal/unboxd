export function PrivacyPolicyPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-3 text-4xl font-bold">Privacy Policy</h1>
        <p className="mb-8 text-muted-foreground">Last updated: March 25, 2026</p>

        <div className="space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">1. Information We Collect</h2>
            <p>
              We may collect account details, order and trade activity, and technical usage data
              necessary to operate the service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">2. How We Use Data</h2>
            <p>
              We use your data to provide account access, process orders, enable trades, and
              improve product experience.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">3. Data Sharing</h2>
            <p>
              We do not sell personal data. Data may be shared with payment, shipping, and hosting
              providers strictly for service delivery.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">4. Security</h2>
            <p>
              We apply reasonable safeguards, but no system is completely secure. Users should keep
              credentials confidential.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">5. Your Choices</h2>
            <p>
              You can request account updates or deletion subject to legal and operational
              requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">6. Contact</h2>
            <p>
              For privacy requests, contact support through the channels listed on the platform.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
