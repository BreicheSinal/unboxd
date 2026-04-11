import { useEffect } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight, Banknote, ClipboardList, LineChart, ShieldCheck } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import { loadAdminSummary } from "../store/slices/adminDashboardSlice";
import { Skeleton } from "../../web/components/ui/skeleton";
import { AdminErrorAlert, AdminPageHeader } from "../components/AdminUi";
import { Card, CardContent } from "../../web/components/ui/card";
import { Badge } from "../../web/components/ui/badge";
import { Button } from "../../web/components/ui/button";

function formatCurrency(value: number, currency: string) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency || "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

interface MetricCardProps {
  label: string;
  value: number | string;
  hint: string;
  tone?: "neutral" | "success" | "warning";
}

function MetricCard({ label, value, hint, tone = "neutral" }: MetricCardProps) {
  const toneClass =
    tone === "success"
      ? "border-emerald-500/30 bg-emerald-500/5"
      : tone === "warning"
        ? "border-amber-500/30 bg-amber-500/5"
        : "border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/65";

  return (
    <Card className={toneClass}>
      <CardContent className="p-4">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
        <p className="mt-2 text-2xl font-semibold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

export function AdminOverviewPage() {
  const dispatch = useAdminDispatch();
  const { summary, isLoading, error } = useAdminSelector((state) => state.adminDashboard);

  useEffect(() => {
    void dispatch(loadAdminSummary());
  }, [dispatch]);

  const pendingListings = summary?.pendingListings ?? 0;
  const pendingTrades = summary?.pendingTrades ?? 0;
  const pendingOrders = summary?.pendingOrders ?? 0;
  const totalTransactions = summary?.totalTransactions ?? 0;
  const completedTransactions = summary?.completedTransactions ?? 0;
  const pendingQueueTotal = pendingListings + pendingTrades + pendingOrders;
  const completionRate = totalTransactions > 0 ? Math.round((completedTransactions / totalTransactions) * 100) : 0;
  const revenueCurrency = summary?.revenueCurrency ?? "USD";

  return (
    <section>
      <AdminPageHeader
        title="Operations Overview"
        description="Queues, throughput, and revenue snapshots separated for faster decision making."
        count={pendingQueueTotal}
        countLabel="items in queue"
        isRefreshing={isLoading}
        onRefresh={() => void dispatch(loadAdminSummary())}
      />

      {error ? <AdminErrorAlert message={error} /> : null}

      {isLoading && !summary ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <article key={index} className="rounded-xl border border-border bg-card p-4">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="mt-3 h-8 w-16" />
            </article>
          ))}
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            <Card className="border-border/80">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Operational Health</p>
                    <h3 className="mt-1 text-lg font-semibold">Queue and Transaction Flow</h3>
                  </div>
                  <Badge variant="outline" className="gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {pendingQueueTotal === 0 ? "Healthy" : "Needs attention"}
                  </Badge>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Pending Listings</p>
                    <p className="mt-1 text-xl font-semibold">{pendingListings}</p>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Pending Trades</p>
                    <p className="mt-1 text-xl font-semibold">{pendingTrades}</p>
                  </div>
                  <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">Pending Orders</p>
                    <p className="mt-1 text-xl font-semibold">{pendingOrders}</p>
                  </div>
                </div>
                <div className="rounded-lg border border-border/80 bg-muted/20 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">Completed Transactions</p>
                    <p className="text-xs font-medium">{completionRate}%</p>
                  </div>
                    <p className="mt-1 text-xl font-semibold">
                      {completedTransactions} / {totalTransactions}
                    </p>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-background">
                    <div className="h-full rounded-full bg-emerald-500/80" style={{ width: `${completionRate}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>

            <Card className="border-emerald-500/25 bg-emerald-500/5">
              <CardContent className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Revenue Snapshot</p>
                    <h3 className="mt-1 text-lg font-semibold">Financial Performance</h3>
                  </div>
                  <Badge variant="outline" className="gap-1 border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                    <Banknote className="h-3.5 w-3.5" />
                    {revenueCurrency}
                  </Badge>
                </div>
                <div className="space-y-2 rounded-lg border border-emerald-500/20 bg-background/30 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Today</span>
                    <span className="font-semibold">{formatCurrency(summary?.revenueToday ?? 0, revenueCurrency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Month-to-Date</span>
                    <span className="font-semibold">{formatCurrency(summary?.revenueMonthToDate ?? 0, revenueCurrency)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last 30 Days</span>
                    <span className="font-semibold">{formatCurrency(summary?.revenueLast30Days ?? 0, revenueCurrency)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/20 bg-background/30 p-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Avg Completed Tx Value (30d)</p>
                    <p className="mt-1 text-xl font-semibold">
                      {formatCurrency(summary?.averageCompletedTransactionValue ?? 0, revenueCurrency)}
                    </p>
                  </div>
                  <ArrowUpRight className="h-5 w-5 text-emerald-300" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              label="Queue Total"
              value={pendingQueueTotal}
              hint="Listings + trades + orders waiting for action."
              tone={pendingQueueTotal === 0 ? "success" : "warning"}
            />
            <MetricCard
              label="Total Transactions"
              value={totalTransactions}
              hint="All transaction records tracked in admin."
            />
            <MetricCard
              label="Completed Transactions"
              value={completedTransactions}
              hint="Successfully completed transaction records."
              tone="success"
            />
            <MetricCard
              label="Completion Rate"
              value={`${completionRate}%`}
              hint="Completed over total transaction volume."
              tone={completionRate >= 70 ? "success" : "warning"}
            />
          </div>

          <div className="mt-6 rounded-xl border border-border/80 bg-card p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Quick Actions</p>
                <h3 className="mt-1 text-base font-semibold">Jump to Priority Work Queues</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link to="/listings">
                    <ClipboardList className="h-4 w-4" />
                    Review Listings
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/trades">
                    <ArrowRight className="h-4 w-4" />
                    Review Trades
                  </Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link to="/transactions">
                    <LineChart className="h-4 w-4" />
                    Review Transactions
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
