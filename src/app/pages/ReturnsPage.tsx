export function ReturnsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-3 text-4xl font-bold">Returns</h1>
        <p className="mb-8 text-muted-foreground">Review return and refund guidelines.</p>

        <div className="space-y-6 text-sm leading-7 text-muted-foreground">
          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">Eligibility</h2>
            <p>
              Return requests must be submitted within the allowed return window and include valid
              order details.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">Condition</h2>
            <p>
              Items should be unworn and in original condition unless the return is for a damaged
              or incorrect shipment.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-bold text-foreground">Refunds</h2>
            <p>
              Approved refunds are processed to the original payment method after inspection.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
