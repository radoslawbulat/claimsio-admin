
import { format } from 'date-fns';
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { CaseWithDebtor } from '@/types/case';

const getStatusStyle = (status: CaseWithDebtor['status']) => {
  switch (status) {
    case 'ACTIVE':
      return { variant: 'default' as const, className: 'bg-blue-500 hover:bg-blue-500' };
    case 'CLOSED':
      return { variant: 'secondary' as const, className: 'bg-gray-500 hover:bg-gray-500' };
    case 'SUSPENDED':
      return { variant: 'destructive' as const, className: 'bg-orange-400 hover:bg-orange-400' };
  }
};

interface CollectionsTableRowProps {
  caseItem: CaseWithDebtor;
  onClick: (e: React.MouseEvent) => void;
}

export const CollectionsTableRow = ({ caseItem, onClick }: CollectionsTableRowProps) => {
  return (
    <TableRow 
      onClick={onClick}
      className="cursor-pointer hover:bg-muted"
    >
      <TableCell className="font-medium">{caseItem.case_number}</TableCell>
      <TableCell>
        {caseItem.debtor 
          ? `${caseItem.debtor.first_name} ${caseItem.debtor.last_name}`
          : 'N/A'}
      </TableCell>
      <TableCell>
        {new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: caseItem.currency,
        }).format(caseItem.debt_remaining / 100)}
      </TableCell>
      <TableCell>
        <Badge 
          {...getStatusStyle(caseItem.status)}
        >
          {caseItem.status.toLowerCase()}
        </Badge>
      </TableCell>
      <TableCell>
        {format(new Date(caseItem.due_date), 'MMM d, yyyy')}
      </TableCell>
      <TableCell>
        {caseItem.latest_comm?.created_at 
          ? format(new Date(caseItem.latest_comm.created_at), 'MMM d, yyyy, hh:mm:ss a')
          : 'No activity'}
      </TableCell>
    </TableRow>
  );
};
