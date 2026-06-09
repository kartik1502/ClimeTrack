import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import compression from "compression";

dotenv.config();

const app = express();
const PORT = 3000;

// Secure IP resolution behind load balancers/proxies
app.set("trust proxy", 1);

// Enable gzip compression for lightning-fast speeds
app.use(compression());

// Security Standard HTTP Headers
app.use((req, res, next) => {
  // Prevent MIME type sniffing
  res.setHeader("X-Content-Type-Options", "nosniff");
  // Clickjacking mitigation within standard contexts
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  // Reflect XSS protection
  res.setHeader("X-XSS-Protection", "1; mode=block");
  // Limit referrer leaks
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Strict Content-Security-Policy (CSP)
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: blob: https:; " +
    "connect-src 'self' https://generativelanguage.googleapis.com"
  );

  // Strict-Transport-Security (HSTS) for strict browser HTTPS enforcement
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }

  next();
});

// JSON body payload size ceiling (helps prevent large, malicious payload memory leaks)
app.use(express.json({ limit: "15kb" }));

// Lightweight client IP-based rate limiter middleware to prevent DoS attacks on Gemini
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 15; // Allow at most 15 insight generations per minute per client IP

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || "unknown-ip";
  const now = Date.now();
  
  const record = ipRequestCounts.get(ip);
  if (!record || now > record.resetTime) {
    ipRequestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS
    });
    return next();
  }
  
  if (record.count >= MAX_REQUESTS_PER_MINUTE) {
    return res.status(429).json({
      error: "Too many carbon insight requests. Please wait a brief moment and retry."
    });
  }
  
  record.count++;
  next();
};

// In-memory cache for Gemini insights to avoid redundant API calls
interface CacheEntry {
  data: any;
  expiresAt: number;
}
const insightsCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

// Periodic cleanup interval to evict expired cache entries and rate limits to avoid memory leaks
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
setInterval(() => {
  const now = Date.now();
  // Evict rate limits
  for (const [ip, record] of ipRequestCounts.entries()) {
    if (now > record.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
  // Evict cached insights
  for (const [key, entry] of insightsCache.entries()) {
    if (now > entry.expiresAt) {
      insightsCache.delete(key);
    }
  }
}, CLEANUP_INTERVAL_MS);

// Initialize Gemini client securely server-side with AI Studio custom UA
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY environment variable is not defined. AI functionality will be simulated.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// API: Generate personalized carbon insights using Gemini with Rate Limiter
app.post("/api/insights", rateLimiter, async (req, res) => {
  try {
    const { footprint, completedActionsCount } = req.body;
    
    if (!footprint || typeof footprint !== "object") {
      return res.status(400).json({ error: "Invalid footprint format parsed" });
    }

    // Strict numerical parsing, sanitization, and safety boundary constraints
    const carDistance = Math.min(100000, Math.max(0, Number(footprint.carDistance) || 0));
    const carEfficiency = Math.min(1000, Math.max(0.1, Number(footprint.carEfficiency) || 15)); // Guard against division-by-zero NaN
    const publicTransitDistance = Math.min(100000, Math.max(0, Number(footprint.publicTransitDistance) || 0));
    const flightHours = Math.min(1000, Math.max(0, Number(footprint.flightHours) || 0));
    const electricityUsage = Math.min(100000, Math.max(0, Number(footprint.electricityUsage) || 0));
    const gasUsage = Math.min(100000, Math.max(0, Number(footprint.gasUsage) || 0));
    const wasteRecyclingRate = Math.min(100, Math.max(0, Number(footprint.wasteRecyclingRate) || 0));
    
    // Strict allowed string whitelist to fully mitigate prompt injection attempts
    const validDiets = ["vegan", "vegetarian", "balanced", "meat-heavy"];
    const dietType = validDiets.includes(footprint.dietType) ? footprint.dietType : "balanced";
    
    const validShopping = ["minimalist", "moderate", "shopaholic"];
    const shoppingHabits = validShopping.includes(footprint.shoppingHabits) ? footprint.shoppingHabits : "moderate";

    const validatedCompletedActions = Math.min(100, Math.max(0, Number(completedActionsCount) || 0));

    // Cache lookup by normalized input payload key
    const cacheKey = JSON.stringify({
      carDistance,
      carEfficiency,
      publicTransitDistance,
      flightHours,
      electricityUsage,
      gasUsage,
      wasteRecyclingRate,
      dietType,
      shoppingHabits,
      validatedCompletedActions
    });

    const cachedEntry = insightsCache.get(cacheKey);
    if (cachedEntry && Date.now() < cachedEntry.expiresAt) {
      return res.json(cachedEntry.data);
    }

    // Dynamic clean mathematical calculations with sanitized, validated attributes
    const electricityCo2 = electricityUsage * 0.38; // kg/month
    const gasCo2 = gasUsage * 5.3; // kg/month
    const carCo2 = carDistance && carEfficiency ? (carDistance / carEfficiency) * 2.31 : 0; // kg/month (Petrol Ltr equivalent)
    const publicTransitCo2 = publicTransitDistance * 0.08; // kg/month
    const flightCo2 = (flightHours * 150) / 12; // average monthly kg CO2
    
    const dietMultipliers = { vegan: 125, vegetarian: 141, balanced: 183, "meat-heavy": 275 };
    const dietCo2 = dietMultipliers[dietType as keyof typeof dietMultipliers] || 183;

    const shoppingMultipliers = { minimalist: 50, moderate: 120, shopaholic: 250 };
    const shoppingCo2 = shoppingMultipliers[shoppingHabits as keyof typeof shoppingMultipliers] || 120;

    const totalCalculatedCo2 = electricityCo2 + gasCo2 + carCo2 + publicTransitCo2 + flightCo2 + dietCo2 + shoppingCo2;
    const monthlyFormatted = Math.round(totalCalculatedCo2);

    if (!ai) {
      // Fallback response: sanitized, exact simulated output
      const simulatedInsights = {
        summary: `Your estimated footprint is around ${monthlyFormatted} kg CO2 per month. Your primary contributors include energy emissions (${Math.round(electricityCo2 + gasCo2)} kg) and transportation (${Math.round(carCo2 + publicTransitCo2)} kg), while your ${dietType} diet is keeping food emissions moderate.`,
        personalizedTips: [
          {
            title: "Optimize Home Energy Efficiency",
            description: "Switching to high-efficiency LED lights and calibrating your HVAC setpoint 2°F cooler can decrease monthly emissions by up to 15%.",
            impact: "High Impact",
            actionCategory: "energy"
          },
          {
            title: "Transition commute habits",
            description: `Since your car transit produces ~${Math.round(carCo2)} kg CO2 monthly, substituting 2 trips/week with public options yields massive savings.`,
            impact: "High Impact",
            actionCategory: "transport"
          },
          {
            title: "Enhance Waste Recycling Habits",
            description: `${wasteRecyclingRate < 50 ? "Your recycling is currently at " + wasteRecyclingRate + "%. " : ""}Aim to recycle plastic or metals, and compost organic food scrap waste to divert carbon from municipal landfills.`,
            impact: "Medium Impact",
            actionCategory: "waste"
          }
        ],
        encouragingMessage: "Excellent work initiating your carbon footprint auditing! By acting on these tips and log-checking items, you will drive your emissions curve toward net-zero targets."
      };
      
      // Save simulated insight response to fast in-memory cache
      insightsCache.set(cacheKey, {
        data: simulatedInsights,
        expiresAt: Date.now() + CACHE_TTL_MS
      });

      return res.json(simulatedInsights);
    }

    const prompt = `
      You are an elite Sustainability Coach and Carbon Accounting specialist. 
      Analyze the user's monthly carbon emissions data and habits, and return tailored actions and deep insights.
      
      User Metrics Table (All values represent a single month except where noted):
      - Total Calculated Footprint: ${monthlyFormatted} kg CO2/month (approximately ${Math.round(monthlyFormatted * 12 / 1000 * 10) / 10} metric tons/year)
      - Driving Distance: ${carDistance} km/month at ${carEfficiency} km/Ltr (Generating ~${Math.round(carCo2)} kg CO2)
      - Public Transit: ${publicTransitDistance} km/month (Generating ~${Math.round(publicTransitCo2)} kg CO2)
      - Air Travel: ${flightHours} flight hours/year (Generating ~${Math.round(flightCo2)} kg CO2/month equivalent)
      - Electricity Consumption: ${electricityUsage} kWh/month (Generating ~${Math.round(electricityCo2)} kg CO2)
      - Natural Gas Consumption: ${gasUsage} therms/month (Generating ~${Math.round(gasCo2)} kg CO2)
      - Recycling Efficiency rate: ${wasteRecyclingRate}%
      - Nutritional Diet choice: ${dietType} diet (Estimated food footprint of ~${dietCo2} kg CO2)
      - Consumer habits: ${shoppingHabits} spending style (Estimated product footprint of ~${shoppingCo2} kg CO2)
      
      User Engagement State:
      - Has successfully logged ${validatedCompletedActions} eco-actions.

      Generate custom recommendations and an encouraging message. You must strictly output the response in structured JSON format matching the schema provided. Make the language highly specific to these numbers (e.g. quote their numbers, compare them to standard national averages of ~1300 kg CO2/month, and offer hyper-targeted tips). Make sure it feels professional, inspiring, and completely customized.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A summary evaluating the user's footprint against national averages and calling out their biggest emission vector.",
            },
            personalizedTips: {
              type: Type.ARRAY,
              description: "Three highly action-oriented, personalized tips targeting their specific highest emission areas.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "A catchy, short action item title (e.g. Upgrade to Smart Thermostat)" },
                  description: { type: Type.STRING, description: "A highly customized and mathematically-rooted tip context." },
                  impact: { type: Type.STRING, description: "Must be 'High Impact', 'Medium Impact', or 'Low Impact'" },
                  actionCategory: { type: Type.STRING, description: "Must be 'transport', 'energy', 'food', 'waste', or 'lifestyle'" }
                },
                required: ["title", "description", "impact", "actionCategory"]
              }
                },
            encouragingMessage: {
              type: Type.STRING,
              description: "A powerful, positive conclusion that inspires and challenges the user to keep progressing."
            }
          },
          required: ["summary", "personalizedTips", "encouragingMessage"]
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Empty response from AI");
    }

    const parsedResponse = JSON.parse(textOutput.trim());
    
    // Save generated insight response to fast in-memory cache
    insightsCache.set(cacheKey, {
      data: parsedResponse,
      expiresAt: Date.now() + CACHE_TTL_MS
    });

    return res.json(parsedResponse);

  } catch (error) {
    console.error("Error generating Gemini insights:", error);
    return res.status(500).json({ error: "Failed to compile AI carbon insights. Please retry." });
  }
});

// Setup Vite & Static Assets serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server starting on http://localhost:${PORT}`);
  });
}

startServer();

