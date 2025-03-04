
import React from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Hash, User, Clock, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CaseInformation } from "@/components/case/CaseInformation";
import { DebtorInformation } from "@/components/case/DebtorInformation";
import { CaseActivity } from "@/components/case/CaseActivity";
import { fetchCaseDetails, fetchCaseComms } from "@/utils/case-queries";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { getStatusColor } from "@/utils/case-colors";

const CaseDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const fromRoute = location.state?.from || 'collections';

  const getBackRoute = () => {
    return fromRoute === 'disputes' ? '/disputes' : '/collections';
  };

  const { data: caseDetails, isLoading: isLoadingCase, error: caseError } = useQuery({
    queryKey: ['case', id],
    queryFn: () => fetchCaseDetails(id as string),
    enabled: !!id,
  });

  const { data: communications, isLoading: isLoadingComms } = useQuery({
    queryKey: ['comms', id],
    queryFn: () => fetchCaseComms(id as string),
    enabled: !!id,
  });

  if (isLoadingCase || isLoadingComms) {
    return <div className="p-6">Loading...</div>;
  }

  if (caseError || !caseDetails) {
    return <div className="p-6">Error loading case details</div>;
  }

  const lastActivity = communications && communications.length > 0
    ? format(new Date(communications[0].created_at), 'MMM d, yyyy')
    : 'No activity';

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" asChild>
            <Link to={getBackRoute()} className="flex items-center gap-2">
              <ArrowLeft size={16} />
              Back to {fromRoute === 'disputes' ? 'Disputes' : 'Collections'}
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <Hash className="text-muted-foreground" size={20} />
          <div>
            <div className="text-sm text-muted-foreground">Case ID</div>
            <div className="font-medium">{caseDetails.case_number}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <User className="text-muted-foreground" size={20} />
          <div>
            <div className="text-sm text-muted-foreground">Debtor</div>
            <div className="font-medium">
              {caseDetails.debtor 
                ? `${caseDetails.debtor.first_name} ${caseDetails.debtor.last_name}`
                : 'N/A'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="text-muted-foreground" size={20} />
          <div>
            <div className="text-sm text-muted-foreground">Last Activity</div>
            <div className="font-medium">{lastActivity}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Shield className="text-muted-foreground" size={20} />
          <div>
            <div className="text-sm text-muted-foreground">Status</div>
            <Badge className={getStatusColor(caseDetails.status)}>
              {caseDetails.status.toLowerCase()}
            </Badge>
          </div>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="w-full border-b rounded-none h-12 bg-background">
          <TabsTrigger 
            value="details" 
            className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex-1"
          >
            Case Details
          </TabsTrigger>
          <TabsTrigger 
            value="communication" 
            className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex-1"
          >
            Communication
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none flex-1"
          >
            Activity
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid gap-6">
            <CaseInformation caseDetails={caseDetails} />
            {caseDetails.debtor && (
              <DebtorInformation 
                debtor={caseDetails.debtor} 
                currency={caseDetails.currency}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="communication" className="mt-6">
          <CaseActivity communications={communications || []} />
        </TabsContent>

        <TabsContent value="activity" className="mt-6">
          <div className="text-muted-foreground text-center py-8">
            Activity history will be implemented soon
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CaseDetails;
