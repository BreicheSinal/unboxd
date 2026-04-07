import { Package, TrendingUp, Award, ShoppingBag } from "lucide-react";
import { Link } from "react-router";

export function DashboardPage() {
  const stats = [
    { label: "Total Orders", value: "12", icon: ShoppingBag, color: "from-red-500 to-red-700" },
    { label: "Shirts Owned", value: "18", icon: Package, color: "from-rose-500 to-red-700" },
    { label: "Trades Made", value: "6", icon: TrendingUp, color: "from-green-500 to-green-600" },
    { label: "Badges Earned", value: "4", icon: Award, color: "from-yellow-500 to-yellow-600" },
  ];

  const recentOrders = [
    { id: "ORD-1234", date: "2026-03-20", status: "Delivered", total: "$34.98" },
    { id: "ORD-1235", date: "2026-03-15", status: "In Transit", total: "$34.98" },
    { id: "ORD-1236", date: "2026-03-10", status: "Delivered", total: "$34.98" },
  ];

  const badges = [
    { name: "First Order", icon: "🎉", earned: true },
    { name: "Collector", icon: "🏆", earned: true, description: "Own 10+ shirts" },
    { name: "Trader", icon: "🔄", earned: true, description: "Complete 5 trades" },
    { name: "Mystery Master", icon: "⭐", earned: true, description: "15 orders completed" },
    { name: "Global Fan", icon: "🌍", earned: false, description: "Collect from 10 countries" },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                <Link
                  to="/transactions"
                  className="text-sm text-red-500 hover:underline"
                >
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                  >
                    <div>
                      <div className="font-bold">{order.id}</div>
                      <div className="text-sm text-muted-foreground">{order.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{order.total}</div>
                      <div
                        className={`text-sm ${
                          order.status === "Delivered"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {order.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Badges */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Your Badges</h2>
                <Link to="/badges" className="text-sm text-red-500 hover:underline">
                  View All
                </Link>
              </div>
              
              <div className="space-y-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      badge.earned
                        ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                        : "bg-accent/30 opacity-50"
                    }`}
                  >
                    <div className="text-3xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="font-bold">{badge.name}</div>
                      {badge.description && (
                        <div className="text-xs text-muted-foreground">
                          {badge.description}
                        </div>
                      )}
                    </div>
                    {badge.earned && (
                      <div className="text-yellow-500 font-bold">✓</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="my-8 border-t border-border"></div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link
            to="/order"
            className="bg-gradient-to-br from-rose-500 to-red-700 text-white rounded-xl p-6 hover:shadow-xl transition-shadow group"
          >
            <ShoppingBag className="h-8 w-8 mb-3 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-1">Order Again</h3>
            <p className="text-sm opacity-90">Get another mystery shirt</p>
          </Link>
          
          <Link
            to="/closet"
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
          >
            <Package className="h-8 w-8 mb-3 text-zinc-400 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-1">My Closet</h3>
            <p className="text-sm text-muted-foreground">View your collection</p>
          </Link>
          
          <Link
            to="/marketplace"
            className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow group"
          >
            <TrendingUp className="h-8 w-8 mb-3 text-green-500 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold mb-1">Marketplace</h3>
            <p className="text-sm text-muted-foreground">Trade your shirts</p>
          </Link>
        </div>
      </div>
    </div>
  );
}


