import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const fetchCasesWithDebtors = async (status: CaseWithDebtor['status'] | 'ALL' | null) => {
  let query = supabase
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
    .order('created_at', { ascending: false });

  if (status && status !== 'ALL') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) throw error;
  
  // Transform the data to match our type, properly handling latest communication
  const transformedData = data.map(item => ({
    ...item,
    latest_comm: item.latest_comm && item.latest_comm.length > 0
      ? { created_at: item.latest_comm.sort((a: { created_at: string }, b: { created_at: string }) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0].created_at }
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
  const [selectedStatus, setSelectedStatus] = useState<CaseWithDebtor['status'] | 'ALL' | null>('ALL');
  
  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['cases', selectedStatus],
    queryFn: () => fetchCasesWithDebtors(selectedStatus),
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading cases</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Collections</h1>
        <Select
          value={selectedStatus || undefined}
          onValueChange={(value) => setSelectedStatus(value as typeof selectedStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="CLOSED">Closed</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>
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
            {cases && cases.length > 0 ? (
              cases.map((caseItem) => (
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No cases found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Collections;
