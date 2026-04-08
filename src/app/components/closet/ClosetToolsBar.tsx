import { Filter, LayoutGrid, List, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type ClosetFilterStatus = "all" | "owned" | "trading" | "sold" | "duplicate";
type ClosetViewMode = "grid" | "list";

interface ClosetToolsBarProps {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filterStatus: ClosetFilterStatus;
  onFilterStatusChange: (value: ClosetFilterStatus) => void;
  viewMode: ClosetViewMode;
  onViewModeChange: (value: ClosetViewMode) => void;
}

export function ClosetToolsBar({
  searchQuery,
  onSearchQueryChange,
  filterStatus,
  onFilterStatusChange,
  viewMode,
  onViewModeChange,
}: ClosetToolsBarProps) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-4 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:gap-4">
        <div className="relative w-full flex-1">
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
          <Select value={filterStatus} onValueChange={(value) => onFilterStatusChange(value as ClosetFilterStatus)}>
            <SelectTrigger className="h-9 min-h-9 max-h-9 min-w-36 rounded-lg border border-border bg-card shadow-sm data-[state=open]:border-red-500 data-[state=open]:shadow-xl focus-visible:border-red-500 focus-visible:ring-0">
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

        <div className="flex h-9 items-center gap-1 self-end overflow-hidden rounded-lg border border-border bg-accent p-0 md:self-auto">
          <button
            onClick={() => onViewModeChange("grid")}
            className={`h-full min-h-full w-9 min-w-9 rounded-none ${
              viewMode === "grid" ? "bg-card shadow" : "hover:bg-card/50"
            }`}
            aria-label="Grid view"
          >
            <LayoutGrid className="mx-auto h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={`h-full min-h-full w-9 min-w-9 rounded-none ${
              viewMode === "list" ? "bg-card shadow" : "hover:bg-card/50"
            }`}
            aria-label="List view"
          >
            <List className="mx-auto h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
