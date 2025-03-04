import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link, useLocation } from "react-router-dom";

interface Case {
  id: string;
  case_number: string;
  debtor_name: string;
  total_debt: number;
  status: string;
  created_at: string;
}

const columns: ColumnDef<Case>[] = [
  {
    accessorKey: "case_number",
    header: "Case Number",
  },
  {
    accessorKey: "debtor_name",
    header: "Debtor Name",
  },
  {
    accessorKey: "total_debt",
    header: "Total Debt",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "Created At",
  },
]

export const CollectionsTable = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const { data, error } = await supabase
          .from('cases')
          .select('id, case_number, debtor_name:debtors(first_name, last_name), total_debt, status, created_at')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) {
          setError(error);
        } else {
          const formattedCases = data.map((case_: any) => ({
            ...case_,
            debtor_name: case_.debtor_name ? `${case_.debtor_name.first_name} ${case_.debtor_name.last_name}` : 'N/A',
          }));
          setCases(formattedCases as Case[]);
        }
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  const table = useReactTable({
    data: cases,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  if (loading) {
    return <p>Loading cases...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {cases.map((case_) => (
          <TableRow key={case_.id}>
            <TableCell>
              <Link 
                to={`/case/${case_.id}`} 
                state={{ from: isDashboard ? 'dashboard' : 'collections' }}
                className="text-primary hover:underline"
              >
                {case_.case_number}
              </Link>
            </TableCell>
            <TableCell>{case_.debtor_name}</TableCell>
            <TableCell>${case_.total_debt}</TableCell>
            <TableCell>{case_.status}</TableCell>
            <TableCell>{new Date(case_.created_at).toLocaleDateString()}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
