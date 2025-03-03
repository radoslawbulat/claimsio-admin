
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseWithDetails } from "@/types/case";
import { getStatusColor, getPriorityColor } from "@/utils/case-colors";

interface CaseInformationProps {
  caseDetails: CaseWithDetails;
}

export const CaseInformation = ({ caseDetails }: CaseInformationProps) => {
  return (
    <Card>
      <CardHeader className="p-4">
        <CardTitle className="flex items-center justify-between text-base">
          Case Information
          <span className="text-sm font-normal text-muted-foreground">
            {caseDetails.case_number}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <Badge className={getStatusColor(caseDetails.status)}>
              {caseDetails.status.toLowerCase()}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Priority</div>
            <Badge className={getPriorityColor(caseDetails.priority)}>
              {caseDetails.priority.toLowerCase()}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Due Date</div>
            <div className="text-sm">{format(new Date(caseDetails.due_date), 'MMMM do, yyyy')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total Debt Amount</div>
            <div className="text-sm">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: caseDetails.currency,
              }).format(caseDetails.debt_amount / 100)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Remaining Amount</div>
            <div className="text-sm">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: caseDetails.currency,
              }).format(caseDetails.debt_remaining / 100)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Created At</div>
            <div className="text-sm">{format(new Date(caseDetails.created_at), 'MMMM do, yyyy')}</div>
          </div>
        </div>

        {caseDetails.case_description && (
          <div>
            <div className="text-xs text-muted-foreground mb-1">Description</div>
            <div className="text-sm">{caseDetails.case_description}</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
