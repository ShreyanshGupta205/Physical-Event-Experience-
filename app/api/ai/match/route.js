import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PEERS } from '@/data/mockData';

const aiParams = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Deterministic fallback: score peers by shared registered events
function localMatchFallback(registeredEvents, limit = 2) {
  if (!PEERS || PEERS.length === 0) return [];

  const scored = PEERS.map(peer => {
    const peerEvents = peer.registeredEvents || peer.interests || [];
    const overlap = registeredEvents.filter(e =>
      peerEvents.some(pe => pe.toLowerCase().includes(e.toLowerCase()) || e.toLowerCase().includes(pe.toLowerCase()))
    ).length;
    return { peer, overlap };
  });

  return scored
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ peer, overlap }) => ({
      peerId: peer.id,
      matchReason: overlap > 0
        ? `Shares ${overlap} common event interest(s) — strong alignment for in-person networking.`
        : `Broad professional compatibility based on platform activity.`
    }));
}

// Exponential backoff with jitter
const fetchWithBackoff = async (fn, retries = 2, delay = 800) => {
  try { return await fn(); }
  catch (err) {
    const is429 = err.message.includes('429') || err.message.includes('quota');
    if (retries > 0 && is429) {
      const jitter = delay * (0.7 + Math.random() * 0.6);
      await new Promise(res => setTimeout(res, jitter));
      return fetchWithBackoff(fn, retries - 1, delay * 2);
    }
    throw err;
  }
};

export async function POST(request) {
  try {
    const { studentId, registeredEvents = [] } = await request.json();

    // Only free-tier Flash models — Pro models have 0 free quota and always 429
    const MODEL_CANDIDATES = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let matches = null;

    if (aiParams && PEERS.length > 0) {
      const prompt = `You are "Eventra Networking AI".
    
    USER TARGET:
    - Registered Events: ${registeredEvents.join(', ') || 'None listed'}
    
    PEER POOL:
    ${PEERS.map(p => `- ${p.name} (id: ${p.id}): ${p.role}, Interests: ${(p.interests || []).join(', ')}`).join('\n')}

    MISSION:
    Select the Top 2 matches for this user from the PEER POOL.
    Return ONLY a JSON array of objects with these fields:
    - peerId: (The ID of the peer)
    - matchReason: (A 1-sentence reason why they match)
    
    Ensure the matches feel strategic and valuable.`;

      for (const modelName of MODEL_CANDIDATES) {
        try {
          const model = aiParams.getGenerativeModel({ model: modelName });
          const result = await fetchWithBackoff(() => model.generateContent(prompt));
          const responseText = result.response.text();
          const jsonMatch = responseText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            matches = JSON.parse(jsonMatch[0]);
            break;
          }
        } catch (aiErr) {
          console.warn(`AI Matching model "${modelName}" failed:`, aiErr.message);
        }
      }
    }

    // Deterministic fallback — always returns something useful
    if (!matches) {
      console.log('AI matching unavailable — using local scoring engine.');
      matches = localMatchFallback(registeredEvents);
    }

    return NextResponse.json(matches);
  } catch (error) {
    console.error('AI Matching Error:', error);
    return NextResponse.json({ error: 'Matching Failed' }, { status: 500 });
  }
}
