
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

    // Get all payments grouped by month and priority
    const { data, error } = await supabase
      .from('payments')
      .select('created_at, amount_received, priority')
      .eq('status', 'completed')
      .order('created_at');

    if (error) throw error;

    // Process the data to get monthly cumulative totals by priority
    const monthlyData = data.reduce((acc: any, payment) => {
      const date = new Date(payment.created_at);
      const monthKey = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          low: 0,
          medium: 0,
          high: 0,
          critical: 0
        };
      }
      
      // Add to the appropriate priority bucket
      switch(payment.priority) {
        case 'low':
          acc[monthKey].low += payment.amount_received;
          break;
        case 'medium':
          acc[monthKey].medium += payment.amount_received;
          break;
        case 'high':
          acc[monthKey].high += payment.amount_received;
          break;
        case 'critical':
          acc[monthKey].critical += payment.amount_received;
          break;
      }
      
      return acc;
    }, {});

    // Convert to array and make cumulative
    const result = Object.values(monthlyData).reduce((acc: any[], curr: any, index: number) => {
      if (index === 0) {
        acc.push(curr);
      } else {
        acc.push({
          month: curr.month,
          low: curr.low + acc[index - 1].low,
          medium: curr.medium + acc[index - 1].medium,
          high: curr.high + acc[index - 1].high,
          critical: curr.critical + acc[index - 1].critical
        });
      }
      return acc;
    }, []);

    console.log('Monthly recovery trends calculated:', result);

    return new Response(JSON.stringify(result), {
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
