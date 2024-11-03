import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper to handle errors
const handleError = (error) => {
  console.error('OpenAI API Error:', error);
  return NextResponse.json(
    { error: 'There was an error processing your request' },
    { status: 500 }
  );
};

// API route handler
export async function POST(request) {
  try {
    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse the request body
    const body = await request.json();
    const { messages } = body;

    // Validate request data
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages are required and must be an array' },
        { status: 400 }
      );
    }

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    // Return the response
    return NextResponse.json({ 
      message: completion.choices[0].message 
    });

  } catch (error) {
    return handleError(error);
  }
}
