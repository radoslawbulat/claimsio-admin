
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { ArrowUpDown } from "lucide-react";
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

const fetchCasesWithDebtors = async () => {
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
    .order('created_at', { ascending: false })
    .limit(5);  // Only fetch the 5 most recent cases for the dashboard

  const { data, error } = await query;

  if (error) throw error;
  
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

export const CollectionsTable = () => {
  const navigate = useNavigate();
  
  const { data: cases, isLoading } = useQuery({
    queryKey: ['dashboard-cases'],
    queryFn: fetchCasesWithDebtors,
  });

  const handleRowClick = (caseId: string) => {
    navigate(`/case/${caseId}`);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="group">
              ID
              <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </TableHead>
            <TableHead className="group">
              Debtor
              <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </TableHead>
            <TableHead className="group">
              Debt Amount
              <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </TableHead>
            <TableHead className="group">
              Status
              <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </TableHead>
            <TableHead className="group">
              Due Date
              <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </TableHead>
            <TableHead className="group">
              Last Activity
              <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases && cases.length > 0 ? (
            cases.map((caseItem) => (
              <TableRow 
                key={caseItem.id}
                onClick={() => handleRowClick(caseItem.id)}
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
  );
};
