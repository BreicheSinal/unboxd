import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User as UserIcon, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { GoogleIcon } from "../components/GoogleIcon";
import { Spinner } from "../components/ui/spinner";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signInWithGoogle, signUpWithEmail } from "../store/authSlice";
import { mapFirebaseError } from "../services/errorService";

export function SignUpPage() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate, user]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const authIconSrc =
    mounted && resolvedTheme === "dark"
      ? "/assets/icons/ICON_WHITE.svg"
      : "/assets/icons/ICON_BLACK.svg";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await dispatch(signUpWithEmail({ email, password, name })).unwrap();
    } catch (err) {
      setError(mapFirebaseError(err));
    }
  };

  const handleGoogleSignIn = async () => {
    setError("");
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
          className="relative w-full origin-center [@media(max-height:900px)]:scale-95 [@media(max-height:800px)]:scale-90 [@media(max-height:700px)]:scale-85"
        >
          <Link
            to="/"
            className="mb-2 inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground [@media(max-width:450px)]:mb-3 [@media(max-width:450px)]:w-full [@media(max-width:450px)]:justify-start [@media(max-width:450px)]:rounded-none [@media(max-width:450px)]:border-x-0 [@media(max-width:450px)]:border-t-0 [@media(max-width:450px)]:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="rounded-2xl border border-border bg-card p-4 shadow-xl md:p-6 [@media(max-width:450px)]:rounded-none [@media(max-width:450px)]:border-0 [@media(max-width:450px)]:p-0 [@media(max-width:450px)]:shadow-none">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
              <div className="rounded-xl border border-border bg-accent/20 p-6">
                <img src={authIconSrc} alt="Unboxd" className="mb-4 h-8 w-auto" />
                <h1 className="mb-2 text-3xl font-bold">Create Account</h1>
                <p className="text-muted-foreground">Join Unboxd and start collecting</p>
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
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border-2 border-border bg-white px-4 py-3 font-medium transition-colors hover:bg-accent disabled:opacity-50 dark:bg-gray-900"
                >
                  <GoogleIcon className="h-5 w-5" />
                  Continue with Google
                </button>

                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-card px-4 text-muted-foreground">or sign up with email</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium">
                        Full Name
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          required
                          className="w-full rounded-lg border border-border bg-accent py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>

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
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
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
                          placeholder="********"
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

                    <div>
                      <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="confirmPassword"
                          type={showPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="********"
                          required
                          className="w-full rounded-lg border border-border bg-accent py-3 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    By signing up, you agree to our{" "}
                    <Link to="/terms" className="text-red-500 hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-red-500 hover:underline">
                      Privacy Policy
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
                        <span className="loading-shimmer-text-light">Creating account</span>
                      </>
                    ) : (
                      "Sign Up"
                    )}
                  </button>
                </form>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/signin" className="font-medium text-red-500 hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
