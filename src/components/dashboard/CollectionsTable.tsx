
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useLocation, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { differenceInDays } from "date-fns";

const columns = [
  {
    accessorKey: "case_number",
    header: "Case Number"
  },
  {
    accessorKey: "debtor_name",
    header: "Debtor Name"
  },
  {
    accessorKey: "total_debt",
    header: "Total Debt"
  },
  {
    accessorKey: "status",
    header: "Status"
  },
  {
    accessorKey: "age",
    header: "Age (days)"
  },
  {
    accessorKey: "created_at",
    header: "Created At"
  }
];

export const CollectionsTable = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          const formattedCases = data.map(case_ => ({
            ...case_,
            debtor_name: case_.debtor_name 
              ? `${case_.debtor_name.first_name} ${case_.debtor_name.last_name}`
              : 'N/A',
            age: differenceInDays(new Date(), new Date(case_.created_at))
          }));
          setCases(formattedCases);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCases();
  }, []);

  if (loading) {
    return <p>Loading cases...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessorKey}>
              {column.header}
            </TableHead>
          ))}
        </TableRow>
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
            <TableCell>{case_.age}</TableCell>
            <TableCell>
              {new Date(case_.created_at).toLocaleDateString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
