import Groq from "groq-sdk";

// Initialize Groq client using the environment variable
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function getGroqResponse(systemPrompt: string, userPrompt: string) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      model: "llama-3.3-70b-versatile", // Using the latest versatile model on free tier
      temperature: 0.3, // Low temperature for factual, non-hallucinated responses
      max_tokens: 1024,
    });
    return chatCompletion.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Groq API call failed");
  }
}
