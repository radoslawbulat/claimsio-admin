import { supabase } from "@/integrations/supabase/client";
import { CaseWithDetails, Communication, CaseAttachment } from "@/types/case";

export const fetchCaseDetails = async (caseId: string) => {
  const { data, error } = await supabase
    .from('cases')
    .select(`
      *,
      debtor:debtors(*)
    `)
    .eq('id', caseId)
    .single();

  if (error) throw error;
  return data as CaseWithDetails;
};

export const fetchCaseComms = async (caseId: string) => {
  console.log('Fetching communications for case:', caseId);
  const { data, error } = await supabase
    .from('comms')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
  
  console.log('Fetched communications:', data);
  return data as Communication[];
};

export const fetchCaseAttachments = async (caseId: string) => {
  console.log('Fetching attachments for case:', caseId);
  const { data, error } = await supabase
    .from('case_attachments')
    .select('*')
    .eq('case_id', caseId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching case attachments:', error);
    throw error;
  }
  
  console.log('Fetched attachments:', data);
  return data as CaseAttachment[];
};
