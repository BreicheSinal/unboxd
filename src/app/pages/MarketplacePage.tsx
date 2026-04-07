import { useEffect, useMemo, useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { getActiveListings } from "../services/marketplaceService";
import type { MarketplaceListing } from "../types/domain";

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSize, setFilterSize] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [tradeItems, setTradeItems] = useState<MarketplaceListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setLoadError(null);

    getActiveListings()
      .then((items) => {
        if (!isMounted) return;
        setTradeItems(items);
        setIsLoading(false);
      })
      .catch(() => {
        if (!isMounted) return;
        setLoadError("Failed to load marketplace listings from Firestore.");
        setTradeItems([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    const items = tradeItems.filter((item) => {
      const matchesSearch =
        item.shirtSnapshot.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shirtSnapshot.league.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSize = filterSize === "all" || item.shirtSnapshot.size === filterSize;
      return matchesSearch && matchesSize;
    });

    if (sortBy === "team") {
      return [...items].sort((a, b) => a.shirtSnapshot.team.localeCompare(b.shirtSnapshot.team));
    }

    if (sortBy === "popular") {
      return [...items].sort((a, b) => Number(b.tradeOptions.acceptsMoney) - Number(a.tradeOptions.acceptsMoney));
    }

    return items;
  }, [tradeItems, searchQuery, filterSize, sortBy]);

  return (
    <div className="min-h-screen py-8 md:py-12">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Trading Marketplace</h1>
          <p className="text-muted-foreground">
            Trade shirts with other collectors or exchange for mystery shirts
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-8">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:gap-4">
            <div className="relative">
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
              <Select value={filterSize} onValueChange={setFilterSize}>
                <SelectTrigger className="h-11 min-w-36 rounded-lg border border-border bg-card shadow-sm data-[state=open]:border-red-500 data-[state=open]:shadow-xl focus-visible:border-red-500 focus-visible:ring-0">
                  <SelectValue placeholder="All Sizes" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-border bg-card shadow-xl">
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-5 w-5 text-muted-foreground" />
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-11 min-w-40 rounded-lg border border-border bg-card shadow-sm data-[state=open]:border-red-500 data-[state=open]:shadow-xl focus-visible:border-red-500 focus-visible:ring-0">
                  <SelectValue placeholder="Most Recent" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border border-border bg-card shadow-xl">
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="team">Team A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loadError && (
          <div className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {loadError}
          </div>
        )}

        {isLoading && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-lg">Loading marketplace listings...</p>
          </div>
        )}

        {!isLoading && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className="relative aspect-square">
                <img
                  src={item.shirtSnapshot.imageUrl}
                  alt={item.shirtSnapshot.team}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-bold">
                  Size {item.shirtSnapshot.size}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{item.shirtSnapshot.team}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.shirtSnapshot.league}</p>
                <div className="text-sm text-muted-foreground mb-4">
                  Listed by <span className="text-foreground font-bold">{item.ownerName ?? "Collector"}</span>
                </div>

                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">Trade Options</h4>
                  <div className="flex flex-wrap gap-1">
                    {item.tradeOptions.shirtForShirt && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">Shirt Swap</span>
                    )}
                    {item.tradeOptions.acceptsMoney && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">Money</span>
                    )}
                    {item.tradeOptions.platformExchange && (
                      <span className="px-2 py-1 bg-zinc-500/10 text-zinc-400 rounded text-xs">Mystery</span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/trade/${item.id}`}
                  className="block w-full min-h-11 py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all text-center font-bold"
                >
                  Make Offer
                </Link>
              </div>
            </div>
          ))}
        </div>}

        {!isLoading && filteredItems.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card/40 py-16 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent">
              <Search className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-lg font-semibold">No marketplace listings yet</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Check back soon or adjust filters to see new trade opportunities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
