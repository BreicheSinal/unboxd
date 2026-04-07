import { useEffect, useMemo, useState } from "react";
import { Package, TrendingUp, Award, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { useAppSelector } from "../store/hooks";
import { getDashboardSummary } from "../services/dashboardService";
import { getTransactionsForUser } from "../services/transactionService";

interface RecentOrder {
  id: string;
  date: string;
  status: string;
  total: string;
}

export function DashboardPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [summary, setSummary] = useState({
    totalOrders: 0,
    shirtsOwned: 0,
    tradesMade: 0,
    badgesEarned: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSummary({
        totalOrders: 0,
        shirtsOwned: 0,
        tradesMade: 0,
        badgesEarned: 0,
      });
      setRecentOrders([]);
      setIsLoading(false);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    Promise.all([getDashboardSummary(user.uid), getTransactionsForUser(user.uid)])
      .then(([result, transactions]) => {
        if (!isMounted) return;

        const orders = transactions
          .filter((item) => item.type === "order" || item.type === "purchase")
          .slice(0, 3)
          .map((item) => ({
            id: item.id,
            date: item.createdAt ? item.createdAt.toISOString().slice(0, 10) : "Unknown",
            status: item.status,
            total: `$${item.amount.toFixed(2)}`,
          }));

        const badgesEarned =
          Number(result.totalOrders >= 1) +
          Number(result.shirtsOwned >= 10) +
          Number(result.tradesMade >= 5) +
          Number(result.totalOrders >= 15) +
          Number(result.shirtsOwned >= 25);

        setSummary({
          ...result,
          badgesEarned,
        });
        setRecentOrders(orders);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("Failed to load dashboard data from Firestore.");
        setSummary({
          totalOrders: 0,
          shirtsOwned: 0,
          tradesMade: 0,
          badgesEarned: 0,
        });
        setRecentOrders([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [user]);

  const stats = useMemo(
    () => [
      { label: "Total Orders", value: String(summary.totalOrders), icon: ShoppingBag, color: "from-red-500 to-red-700" },
      { label: "Shirts Owned", value: String(summary.shirtsOwned), icon: Package, color: "from-rose-500 to-red-700" },
      { label: "Trades Made", value: String(summary.tradesMade), icon: TrendingUp, color: "from-green-500 to-green-600" },
      { label: "Badges Earned", value: String(summary.badgesEarned), icon: Award, color: "from-yellow-500 to-yellow-600" },
    ],
    [summary],
  );

  const badges = useMemo(
    () => [
      { name: "First Order", icon: "First", earned: summary.totalOrders >= 1 },
      {
        name: "Collector",
        icon: "Collector",
        earned: summary.shirtsOwned >= 10,
        description: "Own 10+ shirts",
      },
      {
        name: "Trader",
        icon: "Trader",
        earned: summary.tradesMade >= 5,
        description: "Complete 5 trades",
      },
      {
        name: "Mystery Master",
        icon: "Master",
        earned: summary.totalOrders >= 15,
        description: "15 orders completed",
      },
      {
        name: "Global Fan",
        icon: "Global",
        earned: summary.shirtsOwned >= 25,
        description: "Collect 25 shirts",
      },
    ],
    [summary.shirtsOwned, summary.totalOrders, summary.tradesMade],
  );

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl font-bold md:text-4xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s your overview.</p>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {loadError}
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">Loading dashboard...</p>
          </div>
        )}

        {!isLoading && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6 mb-8">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-card border border-border rounded-xl p-5 md:p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl md:text-2xl font-bold">Recent Orders</h2>
                    <Link to="/transactions" className="text-sm text-red-500 hover:underline">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                      >
                        <div>
                          <div className="font-bold">{order.id}</div>
                          <div className="text-sm text-muted-foreground">{order.date}</div>
                        </div>
                        <div className="sm:text-right">
                          <div className="font-bold">{order.total}</div>
                          <div className={`text-sm ${order.status === "completed" ? "text-green-500" : "text-red-500"}`}>
                            {order.status}
                          </div>
                        </div>
                      </div>
                    ))}
                    {recentOrders.length === 0 && (
                      <div className="rounded-lg bg-accent/30 p-4 text-sm text-muted-foreground">
                        No recent orders found in Firestore.
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-card border border-border rounded-xl p-5 md:p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold">Your Badges</h2>
                    <Link to="/badges" className="text-sm text-red-500 hover:underline">
                      View All
                    </Link>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    {badges.map((badge) => (
                      <div
                        key={badge.name}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          badge.earned
                            ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                            : "bg-accent/30 opacity-50"
                        }`}
                      >
                        <div className="rounded-md bg-card px-2 py-1 text-xs font-semibold">{badge.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold truncate">{badge.name}</div>
                          {badge.description && (
                            <div className="text-xs text-muted-foreground">{badge.description}</div>
                          )}
                        </div>
                        {badge.earned && <div className="text-yellow-500 font-bold">Done</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="my-8 border-t border-border" />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 mt-8">
              <Link
                to="/order"
                className="bg-gradient-to-br from-rose-500 to-red-700 text-white rounded-xl p-5 md:p-6 hover:shadow-xl transition-shadow group"
              >
                <ShoppingBag className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-1">Order Again</h3>
                <p className="text-sm opacity-90">Get another mystery shirt</p>
              </Link>

              <Link
                to="/closet"
                className="bg-card border border-border rounded-xl p-5 md:p-6 hover:shadow-lg transition-shadow group"
              >
                <Package className="h-8 w-8 mb-3 text-zinc-400 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-1">My Closet</h3>
                <p className="text-sm text-muted-foreground">View your collection</p>
              </Link>

              <Link
                to="/marketplace"
                className="bg-card border border-border rounded-xl p-5 md:p-6 hover:shadow-lg transition-shadow group"
              >
                <TrendingUp className="h-8 w-8 mb-3 text-green-500 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-1">Marketplace</h3>
                <p className="text-sm text-muted-foreground">Trade your shirts</p>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
