const aiService = require('../services/AI.service');
const geminiService = require('../services/Gemini.service');
const fileParser = require('../services/FileParser');
const StudentProfile = require('../models/StudentProfile');
const Resource = require('../models/Resource');
const PlacementDrive = require('../models/PlacementDrive');
const Note = require('../models/Note');

// Helper to clean AI response (remove markdown blocks if SDK fails to)
const cleanJsonResponse = (text) => {
    let clean = text.trim();
    if (clean.startsWith('```json')) clean = clean.replace(/```json/g, '').replace(/```/g, '').trim();
    else if (clean.startsWith('```')) clean = clean.replace(/```/g, '').trim();
    return clean;
};

exports.getInsights = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).send({ error: 'Profile not found.' });

        const readinessScore = aiService.calculateReadinessScore(profile);
        const recommendations = await aiService.getRecommendations(profile);

        const prompt = `A student has a placement readiness score of ${readinessScore}/100.
        Their CGPA is ${profile.cgpa}. Skills: ${profile.skills.map(s => s.name).join(', ')}.
        Eligible companies: ${recommendations.slice(0, 3).map(r => r.company).join(', ')}.
        Give a short, encouraging 2-sentence paragraph on focus areas.`;

        const insightsText = await geminiService.generateContent(prompt, "You are an AI Career Advisor for Amrita University.");

        res.send({ readinessScore, recommendations, insights: insightsText });
    } catch (e) {
        console.error("Insights Error:", e);
        res.status(500).send({ error: "Failed to load insights." });
    }
};

exports.getChatResponse = async (req, res) => {
    try {
        const { message, context, sourceName } = req.body;

        if (context) {
            const response = await geminiService.askWithContext(message, context, sourceName);
            return res.send({ response });
        }

        // Generic career chat context
        const sysPrompt = `You are a professional AI Career Advisor for Amrita Vishwa Vidyapeetham.
        Keep your response concise and actionable. Avoid using asterisks if possible.`;
        
        const result = await geminiService.generateContent(message, sysPrompt);
        res.send({ response: result });
    } catch (e) {
        res.status(500).send({ error: "AI neural engine error. Please try again." });
    }
};

exports.generateMockInterview = async (req, res) => {
    try {
        const { company, role } = req.body;
        const prompt = `Generate 5 interview questions for ${company || 'a tech firm'} role: ${role || 'Engineer'}. 
        Return ONLY a JSON array of objects: [{"id":1, "question":"...", "type":"Technical", "difficulty":"Medium"}]`;

        const response = await geminiService.generateContent(prompt, "You are a technical interviewer.", true);
        res.send({ questions: JSON.parse(cleanJsonResponse(response)) });
    } catch (e) {
        res.status(500).send({ error: "Failed to generate interview." });
    }
};

exports.evaluateMockAnswer = async (req, res) => {
    try {
        const { question, answer } = req.body;
        const prompt = `Question: "${question}"\nCandidate Answer: "${answer}"\n
        Evaluate out of 10. Return ONLY JSON: {"score": 7, "feedback": "..."}`;

        const response = await geminiService.generateContent(prompt, "Evaluate candidate answers.", true);
        res.send(JSON.parse(cleanJsonResponse(response)));
    } catch (e) {
        res.status(500).send({ error: "Evaluation failed." });
    }
};

exports.interviewChat = async (req, res) => {
    try {
        const { company, role, type, currentAnswer, questionCount } = req.body;
        const prompt = `Candidate is applying for ${role} at ${company}. Question count: ${questionCount}. 
        Answer: "${currentAnswer || 'N/A'}".
        Ask the NEXT question or conclude if count >= 5.
        Return ONLY JSON: {"feedback": "...", "nextQuestion": "...", "isComplete": false, "finalScore": null}`;

        const response = await geminiService.generateContent(prompt, "Conversational interviewer.", true);
        res.send(JSON.parse(cleanJsonResponse(response)));
    } catch (e) {
        res.status(500).send({ error: "Processing failed." });
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        const { targetRole, resumeText: bodyText } = req.body;
        let resumeText = bodyText;

        if (req.file) {
            resumeText = await fileParser.parseFile(req.file.buffer, 'pdf'); // Simplified for buffer if needed, or use existing logic
        }

        if (!resumeText) return res.status(400).send({ error: "Could not read resume text." });

        const prompt = `Target Role: ${targetRole}\nResume: ${resumeText}\n
        Analyze ATS score and give tips. Return ONLY JSON: {"score": 85, "strengths": [], "weaknesses": [], "tips": []}`;

        const response = await geminiService.generateContent(prompt, "Resume ATS Analyzer.", true);
        res.send(JSON.parse(cleanJsonResponse(response)));
    } catch (e) {
        res.status(500).send({ error: "Analysis failed." });
    }
};

exports.companyResearch = async (req, res) => {
    try {
        const { companyName, role } = req.body;
        const prompt = `Research ${companyName} for ${role}. Return ONLY JSON with fields: culture, interviewProcess, commonTopics, tips.`;

        const response = await geminiService.generateContent(prompt, "Career Researcher.", true);
        res.send(JSON.parse(cleanJsonResponse(response)));
    } catch (e) {
        res.status(500).send({ error: "Research failed." });
    }
};

exports.adminInsights = async (req, res) => {
    try {
        const total = await StudentProfile.countDocuments();
        const placed = await StudentProfile.countDocuments({ placementStatus: 'placed' });
        
        const prompt = `Stats: Total ${total}, Placed ${placed}. Give insights. Return ONLY JSON with fields: summary, predictions, actionPlan.`;
        const response = await geminiService.generateContent(prompt, "Head of Placements Assistant.", true);
        res.send(JSON.parse(cleanJsonResponse(response)));
    } catch (e) {
        res.status(500).send({ error: "Admin insights failed." });
    }
};

exports.summarizeResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).send({ error: "Resource not found" });

        const url = resource.links?.[0] || resource.link;
        if (!url) return res.status(400).send({ error: "No valid link" });

        const content = await fileParser.parseFile(url, resource.type);
        const summary = await geminiService.generateSummary(content);

        res.send({ summary, sourceName: resource.title, context: content });
    } catch (e) {
        res.status(500).send({ error: "Summarization failed." });
    }
};

exports.summarizeNotes = async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        if (!notes.length) return res.status(404).send({ error: "No notes found." });

        const combined = notes.map(n => `${n.name}\n${n.text}`).join('\n\n');
        const summary = await geminiService.generateSummary(combined);

        res.send({ summary, sourceName: "Your Notes", context: combined });
    } catch (e) {
        res.status(500).send({ error: "Notes summary failed." });
    }
};
