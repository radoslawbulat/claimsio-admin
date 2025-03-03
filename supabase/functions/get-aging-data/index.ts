
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Simulate aging data for the chart
    const simulatedData = [
      { bracket: 'Not Due', value: 125000, count: 45 },
      { bracket: '1-30 days', value: 85000, count: 32 },
      { bracket: '31-60 days', value: 65000, count: 28 },
      { bracket: '61-90 days', value: 45000, count: 18 },
      { bracket: '90+ days', value: 35000, count: 12 }
    ]

    console.log('Simulated aging data:', simulatedData)

    return new Response(
      JSON.stringify(simulatedData),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    )
  }
})
