const AI_ENDPOINT = "https://api.openai.com/v1/responses";

function buildFallbackNarrative({ location, interests, itinerary }) {
  const interestLine = interests.length ? interests.slice(0, 2).join(" and ") : "easygoing local exploration";

  if (!itinerary.length) {
    return `Safari AI could not find a strong match just yet, so it is nudging you toward widening the radius or budget. The next good plan is probably one small treat and one calm scenic stop around ${location}.`;
  }

  const firstStop = itinerary[0].name;
  return `This plan keeps your day grounded in ${interestLine}. Begin with ${firstStop}, then let the rest of the route unfold in a way that is kind to both your energy and your wallet.`;
}

export async function generateSafariNarrative(payload) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  if (!apiKey || !model) {
    return buildFallbackNarrative(payload);
  }

  const prompt = `
You are Safari AI, a serene Kenyan tourism guide with slightly playful warmth.
Write 2 concise sentences that summarize an itinerary.

Location: ${payload.location}
Budget: ${payload.budget} ${payload.currency}
Interests: ${payload.interests.join(", ") || "general discovery"}
Activities: ${payload.itinerary.map((item) => `${item.name} (${item.category})`).join(", ")}

Tone goals:
- calming
- practical
- lightly quirky
- never overhype
`;

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = await response.json();
    return data.output_text?.trim() || buildFallbackNarrative(payload);
  } catch (error) {
    console.warn("Safari AI narrative fallback:", error.message);
    return buildFallbackNarrative(payload);
  }
}

export async function generateProsAndCons(activity) {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;

  const fallback = {
    pros: [
      "Fits comfortably into a half-day or day plan.",
      "Distinct sense of place with clear local flavor.",
      "Easy to combine with nearby stops for better value."
    ],
    cons: [
      "Peak hours may feel busier than the mood suggests.",
      "Transport costs can grow if you are crossing the city.",
      "Weather and traffic may affect timing."
    ],
    summary: `${activity.name} feels rewarding when you want something authentic without overcomplicating the day.`
  };

  if (!apiKey || !model) {
    return fallback;
  }

  const prompt = `
You are Safari AI. Return JSON with keys pros, cons, summary.
Activity: ${activity.name}
Description: ${activity.longDescription}
Best time: ${activity.bestTimeToVisit}
Safety: ${activity.safetyTips.join("; ")}
`;

  try {
    const response = await fetch(AI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: prompt,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with ${response.status}`);
    }

    const data = await response.json();
    const outputText = data.output_text?.trim();
    if (!outputText) {
      return fallback;
    }

    const parsed = JSON.parse(outputText);
    if (!Array.isArray(parsed.pros) || !Array.isArray(parsed.cons) || typeof parsed.summary !== "string") {
      return fallback;
    }

    return parsed;
  } catch (error) {
    console.warn("Safari AI pros/cons fallback:", error.message);
    return fallback;
  }
}
