import { useState } from "react";
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

  if (user?.isAdmin) {
    return <Navigate to={redirectTarget} replace />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-0">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-accent/40">
              <img
                src="/assets/icons/ICON_WHITE.svg"
                alt="Unboxd Admin"
                className="h-5 w-5"
              />
            </div>
            <CardTitle className="text-2xl">Unboxd Admin</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? <AdminErrorAlert message={error} /> : null}

          <Button
            type="button"
            variant="outline"
            className="mt-0 h-11 w-full gap-1"
            disabled={isLoading}
            onClick={() => void dispatch(adminSignInWithGoogle())}
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </Button>

          <div className="mt-4 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
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
              className="h-11"
            />
            <Input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              className="h-11"
            />
            <Button
              disabled={isLoading}
              type="submit"
              className="h-11 w-full bg-gradient-to-r from-rose-500 to-red-700 text-white hover:from-rose-600 hover:to-red-800"
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
        className="mt-4 inline-flex text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
      >
        Developed by <span className="ml-1 text-red-500">InvixLab</span>
      </a>
    </div>
  );
}
