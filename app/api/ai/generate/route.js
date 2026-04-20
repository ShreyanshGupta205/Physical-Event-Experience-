import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const aiParams = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Deterministic fallback — generates a valid event profile from the title alone
function localEventProfile(title) {
  const lower = title.toLowerCase();
  const isTech = /tech|ai|hack|code|cloud|data|dev|web|digital/.test(lower);
  const isSports = /sport|run|race|game|fitness|match|league/.test(lower);
  const isCreative = /art|design|music|creative|photo|film/.test(lower);
  const isNetworking = /network|meet|connect|summit|mixer/.test(lower);

  const profile = isTech
    ? { category: 'tech', type: 'Hackathon', color: '#6C63FF', suggestedTags: ['Innovation', 'AI', 'Coding', 'FutureTech'] }
    : isSports
    ? { category: 'sports', type: 'Sports', color: '#FF4757', suggestedTags: ['Athletics', 'Competition', 'Fitness', 'Championship'] }
    : isCreative
    ? { category: 'creative', type: 'Workshop', color: '#FFA502', suggestedTags: ['Creativity', 'Design', 'Expression', 'Art'] }
    : isNetworking
    ? { category: 'networking', type: 'Networking', color: '#00D4AA', suggestedTags: ['Connections', 'Community', 'Growth', 'Leadership'] }
    : { category: 'education', type: 'Conference', color: '#A29BFE', suggestedTags: ['Learning', 'Knowledge', 'Expert', 'Insight'] };

  return {
    ...profile,
    description: `${title} is a premier physical experience designed to bring together passionate individuals for an unforgettable event. Attendees will collaborate, learn, and connect in a dynamic, high-energy environment built for impact. Expect world-class programming, curated networking, and moments that inspire long after the event ends.`,
  };
}

// Exponential backoff with jitter
async function fetchWithBackoff(fn, retries = 2, delay = 800) {
  try { return await fn(); }
  catch (err) {
    const is429 = err.message.includes('429') || err.message.includes('quota');
    if (retries > 0 && is429) {
      const jitter = delay * (0.7 + Math.random() * 0.6);
      console.warn(`AI quota hit on generate. Retrying in ${Math.round(jitter)}ms... (${retries} left)`);
      await new Promise(res => setTimeout(res, jitter));
      return fetchWithBackoff(fn, retries - 1, delay * 2);
    }
    throw err;
  }
}

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

    // Only free-tier Flash models — Pro models have 0 free quota
    const MODEL_CANDIDATES = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let content = null;

    if (aiParams) {
      for (const modelName of MODEL_CANDIDATES) {
        try {
          const model = aiParams.getGenerativeModel({ model: modelName });
          const result = await fetchWithBackoff(() => model.generateContent(prompt));
          const responseText = result.response.text();

          // Gemini sometimes wraps JSON in markdown code fences
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            content = JSON.parse(jsonMatch[0]);
            break;
          }
        } catch (aiErr) {
          console.warn(`Generate model "${modelName}" failed:`, aiErr.message);
        }
      }
    }

    // Deterministic local fallback — always returns something useful
    if (!content) {
      console.log('AI generate unavailable — using local profile engine.');
      content = localEventProfile(title);
    }

    return NextResponse.json(content);
  } catch (error) {
    console.error('AI Strategy Generation Error:', error);
    return NextResponse.json({ error: 'Magic Generation Failed' }, { status: 500 });
  }
}
