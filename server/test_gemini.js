const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

async function testVersions() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const versions = ["v1", "v1beta"];
  const models = ["gemini-1.5-flash", "gemini-pro"];

  for (const v of versions) {
    for (const m of models) {
      try {
        const model = genAI.getGenerativeModel({ model: m }, { apiVersion: v });
        await model.generateContent("hi");
        console.log(`${m} on ${v}: SUCCESS`);
      } catch (e) {
        console.log(`${m} on ${v}: FAIL - ${e.message}`);
      }
    }
  }
}

testVersions();
