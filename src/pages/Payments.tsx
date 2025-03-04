
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { fetchPayments } from '@/utils/payment-queries';
import { CreditCard } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'failed':
      return 'bg-red-100 text-red-800';
    case 'refunded':
      return 'bg-purple-100 text-purple-800';
    case 'cancelled':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Assuming amount is in cents
};

const Payments = () => {
  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              <CardTitle>Payments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">Loading payments...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    console.error('Error in payments component:', error);
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              <CardTitle>Payments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4 text-red-600">
              Error loading payments: {error.message}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CreditCard className="h-6 w-6" />
              <CardTitle>Payments</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">No payments found</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-6 w-6" />
            <CardTitle>Payments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Case</TableHead>
                <TableHead>Debtor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    {format(new Date(payment.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(payment.amount_received, payment.currency)}
                  </TableCell>
                  <TableCell>
                    {payment.cases ? (
                      <Link 
                        to={`/case/${payment.case_id}`}
                        state={{ from: 'payments' }}
                        className="text-primary hover:underline"
                      >
                        {payment.cases.case_number}
                      </Link>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    {payment.cases?.debtor ? (
                      `${payment.cases.debtor.first_name} ${payment.cases.debtor.last_name}`
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.payment_method || 'N/A'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
