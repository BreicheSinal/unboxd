import { Spinner } from "../../web/components/ui/spinner";

interface AdminTableLoadingRowProps {
  colSpan: number;
  label?: string;
}

export function AdminTableLoadingRow({
  colSpan,
  label = "Loading table data",
}: AdminTableLoadingRowProps) {
  return (
    <tr className="border-t border-border">
      <td className="px-3 py-8" colSpan={colSpan}>
        <div className="flex items-center justify-center">
          <Spinner className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </div>
      </td>
    </tr>
  );
}
