import { useState } from "react";
import { Search, Filter, ArrowUpDown } from "lucide-react";
import { Link } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface TradeItem {
  id: string;
  shirt: {
    team: string;
    league: string;
    size: string;
    image: string;
  };
  owner: string;
  tradeOptions: {
    shirtForShirt: boolean;
    acceptsMoney: boolean;
    platformExchange: boolean;
  };
}

export function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSize, setFilterSize] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  const tradeItems: TradeItem[] = [
    {
      id: "1",
      shirt: {
        team: "Real Madrid",
        league: "La Liga",
        size: "L",
        image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
      owner: "Alex R.",
      tradeOptions: {
        shirtForShirt: true,
        acceptsMoney: false,
        platformExchange: true,
      },
    },
    {
      id: "2",
      shirt: {
        team: "Barcelona",
        league: "La Liga",
        size: "M",
        image: "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
      owner: "Sarah C.",
      tradeOptions: {
        shirtForShirt: true,
        acceptsMoney: true,
        platformExchange: false,
      },
    },
    {
      id: "3",
      shirt: {
        team: "Manchester United",
        league: "Premier League",
        size: "XL",
        image: "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
      owner: "Marcus J.",
      tradeOptions: {
        shirtForShirt: true,
        acceptsMoney: true,
        platformExchange: true,
      },
    },
    {
      id: "4",
      shirt: {
        team: "Bayern Munich",
        league: "Bundesliga",
        size: "L",
        image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      },
      owner: "Emma L.",
      tradeOptions: {
        shirtForShirt: false,
        acceptsMoney: true,
        platformExchange: false,
      },
    },
  ];

  const filteredItems = tradeItems.filter((item) => {
    const matchesSearch =
      item.shirt.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shirt.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSize = filterSize === "all" || item.shirt.size === filterSize;
    return matchesSearch && matchesSize;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Trading Marketplace</h1>
          <p className="text-muted-foreground">
            Trade shirts with other collectors or exchange for mystery shirts
          </p>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by team or league..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full pl-10 pr-4 bg-accent rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Size Filter */}
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

            {/* Sort */}
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

        {/* Trade Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group"
            >
              {/* Shirt Image */}
              <div className="relative aspect-square">
                <img
                  src={item.shirt.image}
                  alt={item.shirt.team}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute top-3 right-3 px-3 py-1 bg-card/90 backdrop-blur-sm rounded-full text-xs font-bold">
                  Size {item.shirt.size}
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4">
                <h3 className="text-xl font-bold mb-1">{item.shirt.team}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {item.shirt.league}
                </p>
                <div className="text-sm text-muted-foreground mb-4">
                  Listed by <span className="text-foreground font-bold">{item.owner}</span>
                </div>

                {/* Trade Options */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase">
                    Trade Options
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {item.tradeOptions.shirtForShirt && (
                      <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs">
                        Shirt Swap
                      </span>
                    )}
                    {item.tradeOptions.acceptsMoney && (
                      <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs">
                        💰 Money
                      </span>
                    )}
                    {item.tradeOptions.platformExchange && (
                      <span className="px-2 py-1 bg-zinc-500/10 text-zinc-400 rounded text-xs">
                        ✨ Mystery
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/trade/${item.id}`}
                  className="block w-full py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all text-center font-bold"
                >
                  Make Offer
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No items found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


