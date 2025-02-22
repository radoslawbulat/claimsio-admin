
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get total debt and remaining debt for active debtors
    const { data: debtorsData, error: debtorsError } = await supabase
      .from('debtors')
      .select('total_debt_amount, total_debt_remaining')
      .eq('status', 'active');

    if (debtorsError) throw debtorsError;

    // Get count of active cases
    const { count: activeCases, error: casesError } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .not('status', 'eq', 'CLOSED');

    if (casesError) throw casesError;

    // Calculate metrics
    const portfolioValue = debtorsData.reduce((sum, debtor) => sum + (debtor.total_debt_remaining || 0), 0);
    const totalDebt = debtorsData.reduce((sum, debtor) => sum + (debtor.total_debt_amount || 0), 0);
    const recoveredValue = totalDebt - portfolioValue;
    const recoveryRate = totalDebt > 0 ? (recoveredValue / totalDebt) * 100 : 0;

    const response = {
      portfolioValue,
      recoveredValue,
      recoveryRate: parseFloat(recoveryRate.toFixed(1)),
      activeCases: activeCases || 0
    };

    console.log('Analytics calculated:', response);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-analytics function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
