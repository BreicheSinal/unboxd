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
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { GoogleIcon } from "./GoogleIcon";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOutUser } from "../store/authSlice";
import { useScrollToTopOnChange } from "../hooks/useScrollToTopOnChange";

export function Layout() {
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
  const signedInRoutePrefixes = [
    "/dashboard",
    "/order",
    "/marketplace",
    "/closet",
    "/trade",
    "/transactions",
    "/badges",
  ];
  const isSignedInRoute = signedInRoutePrefixes.some(
    (prefix) =>
      location.pathname === prefix || location.pathname.startsWith(`${prefix}/`),
  );
  const isSignedInSurface = Boolean(user) && isSignedInRoute;

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
  const logoSrc = "/assets/logos/WHITE_LOGO.svg";
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
    <div className="web-app-shell min-h-screen flex flex-col bg-background">
      {/* Header */}
      {!isAuthPage && (
        <header className="sticky top-0 z-50 border-b border-[var(--brand-light-purple)]/15 bg-[var(--brand-dark-azure)]/95 text-[var(--brand-light-purple)] backdrop-blur-lg">
          <div className="w-full px-5 md:px-6">
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
              <nav className="hidden md:mx-4 md:flex md:flex-1 md:items-center md:justify-center md:gap-2 lg:mx-8 lg:gap-3">
                {navigation.map((item) => {
                  // Only show protected routes if user is logged in
                  if (item.protected && !user) return null;

                  const Icon = item.icon;
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 border px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] transition-colors lg:px-4 ${
                        isActive
                          ? "border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] text-white"
                          : "border-[var(--brand-light-purple)]/20 text-[var(--brand-light-purple)]/75 hover:border-[var(--brand-light-purple)]/35 hover:text-[var(--brand-light-purple)]"
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
                        className="flex min-h-11 items-center gap-2 border border-[var(--brand-light-purple)]/20 p-2 transition-colors hover:border-[var(--brand-light-purple)]/35"
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
                        <div className="absolute right-0 z-[120] mt-2 w-56 border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] py-2 shadow-xl">
                          <div className="border-b border-[var(--brand-light-purple)]/20 px-4 py-3">
                            <div className="font-bold">{user.displayName}</div>
                            <div className="mt-1 flex min-w-0 items-center gap-2">
                              <div className="min-w-0 flex-1 truncate text-sm text-[var(--brand-light-purple)]/70">
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
                            className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-[var(--brand-light-purple)]/10"
                          >
                            <Award className="h-4 w-4" />
                            <span>Badges</span>
                          </Link>
                          <Link
                            to="/transactions"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 transition-colors hover:bg-[var(--brand-light-purple)]/10"
                          >
                            <History className="h-4 w-4" />
                            <span>History</span>
                          </Link>
                          <div className="my-2 border-t border-[var(--brand-light-purple)]/20"></div>
                          <button
                            onClick={handleSignOut}
                            className="w-full flex items-center gap-3 px-4 py-2 text-[var(--brand-vivid-red)] transition-colors hover:bg-[var(--brand-light-purple)]/10"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      to="/signin"
                      className="border border-[var(--brand-light-purple)]/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--brand-light-purple)] transition-colors hover:border-[var(--brand-light-purple)]/40"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] px-5 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#c30f37]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden flex min-h-11 min-w-11 items-center justify-center border border-[var(--brand-light-purple)]/20 p-2 transition-colors hover:border-[var(--brand-light-purple)]/35"
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
            <div className="md:hidden border-t border-[var(--brand-light-purple)]/20">
              <nav className="flex w-full flex-col gap-2 px-5 py-4 md:px-6">
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
                      className={`flex items-center gap-3 border px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                        isActive
                          ? "border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] text-white"
                          : "border-[var(--brand-light-purple)]/20 text-[var(--brand-light-purple)]/75 hover:border-[var(--brand-light-purple)]/35 hover:text-[var(--brand-light-purple)]"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {user ? (
                  <>
                    <div className="my-2 border-t border-[var(--brand-light-purple)]/20"></div>
                    <div className="px-4 py-2">
                      <div className="font-bold">{user.displayName}</div>
                      <div className="mt-1 flex min-w-0 items-center gap-2">
                        <div className="min-w-0 flex-1 truncate text-sm text-[var(--brand-light-purple)]/70">
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
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--brand-light-purple)]/10"
                    >
                      <Award className="h-5 w-5" />
                      <span>Badges</span>
                    </Link>
                    <Link
                      to="/transactions"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-[var(--brand-light-purple)]/10"
                    >
                      <History className="h-5 w-5" />
                      <span>History</span>
                    </Link>
                    <div className="my-2 border-t border-[var(--brand-light-purple)]/20"></div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 text-[var(--brand-vivid-red)] transition-colors hover:bg-[var(--brand-light-purple)]/10"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/70 p-2">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/signin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 border border-[var(--brand-light-purple)]/25 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] transition-colors hover:border-[var(--brand-light-purple)]/40"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex-1 border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#c30f37]"
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
        } ${isSignedInSurface ? "signed-in-surface" : ""}`}
      >
        <Outlet />
      </main>

      {!isAuthPage && !user && (
        <section className="relative bg-[var(--brand-dark-azure)] py-20 md:py-24">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--brand-light-purple)]/20" />
          <div className="container mx-auto px-5 md:px-6">
            <div className="mx-auto w-full max-w-6xl">
              <div className="mb-10 w-full max-w-4xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-vivid-red)]">
                  Need Answers First
                </p>
                <h2 className="mt-5 text-4xl font-black uppercase leading-[0.95] text-[var(--brand-light-purple)] md:text-6xl">
                  Frequently Asked Questions
                </h2>
                <p className="mt-4 max-w-2xl text-base text-[var(--brand-light-purple)]/75 md:text-lg">
                  Quick answers before you place your next mystery order.
                </p>
              </div>
              <div className="border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)]">
                {faqItems.map((item, index) => (
                  <details
                    key={item.question}
                    className={`group bg-[var(--brand-dark-azure)] px-5 py-4 md:px-6 md:py-5 ${
                      index === faqItems.length - 1
                        ? ""
                        : "border-b border-[var(--brand-light-purple)]/20"
                    }`}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold uppercase tracking-[0.08em] marker:content-[''] md:text-base">
                      <span>{item.question}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 opacity-80 transition-transform duration-200 group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 max-w-3xl text-sm leading-relaxed opacity-80 md:text-base">
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
        <footer className="border-t border-[var(--brand-light-purple)]/15 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)]">
          <div className="container mx-auto px-5 py-12 md:px-6 md:py-14">
            <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
              <div>
                <img src={logoSrc} alt="Unboxd" className="mb-5 h-6 w-auto" />
                <p className="max-w-xs text-sm leading-relaxed text-[var(--brand-light-purple)]/70">
                  Discover the thrill of mystery sports shirts. Every order is a
                  surprise!
                </p>
              </div>
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-vivid-red)]">
                  Shop
                </h4>
                <ul className="space-y-2 text-sm text-[var(--brand-light-purple)]/75">
                  <li>
                    <Link to="/order" className="transition-colors hover:text-white">
                      Order Now
                    </Link>
                  </li>
                  {user && (
                    <li>
                      <Link to="/marketplace" className="transition-colors hover:text-white">
                        Marketplace
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-vivid-red)]">
                  Account
                </h4>
                <ul className="space-y-2 text-sm text-[var(--brand-light-purple)]/75">
                  {user ? (
                    <>
                      <li>
                        <Link to="/dashboard" className="transition-colors hover:text-white">
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/closet" className="transition-colors hover:text-white">
                          My Closet
                        </Link>
                      </li>
                      <li>
                        <Link to="/badges" className="transition-colors hover:text-white">
                          Badges
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/transactions"
                          className="transition-colors hover:text-white"
                        >
                          History
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link to="/signin" className="transition-colors hover:text-white">
                          Sign In
                        </Link>
                      </li>
                      <li>
                        <Link to="/signup" className="transition-colors hover:text-white">
                          Sign Up
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-vivid-red)]">
                  Support
                </h4>
                <ul className="space-y-2 text-sm text-[var(--brand-light-purple)]/75">
                  <li>
                    <Link to="/help-center" className="transition-colors hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact-us" className="transition-colors hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/returns" className="transition-colors hover:text-white">
                      Returns
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-10 border-t border-[var(--brand-light-purple)]/15 pt-6 text-sm text-[var(--brand-light-purple)]/65">
              <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span>&copy; 2026 Unboxd. All rights reserved.</span>
                <span className="hidden sm:inline" aria-hidden="true">
                  &bull;
                </span>
                <span>
                  Developed by{" "}
                  <a
                    href="https://invixlab.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[var(--brand-vivid-red)] transition-colors hover:text-red-300"
                  >
                    InvixLab
                  </a>
                </span>
              </p>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

