import { Spinner } from "./spinner";
import { cn } from "./utils";

interface LoadingScreenProps {
  message?: string;
  className?: string;
  spinnerClassName?: string;
  fullScreen?: boolean;
}

export function LoadingScreen({
  message = "Loading",
  className,
  spinnerClassName,
  fullScreen = false,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "text-center flex flex-col items-center gap-3",
        fullScreen ? "min-h-screen justify-center" : "py-20",
        className,
      )}
    >
      <Spinner className={cn("h-8 w-8 text-red-500", spinnerClassName)} />
      <p className="loading-shimmer-text text-lg font-medium">
        {message}
      </p>
    </div>
  );
}
