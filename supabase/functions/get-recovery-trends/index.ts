
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get all payments grouped by month
    const { data, error } = await supabase
      .from('payments')
      .select('created_at, amount_received')
      .eq('status', 'completed')
      .order('created_at');

    if (error) throw error;

    // Process the data to get monthly cumulative totals
    const monthlyTotals = data.reduce((acc: any[], payment) => {
      const date = new Date(payment.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      
      const existingMonth = acc.find(item => item.month === monthKey);
      if (existingMonth) {
        existingMonth.amount += payment.amount_received;
      } else {
        // If it's a new month, add previous month's total to maintain cumulative value
        const previousTotal = acc.length > 0 ? acc[acc.length - 1].amount : 0;
        acc.push({
          month: monthKey,
          amount: previousTotal + payment.amount_received
        });
      }
      return acc;
    }, []);

    console.log('Monthly recovery trends calculated:', monthlyTotals);

    return new Response(JSON.stringify(monthlyTotals), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-recovery-trends function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
