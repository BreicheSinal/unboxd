import { useEffect, useMemo, useState } from "react";
import { Package } from "lucide-react";
import { useAdminDispatch, useAdminSelector } from "../store/hooks";
import {
  loadAdminListings,
  moderateListing,
  selectAdminListings,
} from "../store/slices/adminListingsModerationSlice";
import { AdminTableLoadingRow } from "../components/AdminTableLoadingRow";
import { AdminEmptyState, AdminErrorAlert, AdminPageHeader, AdminSearch, AdminStatusBadge, formatDateTime } from "../components/AdminUi";
import { Button } from "../../web/components/ui/button";
import { Badge } from "../../web/components/ui/badge";
import { Spinner } from "../../web/components/ui/spinner";

export function AdminListingsPage() {
  const dispatch = useAdminDispatch();
  const listings = useAdminSelector(selectAdminListings);
  const { hasLoaded, isLoading, isUpdating, error } = useAdminSelector((state) => state.adminListings);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingActionKey, setPendingActionKey] = useState<string | null>(null);

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      void dispatch(loadAdminListings({ limit: 50 }));
    }
  }, [dispatch, hasLoaded, isLoading]);

  const filteredListings = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return listings;

    return listings.filter((listing) =>
      [listing.id, listing.ownerUid, listing.ownerName, listing.status, listing.size, String(listing.shirtSnapshot.team ?? "")]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [listings, searchQuery]);
  const showSearchControls = isLoading || listings.length > 0 || searchQuery.trim().length > 0;

  const handleModeration = async (listingId: string, action: "approve" | "reject") => {
    const actionKey = `${listingId}:${action}`;
    setPendingActionKey(actionKey);
    try {
      await dispatch(moderateListing({ listingId, action })).unwrap();
    } finally {
      setPendingActionKey(null);
    }
  };

  return (
    <section>
      <AdminPageHeader
        title="Listing Moderation"
        description="Approve or reject listings before they appear in marketplace."
        count={filteredListings.length}
        countLabel="listings"
        isRefreshing={isLoading}
        onRefresh={() => void dispatch(loadAdminListings({ limit: 50 }))}
      />
      {showSearchControls ? (
        <AdminSearch value={searchQuery} onChange={setSearchQuery} placeholder="Search by listing id, owner, team..." />
      ) : null}
      {error ? <AdminErrorAlert message={error} /> : null}

      {!isLoading && filteredListings.length === 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-card">
          <AdminEmptyState
            icon={Package}
            title="No listings found"
            subtitle="No listings match your search. Try another query or refresh to see new moderation items."
            className="py-10"
          />
        </div>
      ) : (
        <div className="mt-5">
          <div className="space-y-3 md:hidden">
            {isLoading && listings.length === 0 ? (
              <div className="flex items-center justify-center rounded-xl border border-border bg-card p-6">
                <Spinner className="h-5 w-5" />
                <span className="sr-only">Loading listings</span>
              </div>
            ) : null}
            {filteredListings.map((listing) => (
              <article key={listing.id} className="rounded-xl border border-border bg-card p-4">
                <p className="font-mono text-xs text-muted-foreground break-all">{listing.id}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <AdminStatusBadge value={listing.status} />
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Owner</p>
                    <p className="font-mono text-xs break-all">{listing.ownerUid}</p>
                  </div>
                  <p>Team: {String((listing.shirtSnapshot.team as string) ?? "-")}</p>
                  <p className="text-xs text-muted-foreground">Created: {formatDateTime(listing.createdAt)}</p>
                </div>
                <div className="mt-3 flex gap-2">
                  {listing.status === "pending_approval" ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[var(--brand-light-purple)]/35 text-[var(--brand-light-purple)] hover:bg-[var(--brand-light-purple)]/10"
                        disabled={isUpdating}
                        onClick={() => void handleModeration(listing.id, "approve")}
                      >
                        {pendingActionKey === `${listing.id}:approve` ? <Spinner className="h-4 w-4" /> : null}
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-[var(--brand-vivid-red)]/40 text-[var(--brand-vivid-red)] hover:bg-[var(--brand-vivid-red)]/10"
                        disabled={isUpdating}
                        onClick={() => void handleModeration(listing.id, "reject")}
                      >
                        {pendingActionKey === `${listing.id}:reject` ? <Spinner className="h-4 w-4" /> : null}
                        Reject
                      </Button>
                    </>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      No moderation action
                    </Badge>
                  )}
                </div>
              </article>
            ))}
          </div>

          <div className="hidden overflow-x-auto table-scrollbar rounded-xl border border-border bg-card md:block">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-accent/30 text-left text-muted-foreground">
                <tr>
                  <th className="px-3 py-2">Listing</th>
                  <th className="px-3 py-2">Owner</th>
                  <th className="px-3 py-2">Team</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="hidden px-3 py-2 md:table-cell">Created</th>
                  <th className="px-3 py-2" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {isLoading && listings.length === 0 && <AdminTableLoadingRow colSpan={6} label="Loading listings..." />}
                {filteredListings.map((listing) => (
                  <tr key={listing.id} className="border-t border-border">
                    <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{listing.id}</td>
                    <td className="max-w-[220px] px-3 py-2 font-mono text-xs break-all">{listing.ownerUid}</td>
                    <td className="px-3 py-2">{String((listing.shirtSnapshot.team as string) ?? "-")}</td>
                    <td className="px-3 py-2">
                      <AdminStatusBadge value={listing.status} />
                    </td>
                    <td className="hidden px-3 py-2 text-xs text-muted-foreground md:table-cell">{formatDateTime(listing.createdAt)}</td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        {listing.status === "pending_approval" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[var(--brand-light-purple)]/35 text-[var(--brand-light-purple)] hover:bg-[var(--brand-light-purple)]/10"
                              disabled={isUpdating}
                              onClick={() => void handleModeration(listing.id, "approve")}
                            >
                              {pendingActionKey === `${listing.id}:approve` ? <Spinner className="h-4 w-4" /> : null}
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[var(--brand-vivid-red)]/40 text-[var(--brand-vivid-red)] hover:bg-[var(--brand-vivid-red)]/10"
                              disabled={isUpdating}
                              onClick={() => void handleModeration(listing.id, "reject")}
                            >
                              {pendingActionKey === `${listing.id}:reject` ? <Spinner className="h-4 w-4" /> : null}
                              Reject
                            </Button>
                          </>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            No moderation action
                          </Badge>
                        )}
                      </div>
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
          Applying moderation action...
        </Badge>
      ) : null}
    </section>
  );
}

