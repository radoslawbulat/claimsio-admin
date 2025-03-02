import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

type CollectionCase = {
  id: string;
  case_number: string;
  debt_remaining: number;
  status: string;
  due_date: string;
  debtor: {
    first_name: string;
    last_name: string;
  } | null;
  last_comms: {
    created_at: string;
  } | null;
};

const fetchCollections = async () => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      id,
      case_number,
      debt_remaining,
      status,
      due_date,
      debtor:debtors(first_name, last_name),
      last_comms:comms(created_at)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Transform the data to match our expected type
  const transformedData = data?.map(item => ({
    ...item,
    last_comms: Array.isArray(item.last_comms) && item.last_comms.length > 0 
      ? item.last_comms[0] 
      : null
  }));

  return transformedData as CollectionCase[];
};

const statusColors = {
  ACTIVE: "bg-green-500",
  CLOSED: "bg-gray-500",
  SUSPENDED: "bg-yellow-500",
};

export default function Collections() {
  const { data: cases, isLoading } = useQuery({
    queryKey: ['collections'],
    queryFn: fetchCollections,
  });

  if (isLoading) {
    return <div className="p-4">Loading collections...</div>;
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Collections</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Debtor</TableHead>
              <TableHead className="text-right">Debt Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cases?.map((caseItem) => (
              <TableRow key={caseItem.id}>
                <TableCell className="font-medium">{caseItem.case_number}</TableCell>
                <TableCell>
                  {caseItem.debtor 
                    ? `${caseItem.debtor.first_name} ${caseItem.debtor.last_name}`
                    : 'N/A'}
                </TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  }).format(caseItem.debt_remaining / 100)}
                </TableCell>
                <TableCell>
                  <Badge className={statusColors[caseItem.status as keyof typeof statusColors]}>
                    {caseItem.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(caseItem.due_date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {caseItem.last_comms?.created_at 
                    ? format(new Date(caseItem.last_comms.created_at), 'MMM d, yyyy')
                    : 'No activity'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
