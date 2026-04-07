import { useState } from "react";
import { Calendar, DollarSign, ArrowUpDown, Package, TrendingUp, Download } from "lucide-react";

type TransactionType = "purchase" | "trade" | "sale";

interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  description: string;
  amount: number;
  status: "completed" | "pending" | "refunded";
  shirt?: {
    team: string;
    image: string;
  };
}

export function TransactionHistoryPage() {
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [sortBy, setSortBy] = useState("recent");

  const transactions: Transaction[] = [
    {
      id: "TXN-1001",
      type: "purchase",
      date: "2026-03-20",
      description: "Mystery Shirt Purchase",
      amount: 34.98,
      status: "completed",
      shirt: {
        team: "Real Madrid",
        image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
    },
    {
      id: "TXN-1002",
      type: "trade",
      date: "2026-03-18",
      description: "Traded Barcelona for Liverpool",
      amount: 0,
      status: "completed",
      shirt: {
        team: "Liverpool",
        image: "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
    },
    {
      id: "TXN-1003",
      type: "sale",
      date: "2026-03-15",
      description: "Sold Manchester United shirt",
      amount: 45.00,
      status: "completed",
      shirt: {
        team: "Manchester United",
        image: "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
    },
    {
      id: "TXN-1004",
      type: "purchase",
      date: "2026-03-12",
      description: "Mystery Shirt Purchase",
      amount: 34.98,
      status: "completed",
      shirt: {
        team: "Bayern Munich",
        image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
    },
    {
      id: "TXN-1005",
      type: "purchase",
      date: "2026-03-10",
      description: "Mystery Shirt Purchase",
      amount: 34.98,
      status: "pending",
    },
    {
      id: "TXN-1006",
      type: "trade",
      date: "2026-03-08",
      description: "Traded PSG + $15 for AC Milan",
      amount: 15.00,
      status: "completed",
      shirt: {
        team: "AC Milan",
        image: "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
    },
  ];

  const filteredTransactions = transactions.filter((txn) => {
    return filterType === "all" || txn.type === filterType;
  });

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case "purchase":
        return Package;
      case "trade":
        return TrendingUp;
      case "sale":
        return DollarSign;
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case "purchase":
        return "border border-red-500/30 text-red-400 bg-red-500/10";
      case "trade":
        return "text-zinc-400 bg-zinc-500/10";
      case "sale":
        return "border border-green-500/30 text-green-400 bg-green-500/10";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border border-green-500/30 text-green-400 bg-green-500/10";
      case "pending":
        return "border border-yellow-500/30 text-yellow-400 bg-yellow-500/10";
      case "refunded":
        return "border border-red-500/30 text-red-400 bg-red-500/10";
      default:
        return "border border-border text-muted-foreground bg-muted";
    }
  };

  const formatStatus = (status: Transaction['status']) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  const totalSpent = transactions
    .filter((t) => t.type === "purchase" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEarned = transactions
    .filter((t) => t.type === "sale" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTrades = transactions.filter((t) => t.type === "trade").length;

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">
            View all your purchases, trades, and sales
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <DollarSign className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Spent</span>
            </div>
            <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Earned</span>
            </div>
            <div className="text-3xl font-bold">${totalEarned.toFixed(2)}</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-zinc-500/10">
                <ArrowUpDown className="h-5 w-5 text-zinc-400" />
              </div>
              <span className="text-sm text-muted-foreground">Total Trades</span>
            </div>
            <div className="text-3xl font-bold">{totalTrades}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            {/* Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === "all"
                    ? "bg-red-600 text-white"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("purchase")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === "purchase"
                    ? "bg-red-600 text-white"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                Purchases
              </button>
              <button
                onClick={() => setFilterType("trade")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === "trade"
                    ? "bg-red-600 text-white"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                Trades
              </button>
              <button
                onClick={() => setFilterType("sale")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filterType === "sale"
                    ? "bg-red-600 text-white"
                    : "bg-accent hover:bg-accent/80"
                }`}
              >
                Sales
              </button>
            </div>

            {/* Export Button */}
            <button className="px-4 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const TypeIcon = getTypeIcon(transaction.type);
            
            return (
              <div
                key={transaction.id}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  {/* Shirt Image (if available) */}
                  {transaction.shirt && (
                    <img
                      src={transaction.shirt.image}
                      alt={transaction.shirt.team}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                  )}

                  {/* Transaction Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded ${getTypeColor(transaction.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold">{transaction.description}</h3>
                    </div>

                    {transaction.shirt && (
                      <div className="ml-8 mb-2 text-sm text-muted-foreground">
                        {transaction.shirt.team}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground ml-8">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {transaction.date}
                      </div>
                      <div className="flex items-center gap-1">
                        ID: {transaction.id}
                      </div>
                    </div>
                  </div>

                  {/* Amount + Status */}
                  <div className="ml-auto flex min-w-32 flex-col items-end gap-2 self-start md:self-center">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(
                        transaction.status
                      )}`}
                    >
                      {formatStatus(transaction.status)}
                    </span>
                    <div className="text-right">
                      {transaction.type === "purchase" || transaction.type === "trade" ? (
                        <div className="text-2xl font-bold text-red-500">
                          {transaction.amount > 0 ? `-$${transaction.amount.toFixed(2)}` : "-"}
                        </div>
                      ) : (
                        <div className="text-2xl font-bold text-green-500">
                          +${transaction.amount.toFixed(2)}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground capitalize">
                        {transaction.type}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No transactions found
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


