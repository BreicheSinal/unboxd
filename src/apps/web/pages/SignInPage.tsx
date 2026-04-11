import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { GoogleIcon } from "../components/GoogleIcon";
import { Spinner } from "../components/ui/spinner";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInWithEmail, signInWithGoogle } from "../store/authSlice";
import { mapFirebaseError } from "../services/errorService";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { user, isLoading, isBootstrapping } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  const fallbackRedirect = "/dashboard";
  const redirectFromState =
    typeof location.state === "object" &&
    location.state !== null &&
    "from" in location.state &&
    typeof (location.state as { from?: unknown }).from === "string"
      ? (location.state as { from: string }).from
      : null;

  useEffect(() => {
    if (redirectFromState) {
      sessionStorage.setItem("postAuthRedirect", redirectFromState);
    }
  }, [redirectFromState]);

  useEffect(() => {
    if (!isBootstrapping && user) {
      const target = sessionStorage.getItem("postAuthRedirect") || fallbackRedirect;
      sessionStorage.removeItem("postAuthRedirect");
      navigate(target, { replace: true });
    }
  }, [isBootstrapping, navigate, user]);

  const authIconSrc = "/assets/icons/ICON_WHITE.svg";

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    try {
      await dispatch(signInWithEmail({ email, password })).unwrap();
    } catch (err) {
      setError(mapFirebaseError(err));
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const target = redirectFromState || fallbackRedirect;
    sessionStorage.setItem("postAuthRedirect", target);
    try {
      await dispatch(signInWithGoogle()).unwrap();
    } catch (err) {
      setError(mapFirebaseError(err));
    }
  };

  return (
    <div className="relative w-full px-4 py-6 md:py-8 [@media(max-width:450px)]:px-0">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-12 top-10 h-56 w-56 rounded-full bg-red-500/15 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-rose-400/10 blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full origin-center [@media(max-height:860px)]:scale-95 [@media(max-height:760px)]:scale-90 [@media(max-height:680px)]:scale-85"
        >
          <Link
            to="/"
            className="mb-3 inline-flex min-h-11 items-center gap-2 border border-[var(--brand-light-purple)]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand-light-purple)]/75 transition-colors hover:text-[var(--brand-light-purple)] [@media(max-width:450px)]:mb-3 [@media(max-width:450px)]:w-full [@media(max-width:450px)]:justify-start [@media(max-width:450px)]:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] p-4 text-[var(--brand-light-purple)] shadow-xl md:p-6 [@media(max-width:450px)]:rounded-none [@media(max-width:450px)]:border-x-0 [@media(max-width:450px)]:p-0 [@media(max-width:450px)]:shadow-none">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/60 p-6">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-[var(--brand-vivid-red)]">
                  Access Unboxd
                </p>
                <img src={authIconSrc} alt="Unboxd" className="mb-4 h-8 w-auto" />
                <h1 className="mb-3 text-4xl font-black uppercase leading-[0.95]">Welcome Back</h1>
                <p className="text-[var(--brand-light-purple)]/70">
                  Sign in to continue your next mystery drop.
                </p>
              </div>

              <div>
                {error && (
                  <div className="mb-4 border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="mb-4 flex w-full items-center justify-center gap-3 border border-[var(--brand-light-purple)]/25 px-4 py-3 text-sm font-semibold uppercase tracking-[0.08em] transition-colors hover:border-[var(--brand-light-purple)]/40 disabled:opacity-50"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-[var(--brand-light-purple)]/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-[var(--brand-dark-azure)] px-4 text-[var(--brand-light-purple)]/60">
                      or continue with email
                    </span>
                  </div>
                </div>

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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full border border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)] py-3 pl-10 pr-4 text-[var(--brand-light-purple)] placeholder:text-[var(--brand-light-purple)]/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--brand-light-purple)]/60" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        required
                        className="w-full border border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)] py-3 pl-10 pr-12 text-[var(--brand-light-purple)] placeholder:text-[var(--brand-light-purple)]/40 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--brand-light-purple)]/60 hover:text-[var(--brand-light-purple)]"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end text-sm">
                    <Link to="/forgot-password" className="text-[var(--brand-vivid-red)] hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#c30f37] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="h-4 w-4" tone="black" />
                        <span className="loading-shimmer-text-light">Signing In</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-[var(--brand-light-purple)]/65">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-[var(--brand-vivid-red)] hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
