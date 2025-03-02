
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type CaseWithDebtor = {
  id: string;
  case_number: string;
  debt_remaining: number;
  status: "ACTIVE" | "CLOSED" | "SUSPENDED";
  due_date: string;
  currency: string;
  debtor: {
    first_name: string;
    last_name: string;
  } | null;
  latest_comm: {
    created_at: string;
  } | null;
}

const fetchCasesWithDebtors = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      id,
      case_number,
      debt_remaining,
      status,
      due_date,
      currency,
      debtor:debtors(first_name, last_name),
      latest_comm:comms(created_at)
    `)
    .order('created_at', { ascending: false })
    .limit(1);

  if (error) throw error;
  
  // Transform the data to match our type
  const transformedData = data.map(item => ({
    ...item,
    latest_comm: item.latest_comm && item.latest_comm.length > 0
      ? { created_at: item.latest_comm[0].created_at }
      : null
  }));

  return transformedData as CaseWithDebtor[];
};

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

const Collections = () => {
  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['cases'],
    queryFn: fetchCasesWithDebtors,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading cases</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Collections</h1>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Debtor</TableHead>
              <TableHead>Debt Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases?.map((caseItem) => (
              <TableRow key={caseItem.id}>
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
                    ? format(new Date(caseItem.latest_comm.created_at), 'MMM d, yyyy')
                    : 'No activity'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Collections;
