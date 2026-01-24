import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `Tu es une accompagnante bienveillante et chaleureuse, spécialisée dans le soutien aux femmes atteintes de cancer du col de l'utérus ou des ovaires.

Tu réponds avec empathie, douceur et sans jugement. Tu utilises un ton chaleureux et accessible (tutoiement). Tu n'es pas médecin et tu le rappelles si nécessaire.

⚠️ RÈGLES IMPORTANTES :
- Tu informes et accompagnes, mais tu ne poses JAMAIS de diagnostic médical
- Si une question nécessite un avis médical, tu orientes vers un professionnel de santé
- Tu peux utiliser des emojis avec parcimonie (💕 🌸 🤍) pour apporter de la chaleur
- Tes réponses sont concises mais bienveillantes (2-4 phrases max sauf si plus de détails sont demandés)

Voici des informations pertinentes de notre base de connaissances pour répondre à la question :

{context}

Si la base de connaissances ne contient pas d'information directement liée, tu peux donner une réponse générale prudente en précisant que tu n'as pas d'information spécifique et en encourageant à consulter un professionnel si nécessaire.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory = [] } = await req.json();

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Le message est requis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Received message:", message);

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Search knowledge base using full-text search
    const searchTerms = message
      .toLowerCase()
      .replace(/[?!.,;:'"]/g, "")
      .split(/\s+/)
      .filter((word: string) => word.length > 2)
      .join(" | ");

    console.log("Search terms:", searchTerms);

    // Try full-text search first
    let knowledgeResults: any[] = [];
    
    if (searchTerms) {
      const { data: ftsResults, error: ftsError } = await supabase
        .from("knowledge_base")
        .select("category, question, answer")
        .or(`question.fts(french).${searchTerms},answer.fts(french).${searchTerms}`)
        .limit(5);

      if (!ftsError && ftsResults && ftsResults.length > 0) {
        knowledgeResults = ftsResults;
        console.log("FTS results found:", knowledgeResults.length);
      }
    }

    // Fallback: keyword array search
    if (knowledgeResults.length === 0) {
      const keywords = message
        .toLowerCase()
        .replace(/[?!.,;:'"]/g, "")
        .split(/\s+/)
        .filter((word: string) => word.length > 3);

      console.log("Trying keyword search with:", keywords);

      for (const keyword of keywords) {
        const { data: keywordResults } = await supabase
          .from("knowledge_base")
          .select("category, question, answer")
          .contains("keywords", [keyword])
          .limit(3);

        if (keywordResults && keywordResults.length > 0) {
          knowledgeResults.push(...keywordResults);
        }
      }

      // Remove duplicates
      const seen = new Set();
      knowledgeResults = knowledgeResults.filter((item) => {
        const key = item.question;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 5);

      console.log("Keyword results found:", knowledgeResults.length);
    }

    // Fallback: simple ILIKE search
    if (knowledgeResults.length === 0) {
      const searchWords = message
        .toLowerCase()
        .replace(/[?!.,;:'"]/g, "")
        .split(/\s+/)
        .filter((word: string) => word.length > 3);

      for (const word of searchWords.slice(0, 3)) {
        const { data: ilikeResults } = await supabase
          .from("knowledge_base")
          .select("category, question, answer")
          .or(`question.ilike.%${word}%,answer.ilike.%${word}%`)
          .limit(3);

        if (ilikeResults && ilikeResults.length > 0) {
          knowledgeResults.push(...ilikeResults);
        }
      }

      // Remove duplicates
      const seen = new Set();
      knowledgeResults = knowledgeResults.filter((item) => {
        const key = item.question;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      }).slice(0, 5);

      console.log("ILIKE results found:", knowledgeResults.length);
    }

    // Build context from knowledge base results
    let context = "";
    if (knowledgeResults.length > 0) {
      context = knowledgeResults
        .map((r) => `[${r.category}] Q: ${r.question}\nR: ${r.answer}`)
        .join("\n\n");
    } else {
      context = "(Aucune information spécifique trouvée dans la base de connaissances pour cette question.)";
    }

    console.log("Context built, calling LLM...");

    // Build messages array
    const systemMessage = SYSTEM_PROMPT.replace("{context}", context);
    const messages = [
      { role: "system", content: systemMessage },
      ...conversationHistory.slice(-6), // Keep last 6 messages for context
      { role: "user", content: message },
    ];

    // Call Lovable AI Gateway
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages,
        stream: false,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, errorText);

      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Trop de demandes, réessaie dans quelques instants." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crédits épuisés, contacte l'administrateur." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const assistantMessage = aiData.choices?.[0]?.message?.content || 
      "Je suis désolée, je n'ai pas pu générer une réponse. Peux-tu reformuler ta question ? 💕";

    console.log("Response generated successfully");

    return new Response(
      JSON.stringify({ 
        response: assistantMessage,
        sources: knowledgeResults.map(r => r.question)
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Chat RAG error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Une erreur est survenue",
        response: "Désolée, j'ai rencontré un petit souci technique. Peux-tu réessayer ? 🌸"
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
