import { useEffect, useMemo, useState } from "react";
import { Receipt } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import {
  loadAdminTransactions,
  selectAdminTransactions,
} from "../store/slices/adminTransactionsSlice";
import { AdminTableLoadingRow } from "../components/AdminTableLoadingRow";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminSearch, AdminStatusBadge, formatDateTime } from "../components/AdminUi";

export function AdminTransactionsPage() {
  const dispatch = useAdminDispatch();
  const transactions = useAdminSelector(selectAdminTransactions);
  const { isLoading, error } = useAdminSelector((state) => state.adminTransactions);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isLoading && transactions.length === 0) {
      void dispatch(loadAdminTransactions({ limit: 50 }));
    }
  }, [dispatch, isLoading, transactions.length]);

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
      <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by id, type, status, or participant..." total={filteredTransactions.length} totalLabel="Total" />
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
        <div className="mt-5 overflow-x-auto rounded-xl border border-border bg-card">
          <table className="min-w-full text-sm">
            <thead className="bg-accent/30 text-left text-muted-foreground">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Amount</th>
                <th className="px-3 py-2">Buyer</th>
                <th className="px-3 py-2">Seller</th>
                <th className="px-3 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && transactions.length === 0 && <AdminTableLoadingRow colSpan={7} label="Loading transactions..." />}
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="border-t border-border">
                <td className="px-3 py-2 font-mono text-xs">{tx.id}</td>
                <td className="px-3 py-2">{formatType(tx.type)}</td>
                <td className="px-3 py-2">
                  <AdminStatusBadge value={tx.status} />
                </td>
                <td className="px-3 py-2">
                  {tx.amount} {tx.currency}
                </td>
                <td className="px-3 py-2">
                  <p className="text-sm">{tx.buyerName ?? "-"}</p>
                  <p className="font-mono text-xs text-muted-foreground">{tx.buyerUid ?? "-"}</p>
                </td>
                <td className="px-3 py-2">
                  <p className="text-sm">{tx.sellerName ?? "-"}</p>
                  <p className="font-mono text-xs text-muted-foreground">{tx.sellerUid ?? "-"}</p>
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">{formatDateTime(tx.createdAt)}</td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
