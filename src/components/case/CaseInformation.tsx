
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
  );
};
