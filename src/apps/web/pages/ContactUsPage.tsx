export function ContactUsPage() {
  return (
    <div className="py-12">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="mb-3 text-4xl font-bold">Contact Us</h1>
        <p className="mb-8 text-muted-foreground">
          Reach out for support related to orders, trades, payments, or account access.
        </p>

        <div className="space-y-5 text-sm leading-7 text-muted-foreground">
          <p>
            Email: <span className="text-foreground">support@unboxd.example</span>
          </p>
          <p>
            Response time: <span className="text-foreground">Within 24-48 hours</span>
          </p>
          <p>
            Include your order ID or trade ID to help us resolve your issue faster.
          </p>
        </div>
      </div>
    </div>
  );
}
