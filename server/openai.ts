import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface CopyrightAnalysis {
  score: number;
  confidence: number;
  explanation: string;
  potentialIssues: string[];
}

export async function analyzeCopyright(text: string): Promise<CopyrightAnalysis> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a copyright analysis expert. Analyze the text for potential copyright issues and provide a detailed report. Score from 0-100 where 100 means completely original."
        },
        {
          role: "user",
          content: text
        }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    throw new Error("Failed to analyze copyright: " + error.message);
  }
}

export async function generateAlternativeVersion(text: string, analysis: CopyrightAnalysis): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate an alternative version of the text that maintains the same meaning but avoids potential copyright issues. Focus on originality while preserving the core message."
        },
        {
          role: "user",
          content: `Original text: ${text}\n\nCopyright analysis: ${JSON.stringify(analysis)}`
        }
      ]
    });

    return response.choices[0].message.content;
  } catch (error) {
    throw new Error("Failed to generate alternative version: " + error.message);
  }
}
