import { ArrowUpDown, Filter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface MarketplaceToolsBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filterSize: string;
  onFilterSizeChange: (value: string) => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
}

export function MarketplaceToolsBar({
  searchQuery,
  onSearchQueryChange,
  filterSize,
  onFilterSizeChange,
  sortBy,
  onSortByChange,
}: MarketplaceToolsBarProps) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_auto_auto] lg:gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by team or league..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="h-9 min-h-9 max-h-9 w-full rounded-lg border border-border bg-accent pl-10 pr-4 leading-none focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filterSize} onValueChange={onFilterSizeChange}>
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
          <Select value={sortBy} onValueChange={onSortByChange}>
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
  );
}
