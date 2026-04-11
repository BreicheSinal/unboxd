import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { GoogleIcon } from "../components/GoogleIcon";
import { Spinner } from "../components/ui/spinner";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInWithEmail, signInWithGoogle } from "../store/authSlice";
import { mapFirebaseError } from "../services/errorService";

export function SignInPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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

  useEffect(() => {
    setMounted(true);
  }, []);

  const authIconSrc =
    mounted && resolvedTheme === "dark"
      ? "/assets/icons/ICON_WHITE.svg"
      : "/assets/icons/ICON_BLACK.svg";

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
    <div className="relative w-full px-4 [@media(max-width:450px)]:px-0">
      <div className="mx-auto w-full max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-full origin-center [@media(max-height:860px)]:scale-95 [@media(max-height:760px)]:scale-90 [@media(max-height:680px)]:scale-85"
        >
          <Link
            to="/"
            className="mb-2 inline-flex min-h-11 items-center gap-2 px-1 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground [@media(max-width:450px)]:mb-3 [@media(max-width:450px)]:w-full [@media(max-width:450px)]:justify-start [@media(max-width:450px)]:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl md:p-6 [@media(max-width:450px)]:rounded-none [@media(max-width:450px)]:border-0 [@media(max-width:450px)]:p-0 [@media(max-width:450px)]:shadow-none">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="rounded-xl border border-border bg-accent/20 p-6">
                <img src={authIconSrc} alt="Unboxd" className="mb-4 h-8 w-auto" />
                <h1 className="mb-2 text-3xl font-bold">Welcome Back</h1>
                <p className="text-muted-foreground">Sign in to your Unboxd account</p>
              </div>

              <div>
                {error && (
                  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-500">
                    {error}
                  </div>
                )}

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-border px-4 py-3 font-medium transition-colors hover:bg-accent/30 disabled:opacity-50"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-4 text-muted-foreground">or continue with email</span>
                  </div>
                </div>

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
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                        className="w-full rounded-lg border border-border bg-accent py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full rounded-lg border border-border bg-accent py-3 pl-10 pr-12 focus:outline-none focus:ring-2 focus:ring-red-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-end text-sm">
                    <Link to="/forgot-password" className="text-red-500 hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-rose-500 to-red-700 py-3 font-medium text-white transition-all hover:shadow-lg disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Spinner className="h-4 w-4" tone="black" />
                        <span className="loading-shimmer-text-light">Signing in</span>
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-red-500 hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
