
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import type { CaseWithDebtor } from '@/types/case';

export type SortConfig = {
  column: 'case_number' | 'debtor' | 'debt_remaining' | 'status' | 'due_date' | 'latest_comm' | null;
  direction: 'asc' | 'desc';
};

const fetchCasesWithDebtors = async (sortConfig: SortConfig) => {
  console.log('Fetching all cases...');

  const { data: casesData, error: casesError } = await supabase
    .from('cases')
    .select(`
      *,
      debtor:debtors!cases_debtor_id_fkey(*)
    `);

  if (casesError) {
    console.error('Error fetching cases:', casesError);
    throw casesError;
  }

  console.log('Cases data:', casesData);

  if (!casesData || casesData.length === 0) {
    console.log('No cases found');
    return [];
  }

  const casesWithComms = await Promise.all(
    casesData.map(async (caseItem) => {
      const { data: commsData, error: commsError } = await supabase
        .from('comms')
        .select('created_at')
        .eq('case_id', caseItem.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (commsError && commsError.code !== 'PGRST116') {
        console.error('Error fetching communications:', commsError);
      }

      return {
        id: caseItem.id,
        case_number: caseItem.case_number,
        debt_remaining: caseItem.debt_remaining,
        status: caseItem.status,
        due_date: caseItem.due_date,
        currency: caseItem.currency,
        debtor: caseItem.debtor ? {
          first_name: caseItem.debtor.first_name,
          last_name: caseItem.debtor.last_name
        } : null,
        latest_comm: commsData ? { created_at: commsData.created_at } : null
      };
    })
  );

  if (sortConfig.column) {
    casesWithComms.sort((a, b) => {
      const direction = sortConfig.direction === 'asc' ? 1 : -1;

      switch (sortConfig.column) {
        case 'case_number':
          return a.case_number.localeCompare(b.case_number) * direction;
        case 'debtor':
          const aName = a.debtor ? `${a.debtor.first_name} ${a.debtor.last_name}` : '';
          const bName = b.debtor ? `${b.debtor.first_name} ${b.debtor.last_name}` : '';
          return aName.localeCompare(bName) * direction;
        case 'debt_remaining':
          return (a.debt_remaining - b.debt_remaining) * direction;
        case 'status':
          return a.status.localeCompare(b.status) * direction;
        case 'due_date':
          return (new Date(a.due_date).getTime() - new Date(b.due_date).getTime()) * direction;
        case 'latest_comm':
          const aTime = a.latest_comm ? new Date(a.latest_comm.created_at).getTime() : 0;
          const bTime = b.latest_comm ? new Date(b.latest_comm.created_at).getTime() : 0;
          return (aTime - bTime) * direction;
        default:
          return 0;
      }
    });
  }

  return casesWithComms;
};

export const useCasesData = (sortConfig: SortConfig) => {
  return useQuery({
    queryKey: ['dashboard-cases', sortConfig],
    queryFn: () => fetchCasesWithDebtors(sortConfig),
  });
};
