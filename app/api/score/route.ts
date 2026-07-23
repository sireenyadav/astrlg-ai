import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { entity, direction } = await request.json();

    if (!entity || !direction) {
      return NextResponse.json({ error: 'Missing entity or direction' }, { status: 400 });
    }

    const supabase = createClient();

    // Query the deterministic rules matrix
    const { data: rule, error } = await supabase
      .from('vastu_rules')
      .select('*')
      .eq('entity', entity)
      .eq('direction', direction)
      .single();

    if (error || !rule) {
      // If no specific rule exists, return a neutral response
      return NextResponse.json({ 
        entity, 
        direction, 
        verdict: 'neutral', 
        score_modifier: 0,
        impact_consumer: 'No specific Vastu rules apply to this configuration.',
        free_micro_remedy: null
      });
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error('Scoring Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
