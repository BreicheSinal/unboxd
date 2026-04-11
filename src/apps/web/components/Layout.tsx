import { Outlet, Link, useLocation } from "react-router";
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingBag,
  Grid3x3,
  Store,
  History,
  LogOut,
  ChevronDown,
  Award,
  Moon,
  Sun,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { GoogleIcon } from "./GoogleIcon";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOutUser } from "../store/authSlice";
import { useScrollToTopOnChange } from "../hooks/useScrollToTopOnChange";

export function Layout() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasAvatarLoadError, setHasAvatarLoadError] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthPage =
    location.pathname === "/signin" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHasAvatarLoadError(false);
  }, [user?.photoURL, user?.uid]);

  useScrollToTopOnChange(
    [location.pathname, location.search, location.hash, location.key],
    {
      mainRef,
      extraFrames: 0,
      behavior: "smooth",
      durationMs: 0,
    },
  );

  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!userMenuRef.current) return;
      const target = event.target as Node;
      if (!userMenuRef.current.contains(target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [userMenuOpen]);

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, protected: true },
    { name: "Order", href: "/order", icon: ShoppingBag, protected: true },
    { name: "Marketplace", href: "/marketplace", icon: Store, protected: true },
    { name: "Closet", href: "/closet", icon: Grid3x3, protected: true },
  ];

  const handleSignOut = () => {
    void dispatch(signOutUser());
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const isRouteActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return (
      location.pathname === href || location.pathname.startsWith(`${href}/`)
    );
  };
  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/assets/logos/WHITE_LOGO.svg"
      : "/assets/logos/BLACK_LOGO.svg";
  const isDarkTheme = mounted ? resolvedTheme === "dark" : true;
  const nextThemeLabel = isDarkTheme ? "light" : "dark";
  const userInitial = (user?.displayName?.[0] ?? "U").toUpperCase();
  const faqItems = [
    {
      question: "How does Unboxd work?",
      answer:
        "Pick your shirt size, place your order, and we ship a mystery sports shirt to your door.",
    },
    {
      question: "Can I return an item?",
      answer:
        "Yes. If your order is eligible, you can start the process from the Returns page.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Delivery times vary by location, but most orders arrive within a few business days.",
    },
    {
      question: "Do I need an account to order?",
      answer:
        "You can browse without an account, but signing in lets you track orders and manage your closet.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      {!isAuthPage && (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="w-full px-4 md:px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex shrink-0 items-center gap-2 md:mr-5 lg:mr-8">
                <img
                  src={logoSrc}
                  alt="Unboxd"
                  className="h-[1.625rem] w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:mx-4 md:flex md:flex-1 md:items-center md:justify-center md:gap-3 lg:mx-8 lg:gap-6">
                {navigation.map((item) => {
                  // Only show protected routes if user is logged in
                  if (item.protected && !user) return null;

                  const Icon = item.icon;
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors lg:px-3 lg:text-base ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right side actions */}
              <div className="flex shrink-0 items-center gap-2 md:ml-5 lg:ml-8">
                {user ? (
                  <>
                    {/* User Menu */}
                    <div ref={userMenuRef} className="relative hidden md:block">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex min-h-11 items-center gap-2 rounded-lg p-2 hover:bg-accent transition-colors"
                      >
                        {user.photoURL && !hasAvatarLoadError ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-8 w-8 rounded-full object-cover"
                            onError={() => setHasAvatarLoadError(true)}
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white font-bold">
                            {userInitial}
                          </div>
                        )}
                        <ChevronDown className="h-4 w-4" />
                      </button>

                      {userMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-xl py-2">
                          <div className="px-4 py-3 border-b border-border">
                            <div className="font-bold">{user.displayName}</div>
                            <div className="mt-1 flex min-w-0 items-center gap-2">
                              <div className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                                {user.email}
                              </div>
                              {user.provider === "google" && (
                                <GoogleIcon className="h-4 w-4 shrink-0" />
                              )}
                            </div>
                          </div>
                          <Link
                            to="/badges"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors"
                          >
                            <Award className="h-4 w-4" />
                            <span>Badges</span>
                          </Link>
                          <Link
                            to="/transactions"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors"
                          >
                            <History className="h-4 w-4" />
                            <span>History</span>
                          </Link>
                          <div className="my-2 border-t border-border"></div>
                          <button
                            type="button"
                            onClick={() => setTheme(nextThemeLabel)}
                            className="flex w-full items-center gap-3 px-4 py-2 text-left hover:bg-accent transition-colors"
                            aria-label={`Switch to ${nextThemeLabel} mode`}
                            title={`Switch to ${nextThemeLabel} mode`}
                          >
                            {isDarkTheme ? (
                              <Sun className="h-4 w-4" />
                            ) : (
                              <Moon className="h-4 w-4" />
                            )}
                            <span>{`Switch to ${nextThemeLabel} mode`}</span>
                          </button>
                          <div className="my-2 border-t border-border"></div>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-red-500"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="hidden md:flex items-center gap-1 rounded-full border border-border/80 bg-card/70 p-1 backdrop-blur">
                    <Link
                      to="/signin"
                      className="rounded-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="rounded-full bg-gradient-to-r from-rose-500 to-red-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden flex min-h-11 min-w-11 items-center justify-center rounded-lg p-2 hover:bg-accent transition-colors"
                >
                  {mobileMenuOpen ? (
                    <X className="h-5 w-5" />
                  ) : (
                    <Menu className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-border">
              <nav className="w-full px-4 md:px-6 py-4 flex flex-col gap-2">
                {navigation.map((item) => {
                  // Only show protected routes if user is logged in
                  if (item.protected && !user) return null;

                  const Icon = item.icon;
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? "bg-accent text-accent-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    <div className="border-t border-border my-2"></div>
                    <div className="px-4 py-2">
                      <div className="font-bold">{user.displayName}</div>
                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <div className="min-w-0 flex-1 truncate text-sm text-muted-foreground">
                          {user.email}
                        </div>
                        {user.provider === "google" && (
                          <GoogleIcon className="h-4 w-4 shrink-0" />
                        )}
                      </div>
                    </div>
                    <Link
                      to="/badges"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <Award className="h-5 w-5" />
                      <span>Badges</span>
                    </Link>
                    <Link
                      to="/transactions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <History className="h-5 w-5" />
                      <span>History</span>
                    </Link>
                    <div className="border-t border-border my-2"></div>
                    <button
                      type="button"
                      onClick={() => setTheme(nextThemeLabel)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                      aria-label={`Switch to ${nextThemeLabel} mode`}
                      title={`Switch to ${nextThemeLabel} mode`}
                    >
                      {isDarkTheme ? (
                        <Sun className="h-5 w-5" />
                      ) : (
                        <Moon className="h-5 w-5" />
                      )}
                      <span>{`Switch to ${nextThemeLabel} mode`}</span>
                    </button>
                    <div className="border-t border-border my-2"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-red-500"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="rounded-2xl border border-border bg-card/70 p-2">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/signin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 rounded-xl border border-border px-4 py-3 text-center hover:bg-accent transition-colors"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-700 px-4 py-3 text-center font-semibold text-white shadow-sm transition-all hover:shadow-md"
                        >
                          Sign Up
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </nav>
            </div>
          )}
        </header>
      )}

      {/* Main Content */}
      <main
        id="app-main"
        ref={mainRef}
        className={`flex-1 overflow-x-hidden overflow-y-auto ${
          isAuthPage
            ? "flex justify-center items-start pt-4 md:pt-6 xl:items-center xl:pt-0"
            : ""
        }`}
      >
        <Outlet />
      </main>

      {!isAuthPage && !user && (
        <section className="mt-16 bg-[var(--brand-light-purple)] py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto w-full max-w-4xl">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold md:text-5xl text-[var(--brand-dark-azure)]">
                  Frequently Asked Questions
                </h2>
                <p className="mt-3 text-[var(--brand-dark-azure)] opacity-70">
                  Quick answers before you place your next mystery order.
                </p>
              </div>
              <div className="space-y-3">
                {faqItems.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-lg border border-[var(--brand-dark-azure)] bg-[var(--brand-dark-azure)] px-4 py-3 transition-opacity hover:opacity-95"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-[var(--brand-light-purple)] marker:content-['']">
                      <span>{item.question}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-[var(--brand-light-purple)] opacity-80 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm text-[var(--brand-light-purple)] opacity-80">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {!isAuthPage && (
        <footer className="border-t border-border">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <img src={logoSrc} alt="Unboxd" className="h-6 w-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Discover the thrill of mystery sports shirts. Every order is a
                  surprise!
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-4">Shop</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/order" className="hover:text-foreground">
                      Order Now
                    </Link>
                  </li>
                  {user && (
                    <li>
                      <Link to="/marketplace" className="hover:text-foreground">
                        Marketplace
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Account</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {user ? (
                    <>
                      <li>
                        <Link to="/dashboard" className="hover:text-foreground">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/closet" className="hover:text-foreground">
                          My Closet
                        </Link>
                      </li>
                      <li>
                        <Link to="/badges" className="hover:text-foreground">
                          Badges
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/transactions"
                          className="hover:text-foreground"
                        >
                          History
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/signin" className="hover:text-foreground">
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className="hover:text-foreground">
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link to="/help-center" className="hover:text-foreground">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact-us" className="hover:text-foreground">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/returns" className="hover:text-foreground">
                      Returns
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
              &copy; 2026 Unboxd. All rights reserved.
              <span className="mx-2" aria-hidden="true">
                &bull;
              </span>
              Developed by{" "}
              <a
                href="https://invixlab.com"
                target="_blank"
                rel="noreferrer"
                className="text-red-500 hover:text-red-400"
              >
                InvixLab
              </a>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

