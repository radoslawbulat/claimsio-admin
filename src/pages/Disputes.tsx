
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, PlusCircle } from "lucide-react";
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

const fetchDisputes = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      debtor:debtors(first_name, last_name)
    `)
    .eq('status', 'SUSPENDED')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const formatDisputeReason = (reason: string | null) => {
  if (!reason) return 'N/A';
  return reason.toLowerCase().replace(/_/g, ' ');
};

const Disputes = () => {
  const navigate = useNavigate();
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes'],
    queryFn: fetchDisputes
  });

  const handleRowClick = (e: React.MouseEvent, caseId: string) => {
    e.preventDefault();
    navigate(`/case/${caseId}`, { state: { from: 'disputes' } });
  };

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

      <div className="bg-white rounded-lg border border-input">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case Number</TableHead>
              <TableHead>Debtor</TableHead>
              <TableHead>Creditor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Reason</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : disputes?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              disputes?.map((dispute) => (
                <TableRow 
                  key={dispute.id}
                  onClick={(e) => handleRowClick(e, dispute.id)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell>{dispute.case_number}</TableCell>
                  <TableCell>
                    {dispute.debtor ? 
                      `${dispute.debtor.first_name} ${dispute.debtor.last_name}` 
                      : 'N/A'}
                  </TableCell>
                  <TableCell>{dispute.creditor_name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: dispute.currency
                    }).format(dispute.debt_amount / 100)}
                  </TableCell>
                  <TableCell>
                    {new Date(dispute.due_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(dispute.created_at).toLocaleDateString()}
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
