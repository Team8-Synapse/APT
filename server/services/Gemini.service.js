const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Universal AI Service
 * Supports: Official Google Gemini SDK & OpenRouter (OpenAI-compatible)
 */
class AIService {
  constructor() {
    // Prioritize Gemini API Key if both exist
    this.useOpenRouter = !!process.env.OPENROUTER_API_KEY && !process.env.GEMINI_API_KEY;
    this.apiKey = this.useOpenRouter ? process.env.OPENROUTER_API_KEY : process.env.GEMINI_API_KEY;
    
    // Default models
    this.geminiModel = process.env.GEMINI_MODEL || "gemini-1.5-flash"; 
    this.openRouterModel = process.env.OPENROUTER_MODEL || "google/gemini-1.5-flash";

    if (!this.apiKey) {
      console.warn("AI SERVICE: No API Key found in .env (GEMINI_API_KEY or OPENROUTER_API_KEY)");
    }

    if (this.useOpenRouter) {
      console.log("AI SERVICE: Initialized using OpenRouter");
      this.openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: this.apiKey,
        defaultHeaders: {
          "HTTP-Referer": "https://amrita-placement-tracker.vercel.app",
          "X-Title": "Amrita Placement Tracker",
        }
      });
    } else {
      console.log("AI SERVICE: Initialized using Official Gemini SDK");
      this.genAI = new GoogleGenerativeAI(this.apiKey || "");
      this.model = this.genAI.getGenerativeModel(
        { model: this.geminiModel }
      );
    }
  }

  /**
   * Core generation method used by all features
   * @param {string} prompt - The main prompt
   * @param {string} systemInstruction - Optional system context
   * @param {boolean} isJson - Whether to expect JSON response (OpenRouter feature)
   */
  async generateContent(prompt, systemInstruction = "", isJson = false) {
    if (!this.apiKey) {
        throw new Error("AI features setup required: Please add GEMINI_API_KEY or OPENROUTER_API_KEY to .env");
    }

    try {
      if (this.useOpenRouter) {
        const messages = [];
        if (systemInstruction) {
            messages.push({ role: "system", content: systemInstruction });
        }
        messages.push({ role: "user", content: prompt });

        const completion = await this.openai.chat.completions.create({
          model: this.openRouterModel,
          messages,
          response_format: isJson ? { type: "json_object" } : undefined
        });

        return completion.choices[0].message.content;
      } else {
        // Gemini SDK
        const fullPrompt = systemInstruction ? `${systemInstruction}\n\nUser Query: ${prompt}` : prompt;
        try {
            const result = await this.model.generateContent(fullPrompt);
            return result.response.text();
        } catch (err) {
            if (err.status === 404) {
                console.log("Model not found, fetching available models to fallback...");
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${this.apiKey}`);
                const data = await response.json();
                const availableModels = data.models || [];
                const targetModel = availableModels.find(m => m.name.includes("flash") && m.supportedGenerationMethods.includes("generateContent")) 
                                 || availableModels.find(m => m.name.includes("pro") && m.supportedGenerationMethods.includes("generateContent"))
                                 || availableModels[0];
                
                if (targetModel) {
                    const newModelName = targetModel.name.replace('models/', '');
                    console.log(`Falling back to model: ${newModelName}`);
                    this.geminiModel = newModelName;
                    this.model = this.genAI.getGenerativeModel({ model: newModelName });
                    const result = await this.model.generateContent(fullPrompt);
                    return result.response.text();
                }
            }
            throw err;
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      throw error;
    }
  }

  // --- Feature Specific Wrappers ---

  async generateSummary(text) {
    const prompt = `Please provide a concise summary in bullet points for the following content. Keep it professional and focused on key learning points for a student:\n\n${text}`;
    return this.generateContent(prompt, "You are a professional educational summarizer.");
  }

  async askWithContext(question, context, sourceName = "the provided material") {
    const system = `You are an AI Career Advisor at Amrita Vishwa Vidyapeetham. Answer concisely and directly — do NOT greet the user or introduce yourself.`;
    const prompt = `A student is asking a question based on a material titled "${sourceName}".
    
    Material Context:
    "${context}"
    
    Question:
    "${question}"
    
    Instructions:
    1. Reply directly without greeting.
    2. If found in material, state: "Based on ${sourceName}, ..."
    3. If not found, provide general info and state: "I couldn't find this in ${sourceName}, but..."`;
    
    return this.generateContent(prompt, system);
  }

  async askWithPlacementData(question, placementData) {
    // Simplified RAG helper
    const prompt = `Placement Data Context: ${JSON.stringify(placementData)}\n\nQuestion: ${question}`;
    const system = "You are an AI Career Advisor at Amrita with access to real placement statistics. Answer directly with data.";
    return this.generateContent(prompt, system);
  }
}

module.exports = new AIService();
