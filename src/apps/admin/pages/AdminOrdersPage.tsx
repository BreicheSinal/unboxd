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

export function AdminOrdersPage() {
  const dispatch = useAdminDispatch();
  const orders = useAdminSelector(selectAdminOrders);
  const { isLoading, hasLoaded, isUpdating, error } = useAdminSelector((state) => state.adminOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !hasLoaded) {
      void dispatch(loadAdminOrders({ limit: 50 }));
    }
  }, [dispatch, hasLoaded, isLoading]);

  const filteredOrders = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return orders;

    return orders.filter((order) =>
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
  }, [orders, searchQuery]);

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
      <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by order id, buyer, status..." total={filteredOrders.length} totalLabel="Total" />
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
              <div className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">Loading orders...</div>
            ) : null}
            {filteredOrders.map((order) => (
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
                    title="Mark completed"
                    aria-label="Mark completed"
                    disabled={isUpdating}
                    onClick={() => void handleOrderAction(`${order.id}:completed`, { orderId: order.id, status: "completed" })}
                  >
                    {pendingActionKey === `${order.id}:completed` ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                    Complete
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    title="Reconcile payment"
                    aria-label="Reconcile payment"
                    disabled={isUpdating}
                    onClick={() =>
                      void handleOrderAction(`${order.id}:reconcile`, {
                        orderId: order.id,
                        reconciliationStatus: "reconciled",
                        paymentState: "paid",
                      })
                    }
                  >
                    {pendingActionKey === `${order.id}:reconcile` ? <Spinner className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
                    Reconcile
                  </Button>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[980px] text-sm">
              <thead className="bg-accent/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Buyer</th>
                  <th className="hidden px-3 py-2 md:table-cell">Provider</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Payment</th>
                  <th className="hidden px-3 py-2 lg:table-cell">Reconciliation</th>
                  <th className="hidden px-3 py-2 md:table-cell">Created</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                  <th className="px-3 py-2" aria-label="View" />
                </tr>
              </thead>
              <tbody>
                {isLoading && orders.length === 0 && <AdminTableLoadingRow colSpan={9} label="Loading orders..." />}
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-t border-border">
                    <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{order.id}</td>
                    <td className="px-3 py-2">
                      <p className="text-sm">{order.buyerName ?? "Unknown user"}</p>
                      <p className="font-mono text-xs text-muted-foreground break-all">{order.buyerUid}</p>
                    </td>
                    <td className="hidden px-3 py-2 md:table-cell">{formatProvider(order.provider)}</td>
                    <td className="px-3 py-2">
                      <AdminStatusBadge value={order.status} />
                    </td>
                    <td className="px-3 py-2">
                      <AdminStatusBadge value={order.paymentState} />
                    </td>
                    <td className="hidden px-3 py-2 lg:table-cell">
                      <AdminStatusBadge value={order.reconciliationStatus} />
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{formatDateTime(order.createdAt)}</td>
                    <td className="px-3 py-2">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="Mark completed"
                          aria-label="Mark completed"
                          disabled={isUpdating}
                          onClick={() => void handleOrderAction(`${order.id}:completed`, { orderId: order.id, status: "completed" })}
                        >
                          {pendingActionKey === `${order.id}:completed` ? <Spinner className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0"
                          title="Reconcile payment"
                          aria-label="Reconcile payment"
                          disabled={isUpdating}
                          onClick={() =>
                            void handleOrderAction(`${order.id}:reconcile`, {
                              orderId: order.id,
                              reconciliationStatus: "reconciled",
                              paymentState: "paid",
                            })
                          }
                        >
                          {pendingActionKey === `${order.id}:reconcile` ? <Spinner className="h-4 w-4" /> : <Banknote className="h-4 w-4" />}
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
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {isUpdating ? (
        <Badge variant="outline" className="mt-3 px-2.5 py-1 text-xs text-muted-foreground">
          Applying changes...
        </Badge>
      ) : null}
    </section>
  );
}
