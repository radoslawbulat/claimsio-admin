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

type SortConfig = {
  column: 'case_number' | 'debtor' | 'debt_remaining' | 'status' | 'due_date' | 'latest_comm' | null;
  direction: 'asc' | 'desc';
};

const fetchCasesWithDebtors = async (sortConfig: SortConfig) => {
  console.log('Fetching cases with sort config:', sortConfig);

  // First, get cases joined with debtors
  const { data: casesData, error: casesError } = await supabase
    .from('cases')
    .select(`
      id,
      case_number,
      debt_remaining,
      status,
      due_date,
      currency,
      debtor:debtors(first_name, last_name)
    `)
    .limit(5)
    .order(sortConfig.column || 'created_at', { 
      ascending: sortConfig.direction === 'asc',
      nullsFirst: false 
    });

  if (casesError) {
    console.error('Error fetching cases:', casesError);
    throw casesError;
  }

  console.log('Cases data:', casesData);

  if (!casesData || casesData.length === 0) {
    console.log('No cases found');
    return [];
  }

  // For each case, fetch the latest communication
  const casesWithComms = await Promise.all(
    casesData.map(async (caseItem) => {
      const { data: commsData, error: commsError } = await supabase
        .from('comms')
        .select('created_at')
        .eq('case_id', caseItem.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (commsError && commsError.code !== 'PGRST116') { // Ignore "No rows returned" error
        console.error('Error fetching communications:', commsError);
      }

      return {
        ...caseItem,
        latest_comm: commsData ? { created_at: commsData.created_at } : null
      };
    })
  );

  // Sort by complex fields if needed
  if (sortConfig.column === 'debtor' || sortConfig.column === 'latest_comm') {
    casesWithComms.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      if (sortConfig.column === 'debtor') {
        const aName = a.debtor ? `${a.debtor.first_name} ${a.debtor.last_name}` : '';
        const bName = b.debtor ? `${b.debtor.first_name} ${b.debtor.last_name}` : '';
        return aName.localeCompare(bName) * direction;
      }

      if (sortConfig.column === 'latest_comm') {
        const aTime = a.latest_comm ? new Date(a.latest_comm.created_at).getTime() : 0;
        const bTime = b.latest_comm ? new Date(b.latest_comm.created_at).getTime() : 0;
        return (aTime - bTime) * direction;
      }

      return 0;
    });
  }

  console.log('Final data:', casesWithComms);
  return casesWithComms as CaseWithDebtor[];
};

export const CollectionsTable = () => {
  const navigate = useNavigate();
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' });
  
  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['dashboard-cases', sortConfig],
    queryFn: () => fetchCasesWithDebtors(sortConfig),
  });

  console.log('Query result:', { cases, isLoading, error });

  const handleSort = (column: SortConfig['column']) => {
    // Prevent default behavior which might cause scrolling
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleRowClick = (e: React.MouseEvent, caseId: string) => {
    // Prevent event bubbling
    e.preventDefault();
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
            <TableHead 
              onClick={(e) => {
                e.preventDefault();
                handleSort('case_number');
              }}
              className="group cursor-pointer"
            >
              ID
              <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                sortConfig.column === 'case_number' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </TableHead>
            <TableHead 
              onClick={(e) => {
                e.preventDefault();
                handleSort('debtor');
              }}
              className="group cursor-pointer"
            >
              Debtor
              <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                sortConfig.column === 'debtor' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </TableHead>
            <TableHead 
              onClick={(e) => {
                e.preventDefault();
                handleSort('debt_remaining');
              }}
              className="group cursor-pointer"
            >
              Debt Amount
              <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                sortConfig.column === 'debt_remaining' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </TableHead>
            <TableHead 
              onClick={(e) => {
                e.preventDefault();
                handleSort('status');
              }}
              className="group cursor-pointer"
            >
              Status
              <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                sortConfig.column === 'status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </TableHead>
            <TableHead 
              onClick={(e) => {
                e.preventDefault();
                handleSort('due_date');
              }}
              className="group cursor-pointer"
            >
              Due Date
              <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                sortConfig.column === 'due_date' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </TableHead>
            <TableHead 
              onClick={(e) => {
                e.preventDefault();
                handleSort('latest_comm');
              }}
              className="group cursor-pointer"
            >
              Last Activity
              <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                sortConfig.column === 'latest_comm' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`} />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases && cases.length > 0 ? (
            cases.map((caseItem) => (
              <TableRow 
                key={caseItem.id}
                onClick={(e) => handleRowClick(e, caseItem.id)}
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
