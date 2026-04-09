import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";
import {
  Shield,
  ShoppingCart,
  ArrowLeftRight,
  Users,
  Receipt,
  LogOut,
  Package,
  ChevronRight,
  Home,
  Mail,
} from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import { adminSignOut } from "../store/slices/adminAuthSlice";
import { Button } from "../../web/components/ui/button";
import { Avatar, AvatarFallback } from "../../web/components/ui/avatar";

const navItems = [
  { to: "/", label: "Overview", subtitle: "Platform health", icon: Shield },
  { to: "/orders", label: "Orders", subtitle: "Operational workflow", icon: ShoppingCart },
  { to: "/transactions", label: "Transactions", subtitle: "Derived financial ledger", icon: Receipt },
  { to: "/listings", label: "Listings", subtitle: "Moderation queue", icon: Package },
  { to: "/trades", label: "Trades", subtitle: "Offer transitions", icon: ArrowLeftRight },
  { to: "/users", label: "Users", subtitle: "Access management", icon: Users },
];

export function AdminLayout() {
  const location = useLocation();
  const dispatch = useAdminDispatch();
  const user = useAdminSelector((state) => state.adminAuth.user);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const email = user?.email ?? "admin@unboxd.com";
  const displayName = user?.displayName?.trim() || "Admin";
  const avatarFallback = (user?.displayName ?? email ?? "A")
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const activeItem = navItems.find((item) =>
    item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to),
  );

  useEffect(() => {
    if (!isAccountMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isAccountMenuOpen]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[1600px] items-center justify-between px-4 sm:h-20 lg:px-6">
          <div className="flex items-center gap-3">
            <img src="/assets/icons/ICON_WHITE.svg" alt="Unboxd Admin" className="h-7 w-7" />
            <div>
              <p className="text-sm text-muted-foreground">Unboxd</p>
              <h1 className="text-sm font-semibold sm:text-base">Admin Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div ref={accountMenuRef} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-expanded={isAccountMenuOpen}
                aria-haspopup="menu"
                className="h-10 w-10 rounded-full border-0 bg-transparent p-0 hover:bg-accent/30"
                onClick={() => setIsAccountMenuOpen((previous) => !previous)}
              >
                <Avatar className="h-10 w-10 border-0">
                  <AvatarFallback className="text-xs font-semibold">{avatarFallback}</AvatarFallback>
                </Avatar>
              </Button>
              {isAccountMenuOpen ? (
                <div className="absolute right-0 top-12 z-50 w-[min(84vw,320px)] rounded-2xl border border-border/80 bg-background p-2 shadow-md">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-card/70 p-3">
                      <Avatar className="h-10 w-10 border-0">
                        <AvatarFallback className="text-xs font-semibold">{avatarFallback}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{displayName}</p>
                        <p className="text-xs text-muted-foreground">Administrator account</p>
                      </div>
                    </div>
                    <div className="flex min-w-0 h-12 items-center gap-2 rounded-xl border border-border/80 bg-card/70 px-3">
                      <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                      <p className="min-w-0 truncate text-sm font-medium">{email}</p>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-12 w-full rounded-xl px-4 text-sm"
                      onClick={() => {
                        setIsAccountMenuOpen(false);
                        void dispatch(adminSignOut());
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] items-start gap-4 px-4 py-4 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-6 lg:px-6 lg:py-6">
        <aside className="h-fit w-full self-start rounded-xl border border-border bg-card p-3 lg:w-64 lg:min-w-64 lg:max-w-64">
          <div className="mb-3 hidden items-center gap-2 px-2 lg:flex">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Navigation</p>
          </div>
          <div className="mb-3 hidden px-2 lg:block">
            <div className="h-px w-full bg-border" />
          </div>
          <nav className="flex gap-2 overflow-x-auto pb-1 max-[750px]:snap-x max-[750px]:snap-mandatory max-[750px]:scroll-px-1 max-[750px]:[-ms-overflow-style:none] max-[750px]:[scrollbar-width:none] max-[750px]:[&::-webkit-scrollbar]:hidden lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex min-w-fit items-center gap-2 whitespace-nowrap rounded-lg px-3 py-2 text-sm max-[750px]:min-w-[120px] max-[750px]:shrink-0 max-[750px]:snap-start ${
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <div className="flex flex-col">
                    <span>{item.label}</span>
                    <span className="hidden text-xs opacity-70 lg:block">{item.subtitle}</span>
                  </div>
                  {isActive ? <ChevronRight className="h-3.5 w-3.5 lg:ml-auto" /> : null}
                </Link>
              );
            })}
          </nav>
          <div className="pt-3">
            <div className="mb-3 h-px w-full bg-border" />
            <a
              href="https://invixlab.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              Developed by <span className="ml-1 text-red-500">InvixLab</span>
            </a>
          </div>
        </aside>
        <main className="min-w-0 space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <Home className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Admin</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{activeItem?.label ?? "Overview"}</span>
            <span className="hidden text-muted-foreground md:inline">- {activeItem?.subtitle ?? "Workspace"}</span>
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
