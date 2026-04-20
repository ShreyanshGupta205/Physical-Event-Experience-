import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PEERS } from '@/data/mockData';

const aiParams = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export async function POST(request) {
  try {
    const { studentId, registeredEvents } = await request.json();

    const prompt = `You are "Eventra Networking AI".
    
    USER TARGET:
    - Registered Events: ${registeredEvents.join(', ')}
    
    PEER POOL:
    ${PEERS.map(p => `- ${p.name}: ${p.role}, Interests: ${p.interests.join(', ')}`).join('\n')}

    MISSION:
    Select the Top 2 matches for this user from the PEER POOL.
    Return ONLY a JSON array of objects with these fields:
    - peerId: (The ID of the peer)
    - matchReason: (A 1-sentence reason why they match, e.g. "Shared interest in AI and both attending the Tech Summit")
    
    Ensure the matches feel strategic and valuable.`;

    let matches = [];
    if (aiParams) {
        try {
            const model = aiParams.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                matches = JSON.parse(jsonMatch[0]);
            }
        } catch (aiErr) {
            console.error('AI Matching Error (falling back):', aiErr);
        }
    }

    // No fallback if AI fails, return empty list
    return NextResponse.json(matches);
  } catch (error) {
    console.error('AI Matching Error:', error);
    return NextResponse.json({ error: 'Matching Failed' }, { status: 500 });
  }
}
