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
  const showSearchControls = isLoading || trades.length > 0 || searchQuery.trim().length > 0;

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
      {showSearchControls ? (
        <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by offer id, user, status, listing..." />
      ) : null}
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
        <div className="mt-5 max-[750px]:mt-4">
          <div className="space-y-3 md:hidden max-[750px]:space-y-2">
            {isLoading && trades.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6">
                <Spinner className="h-5 w-5" />
                <span className="sr-only">Loading trades</span>
              </div>
            ) : null}
            {filteredTrades.map((trade) => {
              const nextStatus = nextStatusByCurrent[trade.status];
              return (
                <article key={trade.id} className="rounded-xl border border-border bg-card p-4 max-[750px]:p-3">
                  <p className="font-mono text-xs text-muted-foreground break-all max-[750px]:text-[11px]">{trade.id}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <AdminStatusBadge value={trade.status} />
                    <Badge variant="outline" className="capitalize">{trade.tradeType}</Badge>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm min-[480px]:grid-cols-2 max-[750px]:mt-2 max-[750px]:gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">From</p>
                      <p className="break-words">{trade.fromName ?? "Unknown user"}</p>
                      <p className="font-mono text-xs text-muted-foreground break-all">{trade.fromUid}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">To</p>
                      <p className="break-words">{trade.toName ?? "Unknown user"}</p>
                      <p className="font-mono text-xs text-muted-foreground break-all">{trade.toUid}</p>
                    </div>
                    <div className="min-[480px]:col-span-2">
                      <p className="text-xs text-muted-foreground">Created</p>
                      <p>{formatDateTime(trade.createdAt)}</p>
                    </div>
                  </div>
                  <div className="mt-3 max-[750px]:mt-2">
                    {nextStatus ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isUpdating}
                        onClick={() => void handleTransition(trade.id, nextStatus)}
                        className="w-full"
                      >
                        {pendingActionKey === `${trade.id}:${nextStatus}` ? <Spinner className="h-4 w-4" /> : null}
                        Move to {nextStatus}
                      </Button>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">
                        No further transition
                      </Badge>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto table-scrollbar rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[920px] text-sm">
              <thead className="bg-accent/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Offer</th>
                  <th className="hidden px-3 py-2 md:table-cell">Type</th>
                  <th className="px-3 py-2">From</th>
                  <th className="px-3 py-2">To</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="hidden px-3 py-2 lg:table-cell">Created</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {isLoading && trades.length === 0 && <AdminTableLoadingRow colSpan={7} label="Loading trades..." />}
                {filteredTrades.map((trade) => {
                  const nextStatus = nextStatusByCurrent[trade.status];
                  return (
                    <tr key={trade.id} className="border-t border-border">
                      <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{trade.id}</td>
                      <td className="hidden px-3 py-2 md:table-cell">{trade.tradeType}</td>
                      <td className="px-3 py-2">
                        <p className="text-sm">{trade.fromName ?? "Unknown user"}</p>
                        <p className="font-mono text-xs text-muted-foreground break-all">{trade.fromUid}</p>
                      </td>
                      <td className="px-3 py-2">
                        <p className="text-sm">{trade.toName ?? "Unknown user"}</p>
                        <p className="font-mono text-xs text-muted-foreground break-all">{trade.toUid}</p>
                      </td>
                      <td className="px-3 py-2">
                        <AdminStatusBadge value={trade.status} />
                      </td>
                      <td className="hidden px-3 py-2 text-xs text-muted-foreground lg:table-cell">{formatDateTime(trade.createdAt)}</td>
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

