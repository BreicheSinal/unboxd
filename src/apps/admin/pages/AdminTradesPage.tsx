import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import { loadAdminTrades, selectAdminTrades, transitionTrade } from "../store/slices/adminTradesSlice";
import { AdminTableLoadingRow } from "../components/AdminTableLoadingRow";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminSearch, AdminStatusBadge, formatDateTime } from "../components/AdminUi";
import { Button } from "../../web/components/ui/button";
import { Badge } from "../../web/components/ui/badge";
import { Spinner } from "../../web/components/ui/spinner";

const nextStatusByCurrent: Record<string, string> = {
  pending: "accepted",
  accepted: "shipped",
  shipped: "completed",
};

export function AdminTradesPage() {
  const dispatch = useAdminDispatch();
  const trades = useAdminSelector(selectAdminTrades);
  const { hasLoaded, isLoading, isUpdating, error } = useAdminSelector((state) => state.adminTrades);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      void dispatch(loadAdminTrades({ limit: 50 }));
    }
  }, [dispatch, hasLoaded, isLoading]);

  const filteredTrades = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return trades;

    return trades.filter((trade) =>
      [trade.id, trade.fromName, trade.fromUid, trade.toName, trade.toUid, trade.tradeType, trade.status, trade.listingId]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [trades, searchQuery]);

  const handleTransition = async (offerId: string, toStatus: string) => {
    const actionKey = `${offerId}:${toStatus}`;
    setPendingActionKey(actionKey);
    try {
      await dispatch(transitionTrade({ offerId, toStatus })).unwrap();
    } finally {
      setPendingActionKey(null);
    }
  };

  return (
    <section>
      <AdminPageHeader
        title="Trades"
        description="Manage trade progression with validated server-side transitions."
        count={filteredTrades.length}
        countLabel="trades"
        isRefreshing={isLoading}
        onRefresh={() => void dispatch(loadAdminTrades({ limit: 50 }))}
      />
      <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by offer id, user, status, listing..." total={filteredTrades.length} totalLabel="Total" />
      {error ? <AdminErrorAlert message={error} /> : null}

      {!isLoading && filteredTrades.length === 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-card">
          <AdminEmptyState
            icon={ArrowLeftRight}
            title="No trades found"
            subtitle="No trade offers match your search. Try another query or refresh the trade queue."
            className="py-10"
          />
        </div>
      ) : (
        <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-accent/30 text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2">Offer</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">From</th>
                <th className="px-3 py-2">To</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Created</th>
                <th className="px-3 py-2" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {isLoading && trades.length === 0 && <AdminTableLoadingRow colSpan={7} label="Loading trades..." />}
              {filteredTrades.map((trade) => {
                const nextStatus = nextStatusByCurrent[trade.status];
                return (
                  <tr key={trade.id} className="border-t border-border">
                  <td className="px-3 py-2 font-mono text-xs">{trade.id}</td>
                  <td className="px-3 py-2">{trade.tradeType}</td>
                  <td className="px-3 py-2">
                    <p className="text-sm">{trade.fromName ?? "Unknown user"}</p>
                    <p className="font-mono text-xs text-muted-foreground">{trade.fromUid}</p>
                  </td>
                  <td className="px-3 py-2">
                    <p className="text-sm">{trade.toName ?? "Unknown user"}</p>
                    <p className="font-mono text-xs text-muted-foreground">{trade.toUid}</p>
                  </td>
                  <td className="px-3 py-2">
                    <AdminStatusBadge value={trade.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{formatDateTime(trade.createdAt)}</td>
                  <td className="px-3 py-2">
                    {nextStatus ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => void handleTransition(trade.id, nextStatus)}
                      >
                        {pendingActionKey === `${trade.id}:${nextStatus}` ? <Spinner className="h-4 w-4" /> : null}
                        Move to {nextStatus}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        No further transition
                      </Badge>
                    )}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {isUpdating ? (
        <Badge variant="outline" className="mt-3 px-2.5 py-1 text-xs text-muted-foreground">
          Updating trade status...
        </Badge>
      ) : null}
    </section>
  );
}
