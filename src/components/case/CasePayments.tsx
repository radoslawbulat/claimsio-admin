
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment } from "@/types/payment";

const getStatusColor = (status: Payment['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-500 hover:bg-green-500';
    case 'failed':
      return 'bg-red-500 hover:bg-red-500';
    case 'pending':
      return 'bg-yellow-500 hover:bg-yellow-500';
    case 'refunded':
      return 'bg-purple-500 hover:bg-purple-500';
    case 'cancelled':
      return 'bg-gray-500 hover:bg-gray-500';
    default:
      return '';
  }
};

interface CasePaymentsProps {
  payments: Payment[];
}

export const CasePayments = ({ payments }: CasePaymentsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        {payments && payments.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.created_at), 'MMM d, yyyy • h:mm a')}
                  </TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: payment.currency,
                    }).format(payment.amount_received / 100)}
                  </TableCell>
                  <TableCell>
                    {payment.payment_method || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="default"
                      className={getStatusColor(payment.status)}
                    >
                      {payment.status.toLowerCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No payments recorded for this case
          </div>
        )}
      </CardContent>
    </Card>
  );
};
