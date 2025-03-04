import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const fetchDisputes = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const Disputes = () => {
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['disputes'],
    queryFn: fetchDisputes
  });

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-semibold text-gray-900">Disputes</h1>
          </div>
          <Badge variant="secondary" className="rounded-md">Active</Badge>
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
              <TableHead>Creditor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Loading...
                </TableCell>
              </TableRow>
            ) : disputes?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  No disputes found
                </TableCell>
              </TableRow>
            ) : (
              disputes?.map((dispute) => (
                <TableRow key={dispute.id}>
                  <TableCell>{dispute.case_number}</TableCell>
                  <TableCell>{dispute.creditor_name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: dispute.currency
                    }).format(dispute.debt_amount / 100)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                      {dispute.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(dispute.created_at).toLocaleDateString()}
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
