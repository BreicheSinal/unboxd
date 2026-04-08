import { Outlet, Link, useLocation } from "react-router";
import {
  Menu,
  X,
  Home,
  ShoppingBag,
  User,
  Grid3x3,
  Store,
  History,
  LogOut,
  ChevronDown,
  Award,
} from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import { GoogleIcon } from "./GoogleIcon";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { signOutUser } from "../store/authSlice";
import { useScrollToTopOnChange } from "../hooks/useScrollToTopOnChange";

export function Layout() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const isAuthPage =
    location.pathname === "/signin" || location.pathname === "/signup";

  useEffect(() => {
    setMounted(true);
  }, []);

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
    { name: "Home", href: "/", icon: Home, protected: false },
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

  return (
    <div
      className={`${isAuthPage ? "min-h-screen" : "min-h-screen"} bg-background flex flex-col`}
    >
      {/* Header */}
      {!isAuthPage && (
        <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
          <div className="container mx-auto px-4">
            <div className="flex h-16 items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2">
                <img
                  src={logoSrc}
                  alt="Unboxd"
                  className="h-[1.625rem] w-auto"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navigation.map((item) => {
                  // Only show protected routes if user is logged in
                  if (item.protected && !user) return null;
                  // Hide Home tab when logged out (route remains public)
                  if (item.name === "Home" && !user) return null;

                  const Icon = item.icon;
                  const isActive = isRouteActive(item.href);
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
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
              <div className="flex items-center gap-2">
                {user ? (
                  <>
                    {/* User Menu */}
                    <div ref={userMenuRef} className="relative hidden md:block">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex min-h-11 items-center gap-2 rounded-lg p-2 hover:bg-accent transition-colors"
                      >
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-rose-500 to-red-700 flex items-center justify-center text-white font-bold">
                            {(user.displayName?.[0] ?? "U").toUpperCase()}
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
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors"
                          >
                            <User className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
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
                  <div className="hidden md:flex items-center gap-2">
                    <Link
                      to="/signin"
                      className="px-4 py-2 rounded-lg hover:bg-accent transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all"
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
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {navigation.map((item) => {
                  // Only show protected routes if user is logged in
                  if (item.protected && !user) return null;
                  // Hide Home tab when logged out (route remains public)
                  if (item.name === "Home" && !user) return null;

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
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Dashboard</span>
                    </Link>
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
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-accent transition-colors text-red-500"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-border my-2"></div>
                    <Link
                      to="/signin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-lg hover:bg-accent transition-colors text-center"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all text-center"
                    >
                      Sign Up
                    </Link>
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
        className={`flex-1 overflow-x-hidden overflow-y-auto ${isAuthPage ? "bg-zinc-950 grid place-items-center" : ""}`}
      >
        <Outlet />
      </main>

      {/* Footer */}
      {!isAuthPage && (
        <footer className="border-t border-border mt-20">
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
              © 2026 Unboxd. All rights reserved.
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}
