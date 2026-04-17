import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getStylingAdvice(items: { name: string, category: string }[]) {
  if (items.length === 0) return null;

  const itemNames = items.map(i => i.name).join(", ");
  const prompt = `I am buying these fashion items: ${itemNames}. 
  Provide 3 professional styling tips or complementary accessory suggestions (like watches, shoes, or perfumes) that would pair perfectly with these. 
  Keep it concise, high-fashion, and sophisticated. Return as a clear list.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class fashion stylist for ModeDash, a luxury rapid delivery app. Your tone is sophisticated, exclusive, and helpful."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini styling error:", error);
    return "Our AI stylist is currently busy curation the next season. Please check back later.";
  }
}
