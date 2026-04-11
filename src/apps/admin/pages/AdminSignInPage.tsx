import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import {
  adminSignInWithEmail,
  adminSignInWithGoogle,
} from "../store/slices/adminAuthSlice";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import { Spinner } from "../../web/components/ui/spinner";
import { GoogleIcon } from "../../web/components/GoogleIcon";
import { Button } from "../../web/components/ui/button";
import { Input } from "../../web/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../web/components/ui/card";
import { AdminErrorAlert } from "../components/AdminUi";

export function AdminSignInPage() {
  const dispatch = useAdminDispatch();
  const { user, isLoading, error } = useAdminSelector(
    (state) => state.adminAuth,
  );
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const redirectTarget =
    typeof location.state === "object" &&
    location.state &&
    "from" in location.state
      ? String((location.state as { from?: string }).from ?? "/")
      : "/";

  useEffect(() => {
    const previousRootBackground = document.documentElement.style.backgroundColor;
    const previousBodyBackground = document.body.style.backgroundColor;

    document.documentElement.style.backgroundColor = "#001114";
    document.body.style.backgroundColor = "#001114";

    return () => {
      document.documentElement.style.backgroundColor = previousRootBackground;
      document.body.style.backgroundColor = previousBodyBackground;
    };
  }, []);

  if (user?.isAdmin) {
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <div className="admin-surface flex min-h-screen flex-col items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)] shadow-lg">
        <CardHeader className="space-y-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/70">
              <img
                src="/assets/icons/ICON_WHITE.svg"
                alt="Unboxd Admin"
                className="h-5 w-5"
              />
            </div>
            <CardTitle className="text-2xl uppercase tracking-[0.06em]">Unboxd Admin</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? <AdminErrorAlert message={error} /> : null}

          <Button
            type="button"
            variant="outline"
            className="mt-0 h-11 w-full gap-1 border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)] hover:border-[var(--brand-light-purple)]/40 hover:bg-[var(--brand-dark-azure)]"
            disabled={isLoading}
            onClick={() => void dispatch(adminSignInWithGoogle())}
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </Button>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-[var(--brand-light-purple)]/65">
              Or
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <form
            className="mt-4 space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void dispatch(adminSignInWithEmail({ email, password }));
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Admin email"
              autoComplete="email"
              className="h-11 border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)] placeholder:text-[var(--brand-light-purple)]/45"
            />
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="h-11 border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)] placeholder:text-[var(--brand-light-purple)]/45"
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="h-11 w-full border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] text-white hover:bg-[#c30f37]"
            >
              {isLoading ? <Spinner className="h-4 w-4" tone="black" /> : null}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
      <a
        href="https://invixlab.com"
        target="_blank"
        rel="noreferrer"
        className="mt-4 inline-flex text-xs font-semibold text-[var(--brand-light-purple)]/65 transition-colors hover:text-[var(--brand-light-purple)]"
      >
        Developed by <span className="ml-1 text-[var(--brand-vivid-red)]">InvixLab</span>
      </a>
    </div>
  );
}

