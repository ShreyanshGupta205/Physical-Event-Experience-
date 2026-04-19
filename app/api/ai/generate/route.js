import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const aiParams = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request) {
  try {
    const { title, context } = await request.json();

    if (!title) {
        return NextResponse.json({ error: 'Title is required for magic generation' }, { status: 400 });
    }

    const prompt = `You are "Eventra Magic Creator", an AI designed to help organizers build high-impact physical events.
    
    EVENT TITLE: ${title}
    ${context ? `ADDITIONAL CONTEXT: ${context}` : ''}

    MISSION:
    Generate a compelling event profile in JSON format.
    Return ONLY a JSON object with these fields:
    - description: (A professional 2-3 sentence description)
    - category: (One of: tech, creative, sports, networking, education)
    - suggestedTags: (An array of 4 string tags)
    - type: (One of: Hackathon, Conference, Workshop, Sports, Networking)
    - color: (A hex color code that matches the event vibe)
    
    Ensure the tone is premium, futuristic, and exciting.`;

    let content = null;
    if (aiParams) {
        const model = aiParams.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();
        
        // Extract JSON from response (Gemini sometimes wraps in markdown blocks)
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            content = JSON.parse(jsonMatch[0]);
        }
    }

    // Fallback if AI fails
    if (!content) {
        content = {
            description: `Join us for ${title}, a breakthrough physical experience designed to push the boundaries of engagement and networking.`,
            category: 'tech',
            suggestedTags: ['Innovation', 'Physical', 'Eventra', 'Live'],
            type: 'Conference',
            color: '#6C63FF'
        };
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('AI Strategy Generation Error:', error);
    return NextResponse.json({ error: 'Magic Generation Failed' }, { status: 500 });
  }
}
