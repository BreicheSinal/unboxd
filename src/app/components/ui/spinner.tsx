import { cn } from "./utils";

interface SpinnerProps {
  className?: string;
  tone?: "white" | "black";
}

export function Spinner({ className, tone = "white" }: SpinnerProps) {
  const spinnerIconSrc =
    tone === "black" ? "/assets/icons/ICON_BLACK.svg" : "/assets/icons/ICON_WHITE.svg";

  return (
    <img
      src={spinnerIconSrc}
      alt=""
      aria-hidden="true"
      className={cn("h-4 w-4 animate-spin", className)}
    />
  );
}
