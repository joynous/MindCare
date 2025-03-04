// app/api/generate-advice/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { keywords } = await request.json();
    
    const completion = await openai.chat.completions.create({
      messages: [{
        role: "system",
        content: `You're a mental health assistant. Provide 3 practical, professional suggestions to help with: ${keywords.join(', ')}. 
        Keep responses concise (max 100 words total), use simple language, and focus on actionable steps. 
        Avoid medical advice, focus on coping strategies.`
      }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 150,
    });

    return NextResponse.json({ 
      advice: completion.choices[0].message.content 
    });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate advice' },
      { status: 500 }
    );
  }
}