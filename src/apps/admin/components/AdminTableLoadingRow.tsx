import type { CSSProperties } from "react";
import { cn } from "../../web/components/ui/utils";
import { Skeleton } from "../../web/components/ui/skeleton";

interface AdminTableLoadingRowProps {
  colSpan: number;
  rowCount?: number;
  label?: string;
}

export function AdminTableLoadingRow({
  colSpan,
  rowCount = 5,
  label = "Loading data...",
}: AdminTableLoadingRowProps) {
  const columnTemplate: CSSProperties = {
    gridTemplateColumns: `repeat(${colSpan}, minmax(0, 1fr))`,
  };

  return (
    <>
      {Array.from({ length: rowCount }, (_, rowIndex) => (
        <tr key={rowIndex} className="border-t border-border" aria-hidden="true">
          <td className="px-3 py-3" colSpan={colSpan}>
            {rowIndex === 0 ? <span className="sr-only">{label}</span> : null}
            <div className="grid gap-3" style={columnTemplate}>
              {Array.from({ length: colSpan }, (_, colIndex) => (
                <Skeleton
                  key={colIndex}
                  className={cn("h-4", colIndex === 0 ? "w-11/12" : colIndex === colSpan - 1 ? "w-8/12" : "w-full")}
                />
              ))}
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}
