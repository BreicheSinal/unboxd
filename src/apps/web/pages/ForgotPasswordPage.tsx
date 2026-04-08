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
    <div className="relative w-full px-4 [@media(max-width:450px)]:px-0">
      <div className="mx-auto w-full max-w-xl">
        <div className="rounded-2xl border border-border bg-card p-4 shadow-xl md:p-6 [@media(max-width:450px)]:rounded-none [@media(max-width:450px)]:border-0 [@media(max-width:450px)]:p-0 [@media(max-width:450px)]:shadow-none">
          <Link
            to="/signin"
            className="mb-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Sign In
          </Link>

          <h1 className="mb-2 text-3xl font-bold">Reset Password</h1>
          <p className="mb-6 text-muted-foreground">
            Enter your email and we will send you a password reset link.
          </p>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-lg border border-border bg-accent py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-700 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Spinner className="h-4 w-4" tone="black" />
                  <span className="loading-shimmer-text-light">Sending</span>
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link to="/signin" className="font-medium text-red-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
