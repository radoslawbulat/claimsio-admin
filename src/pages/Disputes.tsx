import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, PlusCircle, ArrowUpDown, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";

type SortConfig = {
  column: 'case_number' | 'debtor' | 'debt_amount' | 'status' | 'due_date' | 'latest_comm' | null;
  direction: 'asc' | 'desc';
};

const fetchDisputes = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      debtor:debtors(first_name, last_name),
      latest_comm:comms(created_at)
    `)
    .eq('status', 'SUSPENDED')
    .order('created_at', { ascending: false });

  if (error) throw error;

  const transformedData = data.map(item => ({
    ...item,
    latest_comm: item.latest_comm && item.latest_comm.length > 0
      ? { created_at: item.latest_comm.sort((a: { created_at: string }, b: { created_at: string }) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )[0].created_at }
      : null
  }));

  return transformedData;
};

const formatDisputeReason = (reason: string | null) => {
  if (!reason) return 'N/A';
  return reason.toLowerCase().replace(/_/g, ' ');
};

const Disputes = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    column: null,
    direction: 'asc'
  });

  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes'],
    queryFn: fetchDisputes
  });

  const handleRowClick = (e: React.MouseEvent, caseId: string) => {
    e.preventDefault();
    navigate(`/case/${caseId}`, { state: { from: 'disputes' } });
  };

  const handleSort = (column: SortConfig['column']) => {
    setSortConfig(current => ({
      column,
      direction: current.column === column && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredDisputes = disputes?.filter(dispute => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      dispute.case_number.toLowerCase().includes(searchLower) ||
      (dispute.debtor && 
        (`${dispute.debtor.first_name} ${dispute.debtor.last_name}`).toLowerCase().includes(searchLower));
    return searchQuery === '' || matchesSearch;
  });

  const sortedDisputes = React.useMemo(() => {
    if (!filteredDisputes || !sortConfig.column) return filteredDisputes;

    return [...filteredDisputes].sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.column) {
        case 'case_number':
          return a.case_number.localeCompare(b.case_number) * direction;
        case 'debtor':
          const aName = a.debtor ? `${a.debtor.first_name} ${a.debtor.last_name}` : '';
          const bName = b.debtor ? `${b.debtor.first_name} ${b.debtor.last_name}` : '';
          return aName.localeCompare(bName) * direction;
        case 'debt_amount':
          return (a.debt_amount - b.debt_amount) * direction;
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
  }, [filteredDisputes, sortConfig]);

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-semibold text-gray-900">Disputes</h1>
        </div>
        <Button className="gap-2">
          <PlusCircle size={20} />
          New Dispute
        </Button>
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
      </div>

      <div className="bg-white rounded-lg border border-input">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                onClick={() => handleSort('case_number')}
                className="cursor-pointer group"
              >
                ID
                <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                  sortConfig.column === 'case_number' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('debtor')}
                className="cursor-pointer group"
              >
                Debtor
                <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                  sortConfig.column === 'debtor' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('debt_amount')}
                className="cursor-pointer group"
              >
                Debt Amount
                <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                  sortConfig.column === 'debt_amount' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('status')}
                className="cursor-pointer group"
              >
                Status
                <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                  sortConfig.column === 'status' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('due_date')}
                className="cursor-pointer group"
              >
                Due Date
                <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                  sortConfig.column === 'due_date' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </TableHead>
              <TableHead 
                onClick={() => handleSort('latest_comm')}
                className="cursor-pointer group"
              >
                Last Activity
                <ArrowUpDown className={`ml-2 h-4 w-4 inline transition-opacity ${
                  sortConfig.column === 'latest_comm' ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                }`} />
              </TableHead>
              <TableHead>Dispute Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : sortedDisputes?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              sortedDisputes?.map((dispute) => (
                <TableRow 
                  key={dispute.id}
                  onClick={(e) => handleRowClick(e, dispute.id)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell className="font-medium">{dispute.case_number}</TableCell>
                  <TableCell>
                    {dispute.debtor ? 
                      `${dispute.debtor.first_name} ${dispute.debtor.last_name}` 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: dispute.currency
                    }).format(dispute.debt_amount / 100)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="destructive" className="bg-orange-400 hover:bg-orange-400">
                      {dispute.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(dispute.due_date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {dispute.latest_comm?.created_at 
                      ? format(new Date(dispute.latest_comm.created_at), 'MMM d, yyyy, hh:mm:ss a')
                      : 'No activity'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {formatDisputeReason(dispute.dispute_reason)}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Disputes;
