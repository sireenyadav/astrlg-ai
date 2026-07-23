import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getEmbedding } from '@/lib/llm/embeddings';
import { VASTU_CONSULTANT_PROMPT, buildUserPrompt } from '@/lib/llm/prompts';
import { getGroqResponse } from '@/lib/llm/groq';
import { getGeminiResponse } from '@/lib/llm/gemini';

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) return NextResponse.json({ error: 'No query provided' }, { status: 400 });

    const supabase = createClient();
    
    // 1. Generate embedding for the user's query
    const queryEmbedding = await getEmbedding(query);

    // 2. SEMANTIC CACHE CHECK (Save API limits)
    const { data: cachedData } = await supabase.rpc('match_chat_cache', {
      query_embedding: queryEmbedding,
      match_threshold: 0.95,
      match_count: 1
    });

    if (cachedData && cachedData.length > 0) {
      console.log('Cache HIT! Serving cached response.');
      return NextResponse.json({ response: cachedData[0].response_text, cached: true });
    }

    // 3. RAG VECTOR SEARCH (Find relevant Vastu rules)
    const { data: knowledgeData } = await supabase.rpc('match_vastu_knowledge', {
      query_embedding: queryEmbedding,
      match_threshold: 0.7,
      match_count: 3
    });

    const context = knowledgeData && knowledgeData.length > 0
      ? knowledgeData.map((k: any) => k.content).join('\n\n')
      : 'No specific Vastu rules found in database for this query. Use general Vastu principles.';

    // 4. Build Prompts
    const systemPrompt = VASTU_CONSULTANT_PROMPT;
    const userPrompt = buildUserPrompt(query, context);

    // 5. LLM FALLBACK CHAIN (Groq -> Gemini -> Static)
    let aiResponse: string | null = null;
    
    try {
      console.log('Attempting Groq...');
      aiResponse = await getGroqResponse(systemPrompt, userPrompt);
    } catch (groqError) {
      console.log('Groq failed, attempting Gemini fallback...');
      try {
        aiResponse = await getGeminiResponse(systemPrompt, userPrompt);
      } catch (geminiError) {
        console.error('Both LLMs failed.');
        aiResponse = "I'm currently experiencing high traffic. However, based on standard Vastu principles, ensure you balance the five elements (earth, water, fire, air, space) using colors and metals. Please try again in a moment.";
      }
    }

    // 6. SAVE TO CACHE (For future users)
    if (aiResponse) {
      await supabase.from('chat_cache').insert({
        query_text: query,
        query_embedding: queryEmbedding,
        response_text: aiResponse
      });
    }

    return NextResponse.json({ response: aiResponse, cached: false });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
