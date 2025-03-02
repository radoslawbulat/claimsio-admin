
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CaseWithDetails } from "@/types/case";

interface DebtorInformationProps {
  debtor: NonNullable<CaseWithDetails['debtor']>;
  currency: string;
}

export const DebtorInformation = ({ debtor, currency }: DebtorInformationProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Debtor Information</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Name</div>
            <div>{`${debtor.first_name} ${debtor.last_name}`}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Email</div>
            <div>{debtor.email || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Phone</div>
            <div>{debtor.phone_number || 'Not specified'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Status</div>
            <Badge variant="outline">
              {debtor.status || 'Not specified'}
            </Badge>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Language</div>
            <div>{debtor.language || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground mb-1">Total Debt</div>
            <div>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: currency,
              }).format(debtor.total_debt_amount / 100)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
