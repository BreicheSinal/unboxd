import { type ReactNode, useEffect, useRef, useState } from "react";
import { AlertCircle, RefreshCw, Search, type LucideIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../../web/components/ui/alert";
import { Badge } from "../../web/components/ui/badge";
import { Button } from "../../web/components/ui/button";
import { Input } from "../../web/components/ui/input";
import { cn } from "../../web/components/ui/utils";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  count?: number;
  countLabel?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  actions?: ReactNode;
}

export function AdminPageHeader({
  title,
  description,
  count,
  countLabel = "records",
  onRefresh,
  isRefreshing = false,
  actions,
}: AdminPageHeaderProps) {
  const actionControlClass = "h-8 min-w-[110px] justify-center";
  const singularizeCountLabel = (label: string) => {
    const [firstWord, ...rest] = label.trim().split(/\s+/);
    const singularFirstWord = firstWord.replace(/s$/i, "");
    return [singularFirstWord, ...rest].join(" ");
  };
  const normalizedCountLabel =
    typeof count === "number" && count === 1 ? singularizeCountLabel(countLabel) : countLabel;

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-[0.05em]">{title}</h2>
        <p className="mt-1 text-sm text-[var(--brand-light-purple)]/72">{description}</p>
      </div>
      <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:w-auto">
        {typeof count === "number" ? (
          <Badge
            variant="outline"
            className={cn(
              "border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/70 px-2.5 text-xs text-[var(--brand-light-purple)]",
              actionControlClass,
            )}
          >
            {`${count} ${normalizedCountLabel}`}
          </Badge>
        ) : null}
        {actions}
        {onRefresh ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={actionControlClass}
            disabled={isRefreshing}
            onClick={onRefresh}
          >
            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            Refresh
          </Button>
        ) : null}
      </div>
    </header>
  );
}

interface AdminErrorAlertProps {
  message: string;
}

export function AdminErrorAlert({ message }: AdminErrorAlertProps) {
  return (
    <Alert
      variant="destructive"
      className="mt-4 border-[var(--brand-vivid-red)]/35 bg-[var(--brand-vivid-red)]/12 text-[var(--brand-light-purple)]"
    >
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Request failed</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  rightSlot?: ReactNode;
}

export function AdminSearch({ value, onChange, placeholder, rightSlot }: AdminSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isExpanded, setIsExpanded] = useState(() => value.trim().length > 0);
  const hasValue = value.trim().length > 0;
  const focusSearchInput = () => {
    const input = inputRef.current;
    if (!input) return;
    input.focus({ preventScroll: true });
    const cursorPosition = input.value.length;
    input.setSelectionRange(cursorPosition, cursorPosition);
  };

  useEffect(() => {
    if (hasValue) {
      setIsExpanded(true);
    }
  }, [hasValue]);

  useEffect(() => {
    if (!isExpanded) return;
    focusSearchInput();
    const timer = window.setTimeout(focusSearchInput, 0);
    return () => window.clearTimeout(timer);
  }, [isExpanded]);

  const openSearch = () => {
    setIsExpanded(true);
    focusSearchInput();
    requestAnimationFrame(focusSearchInput);
    window.setTimeout(focusSearchInput, 30);
  };

  return (
    <div className="mt-4 ml-auto flex max-w-full items-center justify-end gap-2">
      <div
        className={cn(
          "relative w-[min(18rem,70vw)] origin-right overflow-hidden transition-[width] duration-200 ease-out sm:max-w-[20rem]",
          isExpanded || hasValue ? "sm:w-80" : "sm:w-36",
        )}
        onClick={(event) => {
          if (!(event.target instanceof HTMLElement) || event.target.tagName !== "INPUT") {
            openSearch();
          }
        }}
      >
        <Search className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          ref={inputRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onFocus={() => setIsExpanded(true)}
          onBlur={() => {
            if (!hasValue) {
              setIsExpanded(false);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape" && !hasValue) {
              setIsExpanded(false);
            }
          }}
          placeholder={placeholder}
          className={cn(
            "pl-9 transition-opacity duration-150",
            isExpanded || hasValue ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-label={placeholder}
        />
        {!isExpanded && !hasValue ? (
          <Button
            type="button"
            variant="outline"
            className="absolute inset-0 h-full w-full justify-start gap-2 px-3"
            onPointerDown={(event) => {
              event.preventDefault();
              openSearch();
            }}
            onClick={openSearch}
            aria-label={placeholder}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs text-muted-foreground">Search</span>
          </Button>
        ) : null}
      </div>
      {rightSlot}
    </div>
  );
}

interface AdminStatusBadgeProps {
  value: string | null | undefined;
}

const toneByKeyword: Array<{ test: RegExp; className: string }> = [
  { test: /(completed|approved|paid|reconciled|enabled|active)/i, className: "text-emerald-300" },
  { test: /(pending|queued|review|shipped|accepted)/i, className: "text-amber-300" },
  { test: /(rejected|failed|cancelled|canceled|disabled|refunded)/i, className: "text-[var(--brand-vivid-red)]" },
];

export function AdminStatusBadge({ value }: AdminStatusBadgeProps) {
  const normalized = String(value ?? "-").replaceAll("_", " ");
  const tone = toneByKeyword.find(({ test }) => test.test(normalized));

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/65 capitalize text-[var(--brand-light-purple)]/72",
        tone?.className,
      )}
    >
      {normalized}
    </Badge>
  );
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

interface AdminEmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  className?: string;
}

export function AdminEmptyState({ icon: Icon, title, subtitle, className }: AdminEmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 py-8 text-center", className)}>
      <div className="rounded-full border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/65 p-2.5">
        <Icon className="h-5 w-5 text-[var(--brand-light-purple)]/70" />
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="max-w-md text-xs text-[var(--brand-light-purple)]/70">{subtitle}</p>
    </div>
  );
}
