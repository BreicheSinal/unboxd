import { useMemo, useState } from "react";
import { Calendar, DollarSign, ArrowUpDown, Package, TrendingUp, Download } from "lucide-react";
import { useAsyncEffect } from "../hooks/useAsyncEffect";
import { LoadingScreen } from "../components/ui/loading-screen";
import { useAppSelector } from "../store/hooks";
import { getTransactionsForUser } from "../services/transactionService";
import type { TransactionRecord } from "../types/domain";

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

function mapTransactionRecord(record: TransactionRecord): Transaction {
  const typeMap: Record<TransactionRecord["type"], TransactionType> = {
    order: "purchase",
    purchase: "purchase",
    trade: "trade",
    sale: "sale",
  };

  return {
    id: record.id,
    type: typeMap[record.type] ?? "purchase",
    date: record.createdAt ? record.createdAt.toISOString().slice(0, 10) : "Unknown",
    description: `${record.type} transaction`,
    amount: record.amount,
    status: (record.status as Transaction["status"]) ?? "pending",
  };
}

export function TransactionHistoryPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useAsyncEffect(async ({ isActive }) => {
    if (!user) {
      setTransactions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    try {
      const records = await getTransactionsForUser(user.uid);
      if (!isActive()) return;
      const mapped = records.map(mapTransactionRecord);
      setTransactions(mapped);
      setIsLoading(false);
    } catch {
      if (!isActive()) return;
      setLoadError("Failed to load transactions from Firestore.");
      setTransactions([]);
      setIsLoading(false);
    }
  }, [user]);

  const filteredTransactions = useMemo(
    () => transactions.filter((txn) => filterType === "all" || txn.type === filterType),
    [transactions, filterType],
  );

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

  const formatStatus = (status: Transaction["status"]) => status.charAt(0).toUpperCase() + status.slice(1);

  const totalSpent = transactions
    .filter((t) => t.type === "purchase" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalEarned = transactions
    .filter((t) => t.type === "sale" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalTrades = transactions.filter((t) => t.type === "trade").length;

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Transaction History</h1>
          <p className="text-muted-foreground">View all your purchases, trades, and sales</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <div className="bg-card border border-border rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-red-500/10">
                <DollarSign className="h-5 w-5 text-red-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Spent</span>
            </div>
            <div className="text-3xl font-bold">${totalSpent.toFixed(2)}</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/10">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <span className="text-sm text-muted-foreground">Total Earned</span>
            </div>
            <div className="text-3xl font-bold">${totalEarned.toFixed(2)}</div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5 md:p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-zinc-500/10">
                <ArrowUpDown className="h-5 w-5 text-zinc-400" />
              </div>
              <span className="text-sm text-muted-foreground">Total Trades</span>
            </div>
            <div className="text-3xl font-bold">{totalTrades}</div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterType("all")}
                className={`px-4 min-h-11 py-2 rounded-lg transition-colors ${
                  filterType === "all" ? "bg-red-600 text-white" : "bg-accent hover:bg-accent/80"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType("purchase")}
                className={`px-4 min-h-11 py-2 rounded-lg transition-colors ${
                  filterType === "purchase" ? "bg-red-600 text-white" : "bg-accent hover:bg-accent/80"
                }`}
              >
                Purchases
              </button>
              <button
                onClick={() => setFilterType("trade")}
                className={`px-4 min-h-11 py-2 rounded-lg transition-colors ${
                  filterType === "trade" ? "bg-red-600 text-white" : "bg-accent hover:bg-accent/80"
                }`}
              >
                Trades
              </button>
              <button
                onClick={() => setFilterType("sale")}
                className={`px-4 min-h-11 py-2 rounded-lg transition-colors ${
                  filterType === "sale" ? "bg-red-600 text-white" : "bg-accent hover:bg-accent/80"
                }`}
              >
                Sales
              </button>
            </div>

            <button className="px-4 min-h-11 py-2 bg-accent hover:bg-accent/80 rounded-lg transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export CSV
            </button>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {loadError}
          </div>
        )}

        {isLoading && (
          <LoadingScreen message="Loading transactions" />
        )}

        {!isLoading && <div className="space-y-4">
          {filteredTransactions.map((transaction) => {
            const TypeIcon = getTypeIcon(transaction.type);

            return (
              <div key={transaction.id} className="bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  {transaction.shirt && (
                    <img
                      src={transaction.shirt.image}
                      alt={transaction.shirt.team}
                      className="w-full md:w-20 h-48 md:h-20 object-cover rounded-lg"
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`p-1.5 rounded ${getTypeColor(transaction.type)}`}>
                        <TypeIcon className="h-4 w-4" />
                      </div>
                      <h3 className="font-bold">{transaction.description}</h3>
                    </div>

                    {transaction.shirt && (
                      <div className="ml-0 md:ml-8 mb-2 text-sm text-muted-foreground">{transaction.shirt.team}</div>
                    )}

                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-muted-foreground ml-0 md:ml-8">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {transaction.date}
                      </div>
                      <div className="flex items-center gap-1">ID: {transaction.id}</div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col md:items-end items-center justify-between md:justify-start gap-2 md:min-w-32">
                    <span
                      className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(
                        transaction.status,
                      )}`}
                    >
                      {formatStatus(transaction.status)}
                    </span>
                    <div className="text-right">
                      {transaction.type === "purchase" || transaction.type === "trade" ? (
                        <div className="text-xl md:text-2xl font-bold text-red-500">
                          {transaction.amount > 0 ? `-$${transaction.amount.toFixed(2)}` : "-"}
                        </div>
                      ) : (
                        <div className="text-xl md:text-2xl font-bold text-green-500">+${transaction.amount.toFixed(2)}</div>
                      )}
                      <div className="text-xs text-muted-foreground capitalize">{transaction.type}</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>}

        {!isLoading && filteredTransactions.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <Package className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No transactions yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your purchases, trades, and sales will appear here once activity starts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
