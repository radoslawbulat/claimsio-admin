
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";

async function fetchPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*, cases(case_number, creditor_name)')
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) throw error;
  return data;
}

const getStatusColor = (status: string) => {
  const colors = {
    completed: "text-green-600 bg-green-50",
    pending: "text-yellow-600 bg-yellow-50",
    failed: "text-red-600 bg-red-50",
    cancelled: "text-gray-600 bg-gray-50",
    refunded: "text-purple-600 bg-purple-50"
  };
  return colors[status as keyof typeof colors] || colors.pending;
};

export const PaymentsActivity = () => {
  const { data: payments, isLoading } = useQuery({
    queryKey: ['dashboard-payments'],
    queryFn: fetchPayments
  });

  return (
    <Card className="border-none shadow-md bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Latest activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Case</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : payments?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4">
                    No payments found
                  </TableCell>
                </TableRow>
              ) : (
                payments?.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      <div className="text-sm">
                        <div className="font-medium">{payment.cases?.creditor_name}</div>
                        <div className="text-xs text-muted-foreground">
                          {payment.cases?.case_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatCurrency(payment.amount_received, payment.currency)}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                        {payment.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(payment.created_at), 'dd MMM yyyy')}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
