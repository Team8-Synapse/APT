const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Service for Gemini AI interactions.
 */
class GeminiService {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  }

  /**
   * Generates a bulleted summary of the provided text.
   * @param {string} text 
   * @returns {Promise<string>}
   */
  async generateSummary(text) {
    console.log("DEBUG_MARKER: GeminiService.generateSummary called");
    
    // Total protection: Convert any input to string and then trim
    const textToProcess = String(text || '').trim();
    
    if (textToProcess.length === 0) {
      console.warn("DEBUG_MARKER: No content to summarize");
      return "No content to summarize found in the document.";
    }
    
    const prompt = `Please provide a concise summary in bullet points for the following content. Keep it professional and focused on key learning points for a student:\n\n${textToProcess}`;
    
    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("DEBUG_MARKER: Gemini Summary Error:", error);
      // Handle rate limit errors with a single retry after delay
      if (error.status === 429) {
        console.log("DEBUG_MARKER: Rate limited, retrying in 5 seconds...");
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
          const retryResult = await this.model.generateContent(prompt);
          const retryResponse = await retryResult.response;
          return retryResponse.text();
        } catch (retryError) {
          throw new Error("API quota exceeded. Please generate a new API key from https://aistudio.google.com/apikey and update GEMINI_API_KEY in server/.env");
        }
      }
      throw new Error(`AI generated an error: ${error.message}`);
    }
  }

  /**
   * Answers a question based on a specific context (document or notes).
   * @param {string} question 
   * @param {string} context 
   * @param {string} sourceName 
   * @returns {Promise<string>}
   */
  async askWithContext(question, context, sourceName = "the provided material") {
    const contextStr = String(context || '').trim();
    const questionStr = String(question || '').trim();

    if (contextStr.length === 0) {
        return this.askGeneral(questionStr);
    }

    const prompt = `You are an AI Career Advisor at Amrita Vishwa Vidyapeetham. 
A student is asking a question based on a document/material titled "${sourceName}".

Material Context:
"${context}"

Question:
"${question}"

Instructions:
1. If the answer is found in the material, provide the answer and clearly state: "Based on ${sourceName}, ..."
2. If the answer is NOT found in the material, provide a general helpful answer and clearly state: "I couldn't find the answer to this in ${sourceName}, but here is some general information..."
3. Keep the tone professional, encouraging, and helpful.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Q&A Error:", error);
      throw new Error("Failed to get response from AI.");
    }
  }

  /**
   * General fallback for questions when no context is provided yet.
   * @param {string} question 
   */
  async askGeneral(question) {
    const prompt = `You are an AI Career Advisor at Amrita Vishwa Vidyapeetham.
Student Question: "${question}"
Provide a helpful, professional response related to placement preparation. Mention that they can also summarize their notes or uploaded materials for more specific help.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini General Error:", error);
      throw new Error("Failed to get response from AI.");
    }
  }
}

module.exports = new GeminiService();
