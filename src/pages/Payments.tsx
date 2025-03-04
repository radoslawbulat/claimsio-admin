import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { Search, CreditCard } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { fetchPayments } from '@/utils/payment-queries';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const navigate = useNavigate();

  const { data: payments, isLoading, error } = useQuery({
    queryKey: ['payments'],
    queryFn: fetchPayments,
  });

  const filteredPayments = payments?.filter(payment => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      payment.cases?.case_number.toLowerCase().includes(searchLower) ||
      (payment.cases?.debtor && 
        (`${payment.cases.debtor.first_name} ${payment.cases.debtor.last_name}`).toLowerCase().includes(searchLower));
    
    const matchesStatus = selectedStatus === 'ALL' || payment.status.toLowerCase() === selectedStatus.toLowerCase();
    
    return (searchQuery === '' || matchesSearch) && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>
        <div className="text-center py-4">Loading payments...</div>
      </div>
    );
  }

  if (error) {
    console.error('Error in payments component:', error);
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>
        <div className="text-center py-4 text-red-600">
          Error loading payments: {error.message}
        </div>
      </div>
    );
  }

  if (!payments || payments.length === 0) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>
        <div className="text-center py-4">No payments found</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center gap-2">
          <CreditCard className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Payments</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
            <Input
              placeholder="Search by case ID or debtor name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedStatus}
            onValueChange={setSelectedStatus}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All statuses</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-lg border">
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
            {filteredPayments && filteredPayments.length > 0 ? (
              filteredPayments.map((payment) => (
                <TableRow 
                  key={payment.id}
                  onClick={() => navigate(`/case/${payment.case_id}`, { state: { from: 'payments' } })}
                  className="cursor-pointer hover:bg-muted"
                >
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
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No payments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Payments;
