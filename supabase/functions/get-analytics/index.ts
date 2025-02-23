
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

    // Get total remaining debt for active cases (portfolio value)
    const { data: activeCasesData, error: activeCasesError } = await supabase
      .from('cases')
      .select('debt_remaining')
      .eq('status', 'ACTIVE');

    if (activeCasesError) throw activeCasesError;

    // Get total debt amount and remaining debt for all cases regardless of status
    const { data: allCasesData, error: allCasesError } = await supabase
      .from('cases')
      .select('debt_amount, debt_remaining');

    if (allCasesError) throw allCasesError;

    // Get count of active cases
    const { count: activeCases, error: casesError } = await supabase
      .from('cases')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'ACTIVE');

    if (casesError) throw casesError;

    // Calculate metrics
    const portfolioValue = activeCasesData.reduce((sum, data) => sum + (data.debt_remaining || 0), 0);
    const totalDebtAmount = allCasesData.reduce((sum, data) => sum + (data.debt_amount || 0), 0);
    const totalRemainingDebt = allCasesData.reduce((sum, data) => sum + (data.debt_remaining || 0), 0);
    const recoveredValue = totalDebtAmount - totalRemainingDebt;
    const recoveryRate = totalDebtAmount > 0 ? (recoveredValue / totalDebtAmount) * 100 : 0;

    const response = {
      portfolioValue,
      recoveredValue,
      recoveryRate: parseFloat(recoveryRate.toFixed(1)),
      activeCases: activeCases || 0
    };

    console.log('Analytics calculated:', response);
    console.log('Details:', {
      totalDebtAmount,
      totalRemainingDebt,
      activeCasesCount: activeCasesData.length,
      allCasesCount: allCasesData.length
    });

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
