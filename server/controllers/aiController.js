const aiService = require('../services/AI.service');
const geminiService = require('../services/Gemini.service');
const fileParser = require('../services/FileParser');
const StudentProfile = require('../models/StudentProfile');
const Resource = require('../models/Resource');
const Note = require('../models/Note');

exports.getInsights = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).send({ error: 'Profile not found. Please complete your profile first.' });

        const readinessScore = aiService.calculateReadinessScore(profile);
        const recommendations = await aiService.getRecommendations(profile);

        res.send({
            readinessScore,
            recommendations,
            insights: "Your readiness score is calculated based on your CGPA and skill set. Consider improving your technical skills to increase matching probability."
        });
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.getChatResponse = async (req, res) => {
    try {
        const { message, context, sourceName } = req.body;
        
        let response;
        if (context) {
            response = await geminiService.askWithContext(message, context, sourceName);
        } else {
            response = await geminiService.askGeneral(message);
        }
        
        res.send({ response });
    } catch (e) {
        console.error("Chat Response Error:", e);
        res.status(500).send({ error: "Failed to get AI response." });
    }
};

exports.summarizeResource = async (req, res) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) return res.status(404).send({ error: "Resource not found" });

        const url = resource.links?.[0] || resource.link;
        if (!url) return res.status(400).send({ error: "Resource has no valid link" });

        console.log(`Summarizing resource: ${resource.title} (${url})`);
        
        let content;
        try {
            content = await fileParser.parseFile(url, resource.type);
            console.log(`Parsed content length: ${content.length}`);
        } catch (parseErr) {
            console.error("Parsing Error:", parseErr);
            return res.status(500).send({ error: `Failed to parse file: ${parseErr.message}` });
        }

        try {
            const summary = await geminiService.generateSummary(content);
            res.send({ 
                summary, 
                sourceName: resource.title,
                context: content
            });
        } catch (geminiErr) {
            console.error("Gemini Error:", geminiErr);
            return res.status(500).send({ error: `AI Error: ${geminiErr.message}. Please check your API key.` });
        }
    } catch (e) {
        console.error("Summarize Resource Error:", e);
        res.status(500).send({ error: "Failed to summarize resource." });
    }
};

exports.summarizeNotes = async (req, res) => {
    try {
        console.log(`DEBUG_MARKER: Summarizing notes for user: ${req.user._id}`);
        const notes = await Note.find({ user: req.user._id });
        if (!notes || notes.length === 0) return res.status(404).send({ error: "No notes found to summarize." });

        const combinedNotes = notes.map(n => `Title: ${n.name}\nContent: ${n.text}`).join('\n\n---\n\n');
        console.log(`DEBUG_MARKER: Combined notes length: ${combinedNotes.length}`);
        
        try {
            const summary = await geminiService.generateSummary(combinedNotes);
            res.send({ 
                summary, 
                sourceName: "Your Personal Notes",
                context: combinedNotes
            });
        } catch (geminiErr) {
            console.error("DEBUG_MARKER: Gemini Notes Error:", geminiErr);
            return res.status(500).send({ error: `AI Error: ${geminiErr.message}` });
        }
    } catch (e) {
        console.error("DEBUG_MARKER: Summarize Notes Error:", e);
        res.status(500).send({ error: "Failed to summarize notes." });
    }
};
