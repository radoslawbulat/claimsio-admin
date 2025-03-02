
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type CaseWithDetails = {
  id: string;
  case_number: string;
  debt_amount: number;
  debt_remaining: number;
  status: "ACTIVE" | "CLOSED" | "SUSPENDED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  due_date: string;
  created_at: string;
  currency: string;
  creditor_name: string;
  case_description: string | null;
  debtor: {
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string | null;
    language: string | null;
    status: string | null;
    total_debt_amount: number;
  } | null;
}

const fetchCaseDetails = async (caseId: string) => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      debtor:debtors(*)
    `)
    .eq('id', caseId)
    .single();

  if (error) throw error;
  return data as CaseWithDetails;
};

const getStatusColor = (status: CaseWithDetails['status']) => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-blue-500 hover:bg-blue-500';
    case 'CLOSED':
      return 'bg-gray-500 hover:bg-gray-500';
    case 'SUSPENDED':
      return 'bg-orange-400 hover:bg-orange-400';
  }
};

const getPriorityColor = (priority: CaseWithDetails['priority']) => {
  switch (priority) {
    case 'LOW':
      return 'bg-green-500 hover:bg-green-500';
    case 'MEDIUM':
      return 'bg-yellow-500 hover:bg-yellow-500';
    case 'HIGH':
      return 'bg-orange-500 hover:bg-orange-500';
    case 'URGENT':
      return 'bg-red-500 hover:bg-red-500';
  }
};

const CaseDetails = () => {
  const { id } = useParams();

  const { data: caseDetails, isLoading, error } = useQuery({
    queryKey: ['case', id],
    queryFn: () => fetchCaseDetails(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error || !caseDetails) {
    return <div className="p-6">Error loading case details</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link to="/collections" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Collections
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">
          Case Details: {caseDetails.case_number}
        </h1>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Case Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <Badge className={getStatusColor(caseDetails.status)}>
                  {caseDetails.status.toLowerCase()}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Priority</div>
                <Badge className={getPriorityColor(caseDetails.priority)}>
                  {caseDetails.priority.toLowerCase()}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Due Date</div>
                <div>{format(new Date(caseDetails.due_date), 'MMMM do, yyyy')}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Total Debt Amount</div>
                <div>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: caseDetails.currency,
                  }).format(caseDetails.debt_amount / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Remaining Amount</div>
                <div>
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: caseDetails.currency,
                  }).format(caseDetails.debt_remaining / 100)}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Created At</div>
                <div>{format(new Date(caseDetails.created_at), 'MMMM do, yyyy')}</div>
              </div>
            </div>

            {caseDetails.case_description && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">Description</div>
                <div>{caseDetails.case_description}</div>
              </div>
            )}
          </CardContent>
        </Card>

        {caseDetails.debtor && (
          <Card>
            <CardHeader>
              <CardTitle>Debtor Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Name</div>
                  <div>{`${caseDetails.debtor.first_name} ${caseDetails.debtor.last_name}`}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Email</div>
                  <div>{caseDetails.debtor.email || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Phone</div>
                  <div>{caseDetails.debtor.phone_number || 'Not specified'}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge variant="outline">
                    {caseDetails.debtor.status || 'Not specified'}
                  </Badge>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Language</div>
                  <div>{caseDetails.debtor.language || 'Not specified'}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Total Debt</div>
                  <div>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: caseDetails.currency,
                    }).format(caseDetails.debtor.total_debt_amount / 100)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CaseDetails;
