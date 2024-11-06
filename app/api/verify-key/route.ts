import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

interface ApiError extends Error {
  message: string;
}

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found',
        envVars: {
          hasKey: !!process.env.GOOGLE_API_KEY,
          nodeEnv: process.env.NODE_ENV,
        }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    // Test the API key with a simple prompt
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    
    return NextResponse.json({
      success: true,
      response: response.text(),
      envVars: {
        hasKey: !!process.env.GOOGLE_API_KEY,
        nodeEnv: process.env.NODE_ENV,
      }
    });
    
  } catch (error: ApiError) {
    return NextResponse.json({
      success: false,
      error: error.message,
      envVars: {
        hasKey: !!process.env.GOOGLE_API_KEY,
        nodeEnv: process.env.NODE_ENV,
      }
    });
  }
} 