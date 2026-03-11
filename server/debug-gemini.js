const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // There isn't a direct listModels in the SDK easily accessible without an authenticated client
    // But we can try to hit the discovery endpoint or just try a few model names
    
    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-latest", "gemini-pro", "gemini-1.0-pro"];
    
    for (const modelName of modelsToTry) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hi");
            console.log(`Model ${modelName} works! Response: ${result.response.text().substring(0, 20)}`);
        } catch (err) {
            console.log(`Model ${modelName} failed: ${err.message}`);
        }
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listModels();
