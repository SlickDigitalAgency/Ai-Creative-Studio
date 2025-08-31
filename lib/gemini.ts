
import { GoogleGenAI } from "@google/genai";

// Assume process.env.API_KEY is available in the environment
const apiKey = process.env.API_KEY;
if (!apiKey) {
  // In a real app, you'd want to handle this more gracefully.
  // For this context, we assume it's always present.
  console.error("API_KEY environment variable not set.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey! });
