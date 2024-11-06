import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Log file details
    console.log('Processing audio file:', {
      name: audioFile.name,
      type: audioFile.type,
      size: audioFile.size
    });

    // Convert File to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString('base64');

    // Initialize the model with gemini-1.5-flash which supports audio
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    try {
      // Generate content using the proper format for audio files
      const result = await model.generateContent([
        {
          inlineData: {
            mimeType: audioFile.type,
            data: base64Audio
          }
        },
        { text: "Generate a transcript of this audio content. Return only the transcribed text without any timestamps or metadata." }
      ]);

      const response = await result.response;
      let transcription = response.text();

      // Clean up the transcription text
      transcription = transcription
        .replace(/^```.*\n/, '') // Remove opening code block markers
        .replace(/\n```$/, '')   // Remove closing code block markers
        .replace(/^Transcription:?\s*/i, '') // Remove "Transcription:" prefix
        .replace(/Pe \d{2}:\d{2}\s*/g, '') // Remove timestamp patterns
        .replace(/\n{2,}/g, '\n') // Replace multiple newlines with single newline
        .trim();

      if (!transcription) {
        throw new Error('No transcription generated');
      }

      return NextResponse.json({ 
        success: true,
        transcription,
      });

    } catch (generationError: any) {
      console.error('Generation error:', {
        message: generationError.message,
        name: generationError.name,
        stack: generationError.stack
      });
      
      return NextResponse.json({
        error: 'Transcription generation failed',
        details: generationError.message,
        stack: process.env.NODE_ENV === 'development' ? generationError.stack : undefined
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}