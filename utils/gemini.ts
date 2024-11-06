import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

// Initialize the model with gemini-1.5-flash which supports audio
export const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Remove the fileManager section as it's not supported