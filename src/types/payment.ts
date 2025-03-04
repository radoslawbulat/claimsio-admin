
export type Payment = {
  id: string;
  amount_received: number;
  case_id: string | null;
  currency: string;
  payment_method: string | null;
  payment_intent_id: string | null;
  payment_link_id: string | null;
  payment_link_url: string | null;
  status: "pending" | "completed" | "failed" | "refunded" | "cancelled";
  created_at: string;
}
