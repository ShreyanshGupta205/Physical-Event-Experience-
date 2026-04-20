import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Simple in-memory cache for redundant queries
const AI_CACHE = new Map();
const CACHE_LIMIT = 500; // Prevent memory leak by capping cache size

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
    const cacheKey = `${role}_${lastMsg.toLowerCase().trim()}`;

    // Check cache for instant delivery
    if (AI_CACHE.has(cacheKey)) {
      console.log('Serving from AI Cache:', cacheKey);
      return NextResponse.json({ text: AI_CACHE.get(cacheKey), cached: true });
    }
    
    // Model selection loop - Updated for 2026 candidates
    // Only free-tier Flash models. Pro/paid models have 0 free quota and will always 429.
    const MODEL_CANDIDATES = ['gemini-2.0-flash', 'gemini-1.5-flash'];
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

    // Resilience Layer: Exponential Backoff with jitter for 429 errors
    const fetchWithBackoff = async (fn, retries = 3, delay = 800) => {
      try {
        return await fn();
      } catch (err) {
        const is429 = err.message.includes('429') || err.message.includes('quota');
        if (retries > 0 && is429) {
          // Add ±30% jitter to prevent thundering herd on shared quota
          const jitter = delay * (0.7 + Math.random() * 0.6);
          console.warn(`AI Quota Hit. Retrying in ${Math.round(jitter)}ms... (Retries left: ${retries})`);
          await new Promise(res => setTimeout(res, jitter));
          return fetchWithBackoff(fn, retries - 1, delay * 2);
        }
        throw err;
      }
    };

    for (const modelName of MODEL_CANDIDATES) {
      try {
        const model = genAI.getGenerativeModel({ 
          model: modelName,
          systemInstruction: systemInstruction 
        });
        
        const result = await fetchWithBackoff(() => model.generateContent(`User query: ${lastMsg}`));
        const response = await result.response;
        text = response.text();
        if (text) break;
      } catch (err) {
        console.warn(`Model ${modelName} attempt failed:`, err.message);
        lastErr = err.message;
        
        // If we still hit 429 after retries, we stop this model and try the next one after a small pause
        if (err.message.includes('429')) await new Promise(res => setTimeout(res, 500));
      }
    }

    if (!text) {
      // Surface a clean, user-friendly message — not raw API error dumps
      console.error('AI all models exhausted. Last error:', lastErr);
      return NextResponse.json({ 
        error: 'Eventra AI is temporarily offline. Please try again in a moment.',
        retryable: true 
      }, { status: 503 });
    }

    // Save to cache for future efficiency
    if (AI_CACHE.size >= CACHE_LIMIT) {
      const firstKey = AI_CACHE.keys().next().value;
      AI_CACHE.delete(firstKey);
    }
    AI_CACHE.set(cacheKey, text);

    return NextResponse.json({ text });

  } catch (error) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Critical system failure: Telemetry gap.' }, { status: 500 });
  }
}
