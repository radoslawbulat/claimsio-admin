
import { ArrowUpDown } from "lucide-react";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { SortConfig } from "@/hooks/useCasesData";

interface CollectionsTableHeaderProps {
  sortConfig: SortConfig;
  onSort: (column: SortConfig['column']) => void;
}

export const CollectionsTableHeader = ({ sortConfig, onSort }: CollectionsTableHeaderProps) => {
  const handleSort = (column: SortConfig['column']) => (e: React.MouseEvent) => {
    e.preventDefault();
    onSort(column);
  };

  const SortableHeader = ({ column, children }: { column: SortConfig['column'], children: React.ReactNode }) => (
    <TableHead
      onClick={handleSort(column)}
      className="group cursor-pointer"
    >
      {children}
      <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
        sortConfig.column === column ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      }`} />
    </TableHead>
  );

  return (
    <TableHeader>
      <TableRow>
        <SortableHeader column="case_number">ID</SortableHeader>
        <SortableHeader column="debtor">Debtor</SortableHeader>
        <SortableHeader column="debt_remaining">Debt Amount</SortableHeader>
        <SortableHeader column="status">Status</SortableHeader>
        <SortableHeader column="due_date">Due Date</SortableHeader>
        <SortableHeader column="latest_comm">Last Activity</SortableHeader>
      </TableRow>
    </TableHeader>
  );
};
