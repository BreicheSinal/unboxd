import { useState } from "react";
import { Search, Filter, LayoutGrid, List, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

interface Shirt {
  id: string;
  team: string;
  league: string;
  image: string;
  status: "Owned" | "Trading" | "Sold";
  isDuplicate?: boolean;
}

export function ClosetPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "owned" | "trading" | "sold" | "duplicate">("all");

  const shirts: Shirt[] = [
    {
      id: "1",
      team: "Real Madrid",
      league: "La Liga",
      image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      status: "Owned",
    },
    {
      id: "2",
      team: "Barcelona",
      league: "La Liga",
      image: "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      status: "Trading",
    },
    {
      id: "3",
      team: "Manchester United",
      league: "Premier League",
      image: "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      status: "Owned",
      isDuplicate: true,
    },
    {
      id: "4",
      team: "Bayern Munich",
      league: "Bundesliga",
      image: "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      status: "Sold",
    },
    {
      id: "5",
      team: "Liverpool",
      league: "Premier League",
      image: "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
      status: "Owned",
    },
    {
      id: "6",
      team: "PSG",
      league: "Ligue 1",
      image: "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
      status: "Trading",
    },
  ];

  const filteredShirts = shirts.filter((shirt) => {
    const matchesSearch =
      shirt.team.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shirt.league.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "duplicate" ? Boolean(shirt.isDuplicate) : shirt.status.toLowerCase() === filterStatus);
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Owned":
        return "bg-green-500/10 text-green-500 border-green-500/30";
      case "Trading":
        return "bg-red-500/10 text-red-500 border-red-500/30";
      case "Sold":
        return "bg-gray-500/10 text-gray-500 border-gray-500/30";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">My Closet</h1>
          <p className="text-muted-foreground">
            Your collection of {shirts.length} mystery shirts
          </p>
        </div>

        {/* Controls */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by team or league..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-full pl-10 pr-4 bg-accent rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Filter */}
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

            {/* View Mode */}
            <div className="flex gap-2 bg-accent rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-card shadow"
                    : "hover:bg-card/50"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-card shadow"
                    : "hover:bg-card/50"
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredShirts.map((shirt) => (
              <div
                key={shirt.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-all group"
              >
                <div className="relative aspect-square">
                  <img
                    src={shirt.image}
                    alt={shirt.team}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {shirt.status === "Owned" ? (
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
                        shirt.status
                      )}`}
                    >
                      {shirt.status}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-bold mb-1">{shirt.team}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {shirt.league}
                  </p>
                  {shirt.status === "Owned" && (
                    <button className="w-full py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Add to Trade
                    </button>
                  )}
                  {shirt.status === "Trading" && (
                    <button className="w-full py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors">
                      View Trade Offers
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="space-y-4">
            {filteredShirts.map((shirt) => (
              <div
                key={shirt.id}
                className="bg-card border border-border rounded-xl p-6 flex items-center gap-6 hover:shadow-lg transition-shadow"
              >
                <img
                  src={shirt.image}
                  alt={shirt.team}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{shirt.team}</h3>
                      <p className="text-sm text-muted-foreground">{shirt.league}</p>
                    </div>
                    <div className="flex gap-2">
                      {shirt.status !== "Owned" && (
                        <div
                          className={`inline-flex rounded-md px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(
                            shirt.status
                          )}`}
                        >
                          {shirt.status}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {shirt.status === "Owned" && (
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex flex-wrap justify-end gap-2">
                      <span className="inline-flex rounded-md border border-green-500/30 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-green-400">
                        Tradable
                      </span>
                      {shirt.isDuplicate && (
                        <span className="inline-flex rounded-md border border-yellow-500/30 bg-yellow-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-yellow-400">
                          Duplicate
                        </span>
                      )}
                    </div>
                    <button className="px-6 py-2 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Add to Trade
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredShirts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">
              No shirts found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


