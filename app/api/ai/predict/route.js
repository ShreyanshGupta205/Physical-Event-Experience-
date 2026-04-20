import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

// Initialize Gemini SDK
const aiParams = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

// Simulated tactical insight generator — used if Gemini API is unavailable
function generateSimulatedInsight(event) {
  const fillRate = Math.round((event.checkedIn / event.capacity) * 100);
  const remaining = event.capacity - event.checkedIn;
  const registrationPressure = Math.round((event.registered / event.capacity) * 100);

  const thresholds = [
    { min: 85, insight: `Critical mass approaching: ${fillRate}% venue capacity reached. Immediate action required — activate overflow protocols and deploy additional marshals to Entry Gates 2 and 3. Expect a surge in the next 15 minutes as registered attendees (${registrationPressure}% of capacity) converge.` },
    { min: 60, insight: `Healthy engagement trajectory confirmed at ${fillRate}% occupancy. Entry flow is nominal. Pre-position catering staff for peak demand in T-minus 20 minutes. ${remaining.toLocaleString()} remaining capacity provides adequate buffer — no escalation required at this time.` },
    { min: 30, insight: `Early-phase population dynamics in effect (${fillRate}% fill). Registration commitments (${registrationPressure}%) suggest a strong second-wave arrival window. Open all gates to full throughput and maximize pre-event engagement on the floor. Operational posture: STEADY.` },
    { min: 0, insight: `Event initialization phase. ${event.registered.toLocaleString()} attendees registered (${registrationPressure}% of ${event.capacity.toLocaleString()} capacity). All systems GREEN. Recommend a final gate readiness sweep before doors open.` }
  ];

  const matched = thresholds.find(t => fillRate >= t.min) || thresholds[thresholds.length - 1];
  return `[EVENTRA AI — SIMULATION MODE] ${matched.insight}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const eventId = searchParams.get('eventId');

    if (!eventId) {
      return NextResponse.json({ error: 'eventId is required for context' }, { status: 400 });
    }

    // 1. Fetch live telemetry from MongoDB
    const event = await prisma.event.findUnique({ where: { id: eventId } });

    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // 2. Build contextual prompt for the AI
    const prompt = `You are "Eventra AI", an elite operational intelligence system orchestrating large-scale physical events.

CURRENT VENUE STATE:
Event: ${event.title} (${event.type})
Capacity: ${event.capacity}
Total Checked In: ${event.checkedIn}
Total Registered: ${event.registered}

MISSION:
Analyze this crowd telemetry. Provide a concise, highly strategic, 3-sentence operational prediction on what the organizers should expect regarding crowd flow over the next 30 minutes, and any actions they should take immediately. 
Adopt a professional, tactical, "control center" tone.`;

    // 3. Try Gemini — only free-tier Flash models (paid Pro models have 0 free quota)
    const MODEL_CANDIDATES = ['gemini-2.0-flash', 'gemini-1.5-flash'];
    let text = null;

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

    if (aiParams) {
      for (const modelName of MODEL_CANDIDATES) {
        try {
          const model = aiParams.getGenerativeModel({ model: modelName });
          const result = await fetchWithBackoff(() => model.generateContent(prompt));
          text = result.response.text();
          break; // success — stop trying
        } catch (aiErr) {
          console.warn(`Gemini model "${modelName}" failed:`, aiErr.message);
        }
      }
    }

    // 4. If all Gemini attempts fail, use the simulation engine
    if (!text) {
      console.log('All Gemini models unavailable — using simulation engine.');
      text = generateSimulatedInsight(event);
    }

    return NextResponse.json({ suggestion: text });
  } catch (error) {
    console.error('AI Predict Route Error:', error);
    return NextResponse.json({ error: 'AI Prediction failed.' }, { status: 500 });
  }
}
