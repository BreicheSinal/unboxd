import { FormEvent, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Mail } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { sendPasswordReset } from "../store/authSlice";
import { mapFirebaseError } from "../services/errorService";
import { Spinner } from "../components/ui/spinner";

export function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      await dispatch(sendPasswordReset({ email: email.trim() })).unwrap();
      setSuccess("If an account exists for this email, a reset link has been sent.");
    } catch (err) {
      setError(mapFirebaseError(err));
    }
  };

  return (
    <div className="relative w-full px-4 py-8 [@media(max-width:450px)]:px-0">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-10 h-56 w-56 rounded-full bg-red-500/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-rose-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-xl">
        <div className="border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] p-4 text-[var(--brand-light-purple)] shadow-xl md:p-6 [@media(max-width:450px)]:border-x-0 [@media(max-width:450px)]:p-0 [@media(max-width:450px)]:shadow-none">
          <Link
            to="/signin"
            className="mb-4 inline-flex min-h-11 items-center gap-2 border border-[var(--brand-light-purple)]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand-light-purple)]/75 transition-colors hover:text-[var(--brand-light-purple)]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-vivid-red)]">
            Account Recovery
          </p>
          <h1 className="mb-3 text-4xl font-black uppercase leading-[0.95]">Reset Password</h1>
          <p className="mb-6 text-[var(--brand-light-purple)]/70">
            Enter your email and we will send you a reset link.
          </p>

          {error && (
            <div className="mb-4 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 border border-emerald-500/35 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-light-purple)]/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full border border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)] py-3 pl-10 pr-4 text-[var(--brand-light-purple)] placeholder:text-[var(--brand-light-purple)]/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#c30f37] disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Spinner className="h-4 w-4" tone="black" />
                  <span className="loading-shimmer-text-light">Sending</span>
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-[var(--brand-light-purple)]/65">
            Remembered it?{" "}
            <Link to="/signin" className="font-medium text-[var(--brand-vivid-red)] hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
