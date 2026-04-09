import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { Banknote, Check, Eye, ShoppingCart } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import { loadAdminOrders, mutateAdminOrder, selectAdminOrders } from "../store/slices/adminOrdersSlice";
import { AdminTableLoadingRow } from "../components/AdminTableLoadingRow";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminSearch, AdminStatusBadge, formatDateTime } from "../components/AdminUi";
import { Button } from "../../web/components/ui/button";
import { Badge } from "../../web/components/ui/badge";
import { Spinner } from "../../web/components/ui/spinner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../web/components/ui/select";

export function AdminOrdersPage() {
  const dispatch = useAdminDispatch();
  const orders = useAdminSelector(selectAdminOrders);
  const { isLoading, hasLoaded, isUpdating, error } = useAdminSelector((state) => state.adminOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !hasLoaded) {
      void dispatch(loadAdminOrders({ limit: 50 }));
    }
  }, [dispatch, hasLoaded, isLoading]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const providerMatched =
      providerFilter === "all"
        ? orders
        : orders.filter((order) => (order.provider ?? "").trim().toLowerCase() === providerFilter);
    if (!query) return providerMatched;

    return providerMatched.filter((order) =>
      [
        order.id,
        order.buyerUid,
        order.buyerName,
        order.status,
        order.paymentState,
        order.reconciliationStatus,
        order.currency,
        order.provider,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [orders, searchQuery, providerFilter]);
  const showSearchControls = isLoading || orders.length > 0 || searchQuery.trim().length > 0;

  const handleOrderAction = async (
    actionKey: string,
    payload: { orderId: string; status?: string; paymentState?: string; reconciliationStatus?: string },
  ) => {
    setPendingActionKey(actionKey);
    try {
      await dispatch(mutateAdminOrder(payload)).unwrap();
    } finally {
      setPendingActionKey(null);
    }
  };

  const formatProvider = (provider: string | null | undefined) => {
    const value = (provider ?? "").trim();
    if (!value) return "-";
    if (value.toLowerCase() === "cod") return "COD";
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  };

  const providerOptions = useMemo(() => {
    const values = Array.from(
      new Set(
        orders
          .map((order) => (order.provider ?? "").trim().toLowerCase())
          .filter((value) => value.length > 0),
      ),
    ).sort();
    return values;
  }, [orders]);

  const getCompletionToggle = (order: (typeof orders)[number]) => {
    const undo = order.status === "completed";
    return {
      actionKey: `${order.id}:status:${undo ? "pending" : "completed"}`,
      payload: { orderId: order.id, status: undo ? "pending" : "completed" },
      label: undo ? "Undo Complete" : "Complete",
      title: undo ? "Undo completed status" : "Mark completed",
    } as const;
  };

  const getReconcileToggle = (order: (typeof orders)[number]) => {
    const undo = order.reconciliationStatus === "reconciled" || order.paymentState === "paid";
    return {
      actionKey: `${order.id}:reconcile:${undo ? "pending" : "reconciled"}`,
      payload: {
        orderId: order.id,
        reconciliationStatus: undo ? "pending" : "reconciled",
        paymentState: undo ? "pending" : "paid",
      },
      label: undo ? "Undo Reconcile" : "Reconcile",
      title: undo ? "Undo reconciliation" : "Reconcile payment",
    } as const;
  };

  return (
    <section>
      <AdminPageHeader
        title="Orders"
        description="Update operational state; linked transaction status is derived automatically."
        count={filteredOrders.length}
        countLabel="orders"
        isRefreshing={isLoading}
        onRefresh={() => void dispatch(loadAdminOrders({ limit: 50 }))}
      />
      {showSearchControls ? (
        <AdminSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by order id, buyer, status..."
          rightSlot={
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="h-10 !w-auto min-w-28 rounded-lg border border-border bg-card sm:min-w-36">
                <SelectValue placeholder="Provider" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-border bg-card">
                <SelectItem value="all">All providers</SelectItem>
                {providerOptions.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {formatProvider(provider)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          }
        />
      ) : null}
      {error ? <AdminErrorAlert message={error} /> : null}

      {!isLoading && filteredOrders.length === 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-card">
          <AdminEmptyState
            icon={ShoppingCart}
            title="No orders found"
            subtitle="Try a different search term or refresh to fetch the latest orders."
            className="py-10"
          />
        </div>
      ) : (
        <div className="mt-5">
          <div className="space-y-3 md:hidden">
            {isLoading && orders.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6">
                <Spinner className="h-5 w-5" />
                <span className="sr-only">Loading orders</span>
              </div>
            ) : null}
            {filteredOrders.map((order) => {
              const completionAction = getCompletionToggle(order);
              const reconcileAction = getReconcileToggle(order);
              return (
              <article key={order.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-mono text-xs text-muted-foreground break-all">{order.id}</p>
                  <Button size="icon" variant="outline" asChild aria-label={`View order ${order.id}`} title="View order">
                    <Link to={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
                <div className="mt-2 grid gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Buyer</p>
                    <p>{order.buyerName ?? "Unknown user"}</p>
                    <p className="font-mono text-xs text-muted-foreground break-all">{order.buyerUid}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <AdminStatusBadge value={order.status} />
                    <AdminStatusBadge value={order.paymentState} />
                    <AdminStatusBadge value={order.reconciliationStatus} />
                  </div>
                  <p className="text-xs text-muted-foreground">Provider: {formatProvider(order.provider)}</p>
                  <p className="text-xs text-muted-foreground">Created: {formatDateTime(order.createdAt)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    title={completionAction.title}
                    aria-label={completionAction.title}
                    disabled={isUpdating}
                    onClick={() => void handleOrderAction(completionAction.actionKey, completionAction.payload)}
                  >
                    {pendingActionKey === completionAction.actionKey ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    {completionAction.label}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    title={reconcileAction.title}
                    aria-label={reconcileAction.title}
                    disabled={isUpdating}
                    onClick={() => void handleOrderAction(reconcileAction.actionKey, reconcileAction.payload)}
                  >
                    {pendingActionKey === reconcileAction.actionKey ? <Spinner className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                    {reconcileAction.label}
                  </Button>
                </div>
              </article>
            )})}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-accent/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Buyer</th>
                  <th className="hidden px-3 py-2 text-center md:table-cell">Provider</th>
                  <th className="px-3 py-2 text-center">Status</th>
                  <th className="px-3 py-2 text-center">Payment</th>
                  <th className="hidden px-3 py-2 text-center lg:table-cell">Reconciliation</th>
                  <th className="hidden px-3 py-2 md:table-cell">Created</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                  <th className="px-3 py-2" aria-label="View" />
                </tr>
              </thead>
              <tbody>
                {isLoading && orders.length === 0 && <AdminTableLoadingRow colSpan={9} label="Loading orders..." />}
                {filteredOrders.map((order) => {
                  const completionAction = getCompletionToggle(order);
                  const reconcileAction = getReconcileToggle(order);
                  return (
                  <tr key={order.id} className="border-t border-border">
                    <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{order.id}</td>
                    <td className="px-3 py-2">
                      <p className="text-sm">{order.buyerName ?? "Unknown user"}</p>
                      <p className="font-mono text-xs text-muted-foreground break-all">{order.buyerUid}</p>
                    </td>
                    <td className="hidden px-3 py-2 text-center md:table-cell">{formatProvider(order.provider)}</td>
                    <td className="px-3 py-2 text-center">
                      <AdminStatusBadge value={order.status} />
                    </td>
                    <td className="px-3 py-2 text-center">
                      <AdminStatusBadge value={order.paymentState} />
                    </td>
                    <td className="hidden px-3 py-2 text-center lg:table-cell">
                      <AdminStatusBadge value={order.reconciliationStatus} />
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{formatDateTime(order.createdAt)}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title={completionAction.title}
                          aria-label={completionAction.title}
                          disabled={isUpdating}
                          onClick={() => void handleOrderAction(completionAction.actionKey, completionAction.payload)}
                        >
                          {pendingActionKey === completionAction.actionKey ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title={reconcileAction.title}
                          aria-label={reconcileAction.title}
                          disabled={isUpdating}
                          onClick={() => void handleOrderAction(reconcileAction.actionKey, reconcileAction.payload)}
                        >
                          {pendingActionKey === reconcileAction.actionKey ? <Spinner className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <Button size="icon" variant="outline" asChild aria-label={`View order ${order.id}`} title="View order">
                        <Link to={`/orders/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
