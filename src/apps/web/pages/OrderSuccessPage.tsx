import { CheckCircle2, Package } from "lucide-react";
import { Link, useSearchParams } from "react-router";

export function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const steps = [
    "Select Size",
    "Avoidants",
    "Summary",
    "Payment",
    "Success",
  ];
  const currentStep = steps.length;
  const confettiPieces = Array.from({ length: 36 }, (_, index) => ({
    id: index,
    left: `${Math.random() * 100}%`,
    duration: 6 + Math.random() * 4,
    delay: Math.random() * 1.2,
    rotate: Math.random() * 360,
    color: ["#ef4444", "#22c55e", "#3b82f6", "#f59e0b", "#ec4899", "#06b6d4"][index % 6],
  }));

  return (
    <div className="min-h-screen overflow-x-hidden py-12">
      <div className="container mx-auto max-w-2xl px-4">
        <div className="mx-auto mb-10 flex w-full max-w-3xl flex-col items-center">
          <div className="mx-auto w-full">
            <div
              className="hidden items-start justify-center gap-y-4 sm:grid"
              style={{ gridTemplateColumns: `repeat(${steps.length * 2 - 1}, max-content)` }}
            >
              {steps.map((_, index) => {
                const step = index + 1;
                const stepColumn = index * 2 + 1;
                return (
                  <div
                    key={step}
                    className="flex h-8 w-8 shrink-0 items-center justify-center justify-self-center rounded-full text-sm font-bold md:h-10 md:w-10 md:text-base"
                    style={{ gridColumn: stepColumn, gridRow: 1 }}
                  >
                    <div
                      className={`flex h-full w-full items-center justify-center rounded-full ${
                        step < currentStep
                          ? "bg-green-500 text-white"
                          : step === currentStep
                            ? "bg-gradient-to-br from-rose-500 to-red-700 text-white"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {step < currentStep ? (
                        <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5" />
                      ) : (
                        step
                      )}
                    </div>
                  </div>
                );
              })}
              {steps.slice(0, -1).map((_, index) => {
                const step = index + 1;
                return (
                  <div
                    key={`connector-${step}`}
                    className={`mx-2 h-1 w-20 rounded self-center md:w-28 lg:w-32 ${step < currentStep ? "bg-green-500" : "bg-muted"}`}
                    style={{ gridColumn: index * 2 + 2, gridRow: 1 }}
                  />
                );
              })}
              {steps.map((label, index) => (
                <span
                  key={`label-${label}`}
                  className="justify-self-center whitespace-nowrap text-sm text-muted-foreground"
                  style={{ gridColumn: index * 2 + 1, gridRow: 2 }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="mb-4 space-y-2 sm:hidden">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Step {currentStep} of {steps.length}
                </span>
                <span>{Math.round((currentStep / steps.length) * 100)}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-500 to-red-700 transition-all"
                  style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground sm:hidden">
            {steps[currentStep - 1]}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 text-center">
          <div className="pointer-events-none absolute inset-0">
            {confettiPieces.map((piece) => (
              <span
                key={piece.id}
                className="confetti-piece absolute top-[-24px] h-3 w-2 rounded-xs"
                style={{
                  left: piece.left,
                  backgroundColor: piece.color,
                  transform: `rotate(${piece.rotate}deg)`,
                  animationDuration: `${piece.duration}s`,
                  animationDelay: `${piece.delay}s`,
                }}
              />
            ))}
          </div>

          <div className="relative z-10 mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-500">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="relative z-10 mb-2 text-3xl font-bold">Order Placed</h1>
          <p className="relative z-10 mb-6 text-muted-foreground">
            Your COD order was placed successfully.
          </p>

          {orderId && (
            <div className="relative z-10 mb-8 rounded-lg border border-border bg-accent/50 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Order ID</p>
              <p className="mt-1 break-all font-mono text-sm">{orderId}</p>
            </div>
          )}

          <div className="relative z-10 grid gap-3 sm:grid-cols-2">
            <Link
              to="/closet"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 hover:bg-accent"
            >
              <Package className="h-4 w-4" />
              Go to Closet
            </Link>
            <Link
              to="/order"
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-rose-500 to-red-700 px-4 py-3 font-semibold text-white"
            >
              Place Another Order
            </Link>
          </div>
        </div>
      </div>
      <style>
        {`
          .confetti-piece {
            animation-name: confetti-fall;
            animation-timing-function: linear;
            animation-iteration-count: 2;
            animation-fill-mode: both;
          }

          @keyframes confetti-fall {
            0% {
              transform: translate3d(0, 0, 0) rotate(0deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            100% {
              transform: translate3d(0, 110vh, 0) rotate(540deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </div>
  );
}
