import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CaseInformation } from "@/components/case/CaseInformation";
import { DebtorInformation } from "@/components/case/DebtorInformation";
import { CaseActivity } from "@/components/case/CaseActivity";
import { fetchCaseDetails, fetchCaseComms } from "@/utils/case-queries";

const CaseDetails = () => {
  const { id } = useParams();

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

  return (
    <div className="p-6">
      <div className="mb-8">
        <Button variant="ghost" asChild>
          <Link to="/collections" className="flex items-center gap-2">
            <ArrowLeft size={16} />
            Back to Collections
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        <CaseInformation caseDetails={caseDetails} />
        {caseDetails.debtor && (
          <DebtorInformation 
            debtor={caseDetails.debtor} 
            currency={caseDetails.currency}
          />
        )}
        <CaseActivity communications={communications || []} />
      </div>
    </div>
  );
};

export default CaseDetails;
