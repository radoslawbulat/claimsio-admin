import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowUpDown } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { getStatusColor } from '@/utils/case-colors';

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

type SortConfig = {
  column: 'case_number' | 'debtor' | 'debt_remaining' | 'status' | 'due_date' | 'latest_comm' | null;
  direction: 'asc' | 'desc';
};

const Collections = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState<CaseWithDebtor['status'] | 'ALL' | null>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ column: null, direction: 'asc' });
  
  const { data: cases, isLoading, error } = useQuery({
    queryKey: ['cases', selectedStatus],
    queryFn: () => fetchCasesWithDebtors(selectedStatus),
  });

  const handleRowClick = (caseId: string) => {
    navigate(`/case/${caseId}`);
  };

  const handleSort = (column: SortConfig['column']) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredCases = cases?.filter(caseItem => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      caseItem.case_number.toLowerCase().includes(searchLower) ||
      (caseItem.debtor && 
        (`${caseItem.debtor.first_name} ${caseItem.debtor.last_name}`).toLowerCase().includes(searchLower));
    return searchQuery === '' || matchesSearch;
  });

  const sortedCases = React.useMemo(() => {
    if (!filteredCases || !sortConfig.column) return filteredCases;

    return [...filteredCases].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.column) {
        case 'case_number':
          return a.case_number.localeCompare(b.case_number) * direction;
        case 'debtor':
          const aName = a.debtor ? `${a.debtor.first_name} ${a.debtor.last_name}` : '';
          const bName = b.debtor ? `${b.debtor.first_name} ${b.debtor.last_name}` : '';
          return aName.localeCompare(bName) * direction;
        case 'debt_remaining':
          return (a.debt_remaining - b.debt_remaining) * direction;
        case 'status':
          return a.status.localeCompare(b.status) * direction;
        case 'due_date':
          return (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) * direction;
        case 'latest_comm':
          const aTime = a.latest_comm ? new Date(a.latest_comm.created_at).getTime() : 0;
          const bTime = b.latest_comm ? new Date(b.latest_comm.created_at).getTime() : 0;
          return (aTime - bTime) * direction;
        default:
          return 0;
      }
    });
  }, [filteredCases, sortConfig]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading cases</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Collections</h1>
          <Badge variant="secondary" className="rounded-md">Active</Badge>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search by case ID or debtor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
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
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('case_number')}
                className="cursor-pointer hover:bg-muted/50 group"
              >
                ID
                <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('debtor')}
                className="cursor-pointer hover:bg-muted/50 group"
              >
                Debtor
                <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('debt_remaining')}
                className="cursor-pointer hover:bg-muted/50 group"
              >
                Debt Amount
                <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('status')}
                className="cursor-pointer hover:bg-muted/50 group"
              >
                Status
                <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('due_date')}
                className="cursor-pointer hover:bg-muted/50 group"
              >
                Due Date
                <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('latest_comm')}
                className="cursor-pointer hover:bg-muted/50 group"
              >
                Last Activity
                <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-0 group-hover:opacity-100 transition-opacity" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCases && sortedCases.length > 0 ? (
              sortedCases.map((caseItem) => (
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
                      variant="default"
                      className={getStatusColor(caseItem.status)}
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
    </div>
  );
};

export default Collections;
