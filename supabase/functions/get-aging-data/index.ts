
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching active cases...')

    // Get all active cases - using 'ACTIVE' instead of 'NEW'
    const { data: cases, error } = await supabase
      .from('cases')
      .select('created_at')
      .eq('status', 'ACTIVE')
      .order('created_at')

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Found ${cases?.length || 0} active cases`)

    const now = new Date()
    const agingBrackets = {
      '0-30 days': 0,
      '31-60 days': 0,
      '61-90 days': 0,
      '90+ days': 0
    }

    cases?.forEach(caseItem => {
      const createdAt = new Date(caseItem.created_at)
      const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 30) {
        agingBrackets['0-30 days']++
      } else if (daysDiff <= 60) {
        agingBrackets['31-60 days']++
      } else if (daysDiff <= 90) {
        agingBrackets['61-90 days']++
      } else {
        agingBrackets['90+ days']++
      }
    })

    const formattedData = Object.entries(agingBrackets).map(([bracket, count]) => ({
      bracket,
      amount: count
    }))

    console.log('Aging data:', formattedData)

    return new Response(
      JSON.stringify(formattedData),
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
