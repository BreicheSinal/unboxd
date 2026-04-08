import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "./utils";

interface SpinnerProps {
  className?: string;
}

export function Spinner({ className }: SpinnerProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const spinnerIconSrc =
    mounted && resolvedTheme === "dark" ? "/assets/icons/ICON_WHITE.svg" : "/assets/icons/ICON_BLACK.svg";

  return (
    <img src={spinnerIconSrc} alt="" aria-hidden="true" className={cn("h-4 w-4 animate-spin", className)} />
  );
}
