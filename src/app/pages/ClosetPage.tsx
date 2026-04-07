import { useEffect, useMemo, useState } from "react";
import { Search, Filter, LayoutGrid, List, TrendingUp } from "lucide-react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Spinner } from "../components/ui/spinner";
import { useAppSelector } from "../store/hooks";
import { subscribeCloset } from "../services/closetService";
import type { ClosetItem } from "../types/domain";

export function ClosetPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "owned" | "trading" | "sold" | "duplicate">(
    "all",
  );
  const [shirts, setShirts] = useState<ClosetItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setShirts([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLoadError(null);

    const unsubscribe = subscribeCloset(
      user.uid,
      (items) => {
        setShirts(items);
        setIsLoading(false);
      },
      undefined,
      () => {
        setLoadError("Failed to load your closet from Firestore.");
        setShirts([]);
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  const filteredShirts = useMemo(
    () =>
      shirts.filter((shirt) => {
        const matchesSearch =
          shirt.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
          shirt.league.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter =
          filterStatus === "all" ||
          (filterStatus === "duplicate"
            ? Boolean(shirt.isDuplicate)
            : shirt.status.toLowerCase() === filterStatus);
        return matchesSearch && matchesFilter;
      }),
    [filterStatus, searchQuery, shirts],
  );

  const getStatusColor = (status: ClosetItem["status"]) => {
    switch (status) {
      case "owned":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "trading":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "sold":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">My Closet</h1>
          <p className="text-muted-foreground">Your collection of {shirts.length} mystery shirts</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-8">
          <div className="flex flex-col gap-3 md:gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by team or league..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-11 w-full pl-10 pr-4 bg-accent rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}
              >
                <SelectTrigger className="h-11 min-w-36 rounded-lg border border-border bg-card shadow-sm data-[state=open]:border-red-500 data-[state=open]:shadow-xl focus-visible:border-red-500 focus-visible:ring-0">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-border bg-card shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="owned">Owned</SelectItem>
                  <SelectItem value="trading">Trading</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="duplicate">Duplicate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 bg-accent rounded-lg p-1 self-end md:self-auto">
              <button
                onClick={() => setViewMode("grid")}
                className={`min-h-11 min-w-11 rounded ${
                  viewMode === "grid" ? "bg-card shadow" : "hover:bg-card/50"
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="mx-auto h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`min-h-11 min-w-11 rounded ${
                  viewMode === "list" ? "bg-card shadow" : "hover:bg-card/50"
                }`}
                aria-label="List view"
              >
                <List className="mx-auto h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {loadError}
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center flex flex-col items-center gap-3">
            <Spinner className="h-8 w-8 text-red-500" />
            <p className="text-muted-foreground text-lg">Loading your closet</p>
          </div>
        )}

        {!isLoading && viewMode === "grid" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 md:gap-6">
            {filteredShirts.map((shirt) => (
              <div
                key={shirt.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-square">
                  <img
                    src={shirt.imageUrl}
                    alt={shirt.team}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {shirt.status === "owned" ? (
                    <div className="absolute top-3 right-3 flex flex-col items-end gap-2">
                      <span className="inline-flex rounded-md border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-400">
                        Tradable
                      </span>
                      {shirt.isDuplicate && (
                        <span className="inline-flex rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-400">
                          Duplicate
                        </span>
                      )}
                    </div>
                  ) : (
                    <div
                      className={`absolute top-3 right-3 inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(
                        shirt.status,
                      )}`}
                    >
                      {shirt.status}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{shirt.team}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{shirt.league}</p>
                  {shirt.status === "owned" && (
                    <button className="w-full min-h-11 py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Add to Trade
                    </button>
                  )}
                  {shirt.status === "trading" && (
                    <button className="w-full min-h-11 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors">
                      View Trade Offers
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && viewMode === "list" && (
          <div className="space-y-4">
            {filteredShirts.map((shirt) => (
              <div
                key={shirt.id}
                className="bg-card border border-border rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <img
                    src={shirt.imageUrl}
                    alt={shirt.team}
                    className="w-full h-40 sm:h-24 sm:w-24 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{shirt.team}</h3>
                        <p className="text-sm text-muted-foreground">{shirt.league}</p>
                      </div>
                      {shirt.status !== "owned" && (
                        <div
                          className={`inline-flex w-fit rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(
                            shirt.status,
                          )}`}
                        >
                          {shirt.status}
                        </div>
                      )}
                    </div>
                    {shirt.status === "owned" && (
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mt-3">
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex rounded-md border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-400">
                            Tradable
                          </span>
                          {shirt.isDuplicate && (
                            <span className="inline-flex rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-400">
                              Duplicate
                            </span>
                          )}
                        </div>
                        <button className="w-full sm:w-auto px-6 min-h-11 py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Add to Trade
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && filteredShirts.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <LayoutGrid className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">Your closet is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Place an order or complete a trade to start building your collection.
            </p>
            <div className="mt-6">
              <Link
                to="/transactions"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
              >
                Go to Recent Orders
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



