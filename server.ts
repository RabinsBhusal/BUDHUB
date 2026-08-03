/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client to prevent crash on startup if API key is not present
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// AI Financial Coach Endpoint
app.post("/api/coach", async (req, res) => {
  try {
    const { messages, financialContext } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid request payload. Messages list is required." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (keyError: any) {
      // Return a friendly message if the user hasn't configured the API key yet
      return res.json({ 
        text: `Hello! I'm your AI Financial Coach. 🤖\n\nI'm ready to help you optimize your spending, track budgets, and master your financial goals! However, to run the real AI calculations, I need a **Gemini API Key**.\n\nPlease open the **Settings** menu in the top right of AI Studio, go to **Secrets**, and make sure **GEMINI_API_KEY** is configured. In the meantime, I can act as a simulated assistant to let you explore the platform! Let me know what you'd like to analyze.`
      });
    }

    // Format financial context for Gemini
    const contextStr = financialContext ? `
CURRENT FINANCIAL STATUS:
- Net Worth: £${financialContext.netWorth || 'N/A'}
- Accounts Overview: ${JSON.stringify(financialContext.accounts || [])}
- Active Budgets: ${JSON.stringify(financialContext.budgets || [])}
- Recent Transactions: ${JSON.stringify((financialContext.transactions || []).slice(0, 10))}
- Subscriptions Detected: ${JSON.stringify(financialContext.subscriptions || [])}
- Active Goals: ${JSON.stringify(financialContext.goals || [])}
` : '';

    const systemInstruction = `You are a premium AI Financial Coach, a senior fintech advisor.
Your tone is professional, encouraging, wise, clear, and action-oriented (like Revolut, Monzo, or Emma AI).
You help users:
1. Explain their spending and identify waste.
2. Find duplicate or unused subscriptions.
3. Suggest concrete savings, emergency fund, and investment advice.
4. Answer complex finance, tax, and investment questions.
5. Create budget recommendations.

Guidelines:
- Keep answers structured with bullets and markdown.
- Never mention internal code details, database details, or variable names.
- Since you are an advisory tool, always offer structured and practical steps.
- Use currency symbols matching the user context (default: £ for GBP).

${contextStr}
`;

    // Map the conversation messages to content format expected by SDK.
    // We use the simple generateContent method for simplicity or the chat API.
    // To support a conversational format easily with system instructions:
    const contents = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || "I was unable to analyze that. Please try asking in a different way.";
    res.json({ text: replyText });

  } catch (error: any) {
    console.error("AI Coach Error:", error);
    res.status(500).json({ error: error.message || "Something went wrong during AI analysis." });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

async function startServer() {
  // Vite dev server middleware integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`AI Personal Finance Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
