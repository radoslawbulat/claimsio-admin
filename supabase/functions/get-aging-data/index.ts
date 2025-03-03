
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Fetching active cases...')

    const { data: cases, error } = await supabase
      .from('cases')
      .select('due_date, debt_remaining')
      .eq('status', 'ACTIVE')

    if (error) {
      console.error('Database error:', error)
      throw error
    }

    console.log(`Found ${cases?.length || 0} active cases`)

    const now = new Date()
    const agingBrackets = {
      'Not Due': { count: 0, value: 0 },
      '1-30 days': { count: 0, value: 0 },
      '31-60 days': { count: 0, value: 0 },
      '61-90 days': { count: 0, value: 0 },
      '90+ days': { count: 0, value: 0 }
    }

    cases?.forEach(caseItem => {
      const dueDate = new Date(caseItem.due_date)
      const daysDiff = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff <= 0) {
        agingBrackets['Not Due'].count++
        agingBrackets['Not Due'].value += caseItem.debt_remaining
      } else if (daysDiff <= 30) {
        agingBrackets['1-30 days'].count++
        agingBrackets['1-30 days'].value += caseItem.debt_remaining
      } else if (daysDiff <= 60) {
        agingBrackets['31-60 days'].count++
        agingBrackets['31-60 days'].value += caseItem.debt_remaining
      } else if (daysDiff <= 90) {
        agingBrackets['61-90 days'].count++
        agingBrackets['61-90 days'].value += caseItem.debt_remaining
      } else {
        agingBrackets['90+ days'].count++
        agingBrackets['90+ days'].value += caseItem.debt_remaining
      }
    })

    const formattedData = Object.entries(agingBrackets).map(([bracket, data]) => ({
      bracket,
      value: data.value,
      count: data.count
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
