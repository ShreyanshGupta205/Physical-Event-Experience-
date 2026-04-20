import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(req) {
  try {
    if (!genAI) {
      return NextResponse.json({ error: 'AI Service Configuration Missing' }, { status: 500 });
    }

    const { messages, role, name } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Message history is required' }, { status: 400 });
    }

    const lastMsg = messages[messages.length - 1].text;
    
    // Model selection loop - Updated for 2026 candidates
    const MODEL_CANDIDATES = ['gemini-2.0-flash', 'gemini-flash-latest', 'gemini-pro-latest'];
    let text = null;
    let lastErr = null;

    const systemInstruction = `You are "Eventra AI", the elite operational assistant for the Eventra platform. 
    User Role: ${role || 'Explorer'}. 
    User Name: ${name || 'User'}.
    
    MISSION: Provide tactical, concise, and professional platform assistance. 
    - As an Organizer: Help with crowd surge management and event creation.
    - As a Student: Help find entry passes and networking matching.
    - As a Staff: Help with scanning protocols.
    
    Response length: 1-3 sentences. Professional tone.`;

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction 
        });
        
        const result = await model.generateContent(`User query: ${lastMsg}`);
        const response = await result.response;
        text = response.text();
        if (text) break;
      } catch (err) {
        console.warn(`Model ${modelName} selection failed:`, err.message);
        lastErr = err.message;
      }
    }

    if (!text) {
      return NextResponse.json({ error: `AI Telemetry Offline: ${lastErr}. Check GEMINI_API_KEY integrity.` }, { status: 503 });
    }

    return NextResponse.json({ text });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Critical system failure: Telemetry gap.' }, { status: 500 });
  }
}
