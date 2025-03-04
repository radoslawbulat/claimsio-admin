
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/types/payment";

export const fetchPayments = async () => {
  console.log('Fetching payments...');
  const { data, error } = await supabase
    .from('payments')
    .select(`
      *,
      cases (
        case_number,
        debtor:debtors (
          first_name,
          last_name
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }

  console.log('Fetched payments:', data);
  return data as (Payment & {
    cases: {
      case_number: string;
      debtor: {
        first_name: string;
        last_name: string;
      } | null;
    } | null;
  })[];
};
