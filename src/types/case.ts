
export type CaseWithDetails = {
  id: string;
  case_number: string;
  debt_amount: number;
  debt_remaining: number;
  status: "ACTIVE" | "CLOSED" | "SUSPENDED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  due_date: string;
  created_at: string;
  currency: string;
  creditor_name: string;
  case_description: string | null;
  debtor: {
    first_name: string;
    last_name: string;
    email: string | null;
    phone_number: string | null;
    language: string | null;
    status: string | null;
    total_debt_amount: number;
  } | null;
}
