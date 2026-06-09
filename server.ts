import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

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

// API: Generate personalized carbon insights using Gemini
app.post("/api/insights", async (req, res) => {
  try {
    const { footprint, completedActionsCount, currentTotalScore } = req.body;
    
    if (!footprint) {
      return res.status(400).json({ error: "Footprint data is required" });
    }

    // Format metrics to present to Gemini
    const {
      carDistance,
      carEfficiency,
      publicTransitDistance,
      flightHours,
      electricityUsage,
      gasUsage,
      wasteRecyclingRate,
      dietType,
      shoppingHabits
    } = footprint;

    // Fast static math to send context to Gemini
    const electricityCo2 = electricityUsage * 0.38; // kg/month
    const gasCo2 = gasUsage * 5.3; // kg/month
    const carCo2 = carDistance && carEfficiency ? (carDistance / carEfficiency) * 8.89 : 0; // kg/month
    const publicTransitCo2 = publicTransitDistance * 0.14; // kg/month
    const flightCo2 = (flightHours * 150) / 12; // average monthly kg CO2
    
    const dietMultipliers = { vegan: 125, vegetarian: 141, balanced: 183, 'meat-heavy': 275 };
    const dietCo2 = dietMultipliers[dietType as keyof typeof dietMultipliers] || 183;

    const shoppingMultipliers = { minimalist: 50, moderate: 120, shopaholic: 250 };
    const shoppingCo2 = shoppingMultipliers[shoppingHabits as keyof typeof shoppingMultipliers] || 120;

    const totalCalculatedCo2 = electricityCo2 + gasCo2 + carCo2 + publicTransitCo2 + flightCo2 + dietCo2 + shoppingCo2;
    const monthlyFormatted = Math.round(totalCalculatedCo2);

    if (!ai) {
      // Return a very realistic, simulated, highly high-quality fallback if no API key is provided
      const simulatedInsights = {
        summary: `Your estimated footprint is around ${monthlyFormatted} kg CO2 per month. Your home energy emissions (${Math.round(electricityCo2 + gasCo2)} kg) and transportation (${Math.round(carCo2 + publicTransitCo2)} kg) represent your primary contribution areas, with your ${dietType} diet type keeping food emissions moderate.`,
        personalizedTips: [
          {
            title: "Optimize Home Energy Efficiency",
            description: "Switching to LED bulbs and setting your thermostat 2 degrees cooler in winter can trim your energy footprint by up to 15%.",
            impact: "High Impact",
            actionCategory: "energy"
          },
          {
            title: "Consider Commute Alternatives",
            description: `Since your car travel generates roughly ${Math.round(carCo2)} kg CO2, incorporating carpooling or active transit twice a week would yield massive monthly improvements.`,
            impact: "High Impact",
            actionCategory: "transport"
          },
          {
            title: "Enhance Waste Sorting",
            description: `${wasteRecyclingRate < 50 ? "Your recycling rate is at " + wasteRecyclingRate + "%. " : ""}Aim to separate recyclables and compost organic matter to systematically lower landfill methane output.`,
            impact: "Medium Impact",
            actionCategory: "waste"
          }
        ],
        encouragingMessage: "Wonderful job taking the first step to understand your environment impact! By implementing even small tweaks to your routine and logging achievements, you will stay firmly on the grid to reach key sustainability milestones."
      };
      return res.json(simulatedInsights);
    }

    const prompt = `
      You are an elite Sustainability Coach and Carbon Accounting specialist. 
      Analyze the user's monthly carbon emissions data and habits, and return tailored actions and deep insights.
      
      User Metrics Table (All values represent a single month except where noted):
      - Total Calculated Footprint: ${monthlyFormatted} kg CO2/month (approximately ${Math.round(monthlyFormatted * 12 / 1000 * 10) / 10} metric tons/year)
      - Driving Distance: ${carDistance} miles/month at ${carEfficiency} MPG (Generating ~${Math.round(carCo2)} kg CO2)
      - Public Transit: ${publicTransitDistance} miles/month (Generating ~${Math.round(publicTransitCo2)} kg CO2)
      - Air Travel: ${flightHours} flight hours/year (Generating ~${Math.round(flightCo2)} kg CO2/month equivalent)
      - Electricity Consumption: ${electricityUsage} kWh/month (Generating ~${Math.round(electricityCo2)} kg CO2)
      - Natural Gas Consumption: ${gasUsage} therms/month (Generating ~${Math.round(gasCo2)} kg CO2)
      - Recycling Efficiency rate: ${wasteRecyclingRate}%
      - Nutritional Diet choice: ${dietType} diet (Estimated food footprint of ~${dietCo2} kg CO2)
      - Consumer habits: ${shoppingHabits} spending style (Estimated product footprint of ~${shoppingCo2} kg CO2)
      
      User Engagement State:
      - Has successfully logged ${completedActionsCount} eco-actions.

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
