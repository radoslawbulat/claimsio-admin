
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody } from "@/components/ui/table";
import { CollectionsTableHeader } from './CollectionsTableHeader';
import { CollectionsTableRow } from './CollectionsTableRow';
import { useCasesData, type SortConfig } from '@/hooks/useCasesData';

export const CollectionsTable = () => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' });
  
  const { data: cases, isLoading } = useCasesData(sortConfig);

  const handleSort = (column: SortConfig['column']) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowClick = (caseId: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/case/${caseId}`);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <CollectionsTableHeader sortConfig={sortConfig} onSort={handleSort} />
        <TableBody>
          {cases && cases.length > 0 ? (
            cases.map((caseItem) => (
              <CollectionsTableRow 
                key={caseItem.id}
                caseItem={caseItem}
                onClick={handleRowClick(caseItem.id)}
              />
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-4">
                No cases found
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
