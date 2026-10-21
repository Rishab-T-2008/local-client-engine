import { NextRequest, NextResponse } from "next/server";

interface ScopeShieldBody {
  originalScope: string;
  clientMessage: string;
  hourlyRate?: number | string;
  customApiKey?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ScopeShieldBody = await req.json().catch(() => ({}));
    const { originalScope, clientMessage, hourlyRate = 75, customApiKey } = body;

    if (!originalScope || typeof originalScope !== "string" || !originalScope.trim()) {
      return NextResponse.json(
        { error: "Original agreed scope is required." },
        { status: 400 }
      );
    }

    if (!clientMessage || typeof clientMessage !== "string" || !clientMessage.trim()) {
      return NextResponse.json(
        { error: "Client message or request is required." },
        { status: 400 }
      );
    }

    const apiKey = (customApiKey && customApiKey.trim()) || process.env.GEMINI_API_KEY;
    if (!apiKey || typeof apiKey !== "string" || !apiKey.trim()) {
      return NextResponse.json(
        {
          error:
            "Google Gemini API key required. Please enter your API key in Settings or set GEMINI_API_KEY.",
        },
        { status: 400 }
      );
    }

    const numericRate = Math.max(1, typeof hourlyRate === "number" ? hourlyRate : parseFloat(hourlyRate) || 75);

    const prompt = `You are a world-class freelance agency operations director and client diplomat.
Your goal is to inspect an incoming client request against the originally contracted scope, determine whether it represents scope creep, and draft an impeccably polite, firm, and profitable response.

AGREED ORIGINAL SCOPE:
"""
${originalScope.trim()}
"""

INCOMING CLIENT REQUEST:
"""
${clientMessage.trim()}
"""

HOURLY RATE:
$${numericRate}/hr

INSTRUCTIONS:
1. Determine if this request is "IN_SCOPE" or "OUT_OF_SCOPE".
2. If OUT_OF_SCOPE:
   - Estimate realistic additional hours (integer).
   - Compute suggestedUpsellPrice: (estimatedExtraHours * ${numericRate}).
   - Draft a diplomatic reply that thanks the client, validates their idea as a great strategic direction, professionally explains that it is beyond the contracted deliverables for this milestone, and gives them the option to approve the change order for $X or roll it into a Phase 2 sprint.
3. If IN_SCOPE:
   - estimatedExtraHours = 0.
   - suggestedUpsellPrice = "$0".
   - Draft a friendly reply confirming it's already covered under our active agreement and providing a brief ETA.

Respond with strict JSON following this schema:
{
  "status": "IN_SCOPE" or "OUT_OF_SCOPE",
  "reasoning": "string (concise explanation)",
  "estimatedExtraHours": number,
  "suggestedUpsellPrice": "string (e.g. '$600')",
  "diplomaticReply": "string (ready-to-send copy/paste message)"
}`;

    // Call Gemini REST API (with gemini-3.5-flash-lite & multi-model fallback)
    const models = [
      "gemini-3.5-flash-lite",
      "gemini-3-flash-preview",
      "gemini-3.8-flash",
      "gemini-flash-latest",
    ];
    let geminiData: any = null;
    let lastErrorMsg = "Gemini API error.";

    for (const model of models) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(
          apiKey.trim()
        )}`;

        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.3,
            },
          }),
        });

        if (geminiRes.ok) {
          geminiData = await geminiRes.json();
          break;
        }

        const errorText = await geminiRes.text();
        try {
          const parsed = JSON.parse(errorText);
          lastErrorMsg = parsed.error?.message || lastErrorMsg;
        } catch {}

        // If model not found (404), overloaded (503), rate limited (429), or server error (500+), try next fallback model
        if (geminiRes.status === 404 || geminiRes.status === 429 || geminiRes.status >= 500) {
          continue;
        }

        // For fatal client errors (e.g. 400 invalid API key), return immediately
        return NextResponse.json({ error: `Gemini API error: ${lastErrorMsg}` }, { status: geminiRes.status });
      } catch (fetchErr: any) {
        lastErrorMsg = fetchErr.message || "Network error connecting to Gemini API.";
        continue;
      }
    }

    if (!geminiData) {
      return NextResponse.json({ error: `Gemini API error: ${lastErrorMsg}` }, { status: 502 });
    }
    const rawContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json(
        { error: "No response received from AI model." },
        { status: 502 }
      );
    }

    let cleanJson = rawContent.trim();
    if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    }

    const output = JSON.parse(cleanJson);

    return NextResponse.json({
      success: true,
      data: {
        status: output.status === "IN_SCOPE" ? "IN_SCOPE" : "OUT_OF_SCOPE",
        reasoning: output.reasoning || "",
        estimatedExtraHours: typeof output.estimatedExtraHours === "number" ? output.estimatedExtraHours : 0,
        suggestedUpsellPrice: output.suggestedUpsellPrice || (output.estimatedExtraHours ? `$${output.estimatedExtraHours * numericRate}` : "$0"),
        diplomaticReply: output.diplomaticReply || "",
      },
    });
  } catch (err: any) {
    console.error("Error in /api/scope-shield:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze scope request." },
      { status: 500 }
    );
  }
}

