import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function getGeminiResponse(systemPrompt: string, userPrompt: string) {
  try {
    // Using Gemini 1.5 Flash for fast, cheap fallback responses
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `${systemPrompt}\n\n${userPrompt}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Gemini API call failed");
  }
}
