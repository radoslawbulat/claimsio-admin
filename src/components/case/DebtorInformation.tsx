
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
      <CardHeader className="p-4">
        <CardTitle className="text-base">Debtor Information</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Name</div>
            <div className="text-sm">{`${debtor.first_name} ${debtor.last_name}`}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Email</div>
            <div className="text-sm">{debtor.email || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Phone</div>
            <div className="text-sm">{debtor.phone_number || 'Not specified'}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <Badge variant="outline" className="text-xs">
              {debtor.status || 'Not specified'}
            </Badge>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Language</div>
            <div className="text-sm">{debtor.language || 'Not specified'}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total Debt</div>
            <div className="text-sm">
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
