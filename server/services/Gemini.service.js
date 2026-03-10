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

    const prompt = `You are an AI Career Advisor at Amrita Vishwa Vidyapeetham. Answer concisely and directly — do NOT greet the user or introduce yourself.
A student is asking a question based on a document/material titled "${sourceName}".

Material Context:
"${context}"

Question:
"${question}"

Instructions:
1. Reply directly to the question without any greeting or self-introduction.
2. If the answer is found in the material, provide it and state: "Based on ${sourceName}, ..."
3. If the answer is NOT found in the material, provide a general helpful answer and state: "I couldn't find this in ${sourceName}, but here is some general information..."
4. Keep the tone professional, encouraging, and concise.`;

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
    const prompt = `You are an AI Career Advisor at Amrita Vishwa Vidyapeetham. Answer concisely and directly — do NOT greet the user, say "Hello", or introduce yourself.
Student Question: "${question}"
Reply directly to the question. Keep the response professional and helpful. You may briefly mention that the student can upload notes or materials for more specific guidance.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini General Error:", error);
      throw new Error("Failed to get response from AI.");
    }
  }

  /**
   * Answers placement-related questions using real student data from the DB (RAG).
   * @param {string} question 
   * @param {Object} placementData  - structured context built from MongoDB
   */
  async askWithPlacementData(question, placementData) {
    const { type, company, students, totalPlaced, allCompanies } = placementData;

    const aggregate = (list) => {
      const skillCount = {}, certCount = {}, deptCount = {}, roleCount = {};
      let cgpaSum = 0, cgpaCount = 0;
      const ctcList = [];

      for (const s of list) {
        if (s.cgpa) { cgpaSum += s.cgpa; cgpaCount++; }
        if (s.offeredCTC) ctcList.push(s.offeredCTC);
        (s.skills || []).forEach(sk => {
          const key = (sk.name || '').toLowerCase().trim();
          if (key) skillCount[key] = (skillCount[key] || 0) + 1;
        });
        (s.certifications || []).forEach(c => {
          if (c && c.trim()) certCount[c.trim()] = (certCount[c.trim()] || 0) + 1;
        });
        if (s.department) deptCount[s.department] = (deptCount[s.department] || 0) + 1;
        if (s.offeredRole) roleCount[s.offeredRole] = (roleCount[s.offeredRole] || 0) + 1;
      }

      const n = list.length;
      const avgCgpa = cgpaCount > 0 ? (cgpaSum / cgpaCount).toFixed(2) : 'N/A';
      const avgCTC = ctcList.length > 0
        ? (ctcList.reduce((a, b) => a + b, 0) / ctcList.length / 100000).toFixed(2)
        : null;

      const topSkills = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([skill, cnt]) => `  - ${skill}: ${cnt}/${n} students (${Math.round(cnt / n * 100)}%)`);

      const topCerts = Object.entries(certCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([cert, cnt]) => `  - ${cert} (${cnt} students)`);

      return { n, avgCgpa, avgCTC, topSkills, topCerts, deptCount, roleCount };
    };

    let dataContext = '';

    if (type === 'company_analysis') {
      const n = students.length;
      if (n === 0) {
        dataContext = `No students in the current database have been placed at "${company}" yet. ` +
          `This may mean the company has not visited campus or the data has not been recorded. ` +
          `Total companies with placement data: ${allCompanies.filter(Boolean).join(', ') || 'none'}.`;
      } else {
        const { avgCgpa, avgCTC, topSkills, topCerts, deptCount, roleCount } = aggregate(students);
        dataContext = `REAL PLACEMENT DATA — ${company.toUpperCase()} (${n} student${n > 1 ? 's' : ''} placed)

TOP SKILLS among placed students:
${topSkills.length > 0 ? topSkills.join('\n') : '  - No skill data recorded'}

CERTIFICATIONS held by placed students:
${topCerts.length > 0 ? topCerts.join('\n') : '  - No certification data recorded'}

ACADEMIC PROFILE:
  - Average CGPA: ${avgCgpa}
  - Average CTC: ${avgCTC ? `₹${avgCTC} LPA` : 'Not recorded'}

DEPARTMENTS: ${Object.entries(deptCount).map(([d, c]) => `${d} (${c})`).join(', ') || 'N/A'}
ROLES OFFERED: ${Object.entries(roleCount).map(([r, c]) => `${r} (${c})`).join(', ') || 'N/A'}`;
      }
    } else if (type === 'general_stats') {
      const { n, avgCgpa, topSkills } = aggregate(students);
      const companyBreakdown = {};
      students.forEach(s => {
        if (s.offeredCompany) companyBreakdown[s.offeredCompany] = (companyBreakdown[s.offeredCompany] || 0) + 1;
      });
      const topCompanies = Object.entries(companyBreakdown)
        .sort((a, b) => b[1] - a[1])
        .map(([c, cnt]) => `  - ${c}: ${cnt} student${cnt > 1 ? 's' : ''}`);

      dataContext = `OVERALL PLACEMENT STATISTICS

Total placed students: ${n}
Total companies: ${allCompanies.filter(Boolean).length}

PLACEMENTS BY COMPANY:
${topCompanies.join('\n') || '  - No data available'}

TOP SKILLS across all placed students:
${topSkills.join('\n') || '  - No skill data'}

Average CGPA of placed students: ${avgCgpa}`;
    }

    const prompt = `You are an AI Career Advisor at Amrita Vishwa Vidyapeetham with access to the real-time placement database. Answer directly — do NOT greet the user, say "Hello", or introduce yourself.

REAL-TIME DATABASE DATA:
${dataContext}

Student Question: "${question}"

Instructions:
1. Reply directly to the question without any greeting or self-introduction.
2. Answer specifically using the real data above. Cite actual numbers and percentages.
3. If the question is about skills for a company, rank them clearly from most to least common and explain why each matters for that role.
4. Give concrete, actionable advice on how to build the required skills.
5. If data is limited or a company is not yet in the database, mention that and supplement with general industry knowledge for that company.
6. Keep the tone professional, encouraging, and concise.`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Gemini Placement RAG Error:", error);
      throw new Error("Failed to get AI response.");
    }
  }
}

module.exports = new GeminiService();
