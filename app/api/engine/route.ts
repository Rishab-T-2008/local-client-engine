import { NextRequest, NextResponse } from "next/server";

interface EngineRequestBody {
  businessName: string;
  websiteUrl?: string;
  niche: string;
  serviceOffered: string;
  customApiKey?: string;
}

function cleanHtml(rawHtml: string): { title: string; description: string; textContent: string } {
  const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";

  const metaDescMatch =
    rawHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
    rawHtml.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const description = metaDescMatch ? metaDescMatch[1].trim() : "";

  let cleaned = rawHtml
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ");

  cleaned = cleaned.replace(/<[^>]+>/g, " ");

  cleaned = cleaned
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  cleaned = cleaned.replace(/\s+/g, " ").trim();
  const textContent = cleaned.slice(0, 3500);

  return { title, description, textContent };
}

async function scrapeWebsite(rawUrl?: string): Promise<{
  success: boolean;
  title: string;
  description: string;
  textContent: string;
  error?: string;
}> {
  if (!rawUrl || typeof rawUrl !== "string" || !rawUrl.trim()) {
    return {
      success: false,
      title: "",
      description: "",
      textContent: "No website URL provided. Analyzing standard industry conversion gaps and archetype barriers.",
    };
  }

  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = "https://" + targetUrl;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
        "Sec-Ch-Ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
        "Sec-Ch-Ua-Mobile": "?0",
        "Sec-Ch-Ua-Platform": '"macOS"',
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
      },
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let metaFallback = { title: "", description: "" };
      try {
        const errorHtml = await res.text();
        metaFallback = cleanHtml(errorHtml);
      } catch {}

      return {
        success: false,
        title: metaFallback.title || "",
        description: metaFallback.description || "",
        textContent: "Site blocked automated scraping — please paste text manually.",
        error: `HTTP ${res.status}`,
      };
    }

    const html = await res.text();
    const { title, description, textContent } = cleanHtml(html);

    return {
      success: true,
      title,
      description,
      textContent: textContent || "Site blocked automated scraping — please paste text manually.",
    };
  } catch (err: any) {
    clearTimeout(timeoutId);
    return {
      success: false,
      title: "",
      description: "",
      textContent: "Site blocked automated scraping — please paste text manually.",
      error: err.name === "AbortError" ? "Timeout after 6s" : err.message,
    };
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: EngineRequestBody = await req.json().catch(() => ({}));
    const { businessName, websiteUrl, niche, serviceOffered, customApiKey } = body;

    if (!businessName || typeof businessName !== "string" || !businessName.trim()) {
      return NextResponse.json(
        { error: "Business name is required to run the AI Closer Engine." },
        { status: 400 }
      );
    }

    const candidateKeys: string[] = [];
    if (customApiKey && customApiKey.trim()) {
      candidateKeys.push(customApiKey.trim());
    }
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
      const serverKey = process.env.GEMINI_API_KEY.trim();
      if (!candidateKeys.includes(serverKey)) {
        candidateKeys.push(serverKey);
      }
    }

    if (candidateKeys.length === 0) {
      return NextResponse.json(
        {
          error:
            "Google Gemini API key required. Please enter your API key in the top Settings drawer or configure GEMINI_API_KEY.",
        },
        { status: 400 }
      );
    }

    // 1. Scrape the website with 6-second timeout
    const scraped = await scrapeWebsite(websiteUrl);

    // 2. Prepare Gemini 2.5 Flash Prompt
    const systemPrompt = `You are an elite $50k/month Freelance Agency Strategist and Conversion Rate Optimization (CRO) closer.
Your job is to audit a prospect's website and generate a lethal, high-ticket outreach and proposal package that turns a cold lead into a signed client.

PROSPECT DETAILS:
- Business Name: ${businessName.trim()}
- Niche/Industry: ${niche || "Local Business"}
- Website URL: ${websiteUrl || "None"}
- Service Being Offered: ${serviceOffered || "High-Converting Website Redesign & Local SEO"}

SCRAPED WEBSITE DATA:
- Page Title: ${scraped.title || "N/A"}
- Meta Description: ${scraped.description || "N/A"}
- Page Text Content (First 3500 chars): ${scraped.textContent}
- Scrape Status: ${scraped.success ? "Successfully Scraped" : "Fallback/Unreachable (" + (scraped.error || "Blocked") + ")"}

INSTRUCTIONS:
You must output strict JSON conforming to this schema:
{
  "conversionScore": number (an integer between 25 and 78 representing their current website's CRO score out of 100 based on modern mobile/conversion standards),
  "auditWeaknesses": [
    {
      "title": "string (punchy, high-impact weakness name, e.g., 'Buried Mobile Call-To-Action')",
      "impact": "string (quantified business loss, e.g., 'Losing an estimated 35% of mobile visitors who can't book in 1 tap')",
      "fix": "string (concrete solution we will implement to fix it)"
    },
    {
      "title": "string",
      "impact": "string",
      "fix": "string"
    },
    {
      "title": "string",
      "impact": "string",
      "fix": "string"
    }
  ],
  "outreach": {
    "coldEmailSubject": "string (intriguing, personalized, low-friction subject line)",
    "coldEmailBody": "string (concise 4-paragraph email referencing their exact business, the specific weaknesses found, and a casual CTA offering a 90-second teardown video)",
    "instagramDm": "string (casual, friendly 3-sentence DM tailored for IG/LinkedIn/Twitter)",
    "loomScript": "string (exact 60-second video script structured with [0:00-0:15 Hook], [0:15-0:40 Specific Teardown], and [0:40-1:00 Casual Close])"
  },
  "proposalTiers": [
    {
      "name": "Starter One-Time",
      "price": "$950",
      "deliverables": ["string", "string", "string", "string"],
      "timeline": "7 Days"
    },
    {
      "name": "Growth Monthly Retainer (Recommended)",
      "price": "$1,850 / mo",
      "deliverables": ["string", "string", "string", "string", "string"],
      "timeline": "14 Days Launch + Ongoing Optimization"
    },
    {
      "name": "Full Studio Scale",
      "price": "$3,800 + $500/mo",
      "deliverables": ["string", "string", "string", "string", "string", "string"],
      "timeline": "21 Days"
    }
  ],
  "scopeShieldClause": "string (a bulletproof contractual clause protecting the freelancer from scope creep and defining change orders at $85+/hr)"
}`;

    // 3. Call Gemini REST API (with candidate keys & multi-model fallback)
    const models = [
      "gemini-3.5-flash-lite",
      "gemini-3-flash-preview",
      "gemini-3.8-flash",
      "gemini-flash-latest",
    ];
    let geminiData: any = null;
    let lastErrorMsg = "Google Gemini API error.";

    keyLoop: for (const apiKey of candidateKeys) {
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
                  parts: [{ text: systemPrompt }],
                },
              ],
              generationConfig: {
                responseMimeType: "application/json",
                temperature: 0.35,
              },
            }),
          });

          if (geminiRes.ok) {
            geminiData = await geminiRes.json();
            break keyLoop;
          }

          const errorText = await geminiRes.text();
          try {
            const parsedErr = JSON.parse(errorText);
            lastErrorMsg = parsedErr.error?.message || lastErrorMsg;
          } catch {}

          // If client key is invalid (400), break model loop to try server fallback key
          if (geminiRes.status === 400) {
            break;
          }

          // If model not found (404), overloaded (503), rate limited (429), or server error (500+), try next fallback model
          if (geminiRes.status === 404 || geminiRes.status === 429 || geminiRes.status >= 500) {
            continue;
          }
        } catch (fetchErr: any) {
          lastErrorMsg = fetchErr.message || "Network error connecting to Gemini API.";
          continue;
        }
      }
    }

    if (!geminiData) {
      return NextResponse.json({ error: `Gemini API error: ${lastErrorMsg}` }, { status: 502 });
    }
    const rawContent = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!rawContent) {
      return NextResponse.json(
        { error: "No response content generated by Gemini." },
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
      scraped: {
        success: scraped.success,
        title: scraped.title,
        url: websiteUrl,
      },
      data: output,
    });
  } catch (err: any) {
    console.error("Error in /api/engine:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process lead audit and proposal generation." },
      { status: 500 }
    );
  }
}

