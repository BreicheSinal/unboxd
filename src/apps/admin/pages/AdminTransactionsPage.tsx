import { useEffect, useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import {
  loadAdminTransactions,
  selectAdminTransactions,
} from "../store/slices/adminTransactionsSlice";
import { AdminTableLoadingRow } from "../components/AdminTableLoadingRow";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminSearch, AdminStatusBadge, formatDateTime } from "../components/AdminUi";
import { Badge } from "../../web/components/ui/badge";
import { Spinner } from "../../web/components/ui/spinner";

export function AdminTransactionsPage() {
  const dispatch = useAdminDispatch();
  const transactions = useAdminSelector(selectAdminTransactions);
  const { isLoading, hasLoaded, error } = useAdminSelector((state) => state.adminTransactions);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && !hasLoaded) {
      void dispatch(loadAdminTransactions({ limit: 50 }));
    }
  }, [dispatch, hasLoaded, isLoading]);

  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return transactions;

    return transactions.filter((transaction) =>
      [
        transaction.id,
        transaction.type,
        transaction.status,
        transaction.currency,
        transaction.buyerName,
        transaction.buyerUid,
        transaction.sellerName,
        transaction.sellerUid,
        transaction.orderId,
        transaction.offerId,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [transactions, searchQuery]);
  const showSearchControls = isLoading || transactions.length > 0 || searchQuery.trim().length > 0;

  const formatType = (value: string) => (value ? value.charAt(0).toUpperCase() + value.slice(1) : value);

  return (
    <section>
      <AdminPageHeader
        title="Transactions"
        description="Read-only ledger derived from order/trade outcomes."
        count={filteredTransactions.length}
        countLabel="transactions"
        isRefreshing={isLoading}
        onRefresh={() => void dispatch(loadAdminTransactions({ limit: 50 }))}
      />
      {showSearchControls ? (
        <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by id, type, status, or participant..." />
      ) : null}
      {error ? <AdminErrorAlert message={error} /> : null}

      {!isLoading && filteredTransactions.length === 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-card">
          <AdminEmptyState
            icon={Receipt}
            title="No transactions found"
            subtitle="Try adjusting your search filters or refresh to load recent transaction records."
            className="py-10"
          />
        </div>
      ) : (
        <div className="mt-5">
          <div className="space-y-3 md:hidden">
            {isLoading && transactions.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6">
                <Spinner className="h-5 w-5" />
                <span className="sr-only">Loading transactions</span>
              </div>
            ) : null}
            {filteredTransactions.map((tx) => (
              <article key={tx.id} className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-xs text-muted-foreground break-all">{tx.id}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <AdminStatusBadge value={tx.status} />
                  <Badge variant="outline">{formatType(tx.type)}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <p>{tx.amount} {tx.currency}</p>
                  <div>
                    <p className="text-xs text-muted-foreground">Buyer</p>
                    <p>{tx.buyerName ?? "-"}</p>
                    <p className="font-mono text-xs text-muted-foreground break-all">{tx.buyerUid ?? "-"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Seller</p>
                    <p>{tx.sellerName ?? "-"}</p>
                    <p className="font-mono text-xs text-muted-foreground break-all">{tx.sellerUid ?? "-"}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Created: {formatDateTime(tx.createdAt)}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[900px] text-sm">
              <thead className="bg-accent/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">ID</th>
                  <th className="px-3 py-2">Type</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Amount</th>
                  <th className="px-3 py-2">Buyer</th>
                  <th className="hidden px-3 py-2 lg:table-cell">Seller</th>
                  <th className="hidden px-3 py-2 md:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && transactions.length === 0 && <AdminTableLoadingRow colSpan={7} label="Loading transactions..." />}
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-t border-border">
                    <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{tx.id}</td>
                    <td className="px-3 py-2">{formatType(tx.type)}</td>
                    <td className="px-3 py-2">
                      <AdminStatusBadge value={tx.status} />
                    </td>
                    <td className="px-3 py-2">
                      {tx.amount} {tx.currency}
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm">{tx.buyerName ?? "-"}</p>
                      <p className="font-mono text-xs text-muted-foreground break-all">{tx.buyerUid ?? "-"}</p>
                    </td>
                    <td className="hidden px-3 py-2 lg:table-cell">
                      <p className="text-sm">{tx.sellerName ?? "-"}</p>
                      <p className="font-mono text-xs text-muted-foreground break-all">{tx.sellerUid ?? "-"}</p>
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{formatDateTime(tx.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
