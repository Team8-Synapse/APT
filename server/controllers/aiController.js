const aiService = require('../services/AI.service');
const geminiService = require('../services/Gemini.service');
const fileParser = require('../services/FileParser');
const StudentProfile = require('../models/StudentProfile');
const Resource = require('../models/Resource');
const PlacementDrive = require('../models/PlacementDrive');
const Note = require('../models/Note');
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.getInsights = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).send({ error: 'Profile not found. Please complete your profile first.' });

        const readinessScore = aiService.calculateReadinessScore(profile);
        const recommendations = await aiService.getRecommendations(profile);

        let insightsText = "Your readiness score is calculated based on your CGPA and skill set. Consider improving your technical skills to increase matching probability.";

        if (process.env.GEMINI_API_KEY) {
            try {
                const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

                const prompt = `You are an AI Career Advisor for Amrita Vishwa Vidyapeetham students. 
                A student has a placement readiness score of ${readinessScore}/100.
                Their CGPA is ${profile.cgpa}. Their skills are: ${profile.skills.map(s => s.name).join(', ')}.
                They have matched with the following companies: ${recommendations.slice(0, 3).map(r => r.company).join(', ')}.
                
                Based on this, give a short, encouraging 2-sentence paragraph on what they should focus on. Keep it professional and student-friendly.`;

                const result = await model.generateContent(prompt);
                insightsText = result.response.text().replace(/\*\*/g, '');
            } catch (err) {
                console.error("Insights AI Error:", err);
            }
        }

        res.send({
            readinessScore,
            recommendations,
            insights: insightsText
        });
    } catch (e) {
        res.status(500).send(e);
    }
};

exports.getChatResponse = async (req, res) => {
    try {
        const { message, context, sourceName } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.send({ response: "AI features setup required: Please add your GEMINI_API_KEY to the server .env file." });
        }

        // Feature: Context-based chat (from PrepHub)
        if (context) {
            try {
                const response = await geminiService.askWithContext(message, context, sourceName);
                return res.send({ response });
            } catch (err) {
                console.error("Context Chat Error:", err);
            }
        }

        // Default: Amrita-specialized Chat
        let contextText = "";
        let sysPrompt = "";

        if (req.user && req.user.role === 'admin') {
            sysPrompt = `You are a professional AI Admin Assistant for Amrita Vishwa Vidyapeetham's placement coordinators. 
            Your goal is to help admins with managing student placements, generating insights, shortlisting advice, and overall campus drive strategies.
            Keep your response concise, clear, and actionable. Avoid using asterisks for markdown if it looks messy but use lists where helpful.`;

            const totalStudents = await StudentProfile.countDocuments();
            const placementDrives = await PlacementDrive.find({ status: { $in: ['active', 'upcoming'] } }).limit(5);
            let drivesInfo = placementDrives.map(d => `${d.companyName} (${d.jobProfile} - Min CGPA: ${d.eligibility?.minCgpa || 'N/A'})`).join(', ');

            contextText += `System Metadata -> Total Student Profiles: ${totalStudents}. Upcoming/Active Drives: ${drivesInfo}. `;
        } else {
            sysPrompt = `You are a professional, motivating AI Career Advisor specifically for Amrita Vishwa Vidyapeetham students. 
            Your goal is to help students with placements, resume tips, interview prep, and career guidance.
            Keep your response concise, clear, and actionable. Avoid using asterisks for markdown if it looks messy in simple UI, but use lists where helpful.
            If appropriate, suggest them to apply to their eligible drives or use the campus prep resources available.`;

            if (req.user) {
                const profile = await StudentProfile.findOne({ userId: req.user._id });
                if (profile) {
                    contextText += `Student Details -> CGPA: ${profile.cgpa}, Skills: ${profile.skills.map(s => s.name).join(', ')}. `;
                    const recommendations = await aiService.getRecommendations(profile);
                    if (recommendations && recommendations.length > 0) {
                        contextText += `Eligible Upcoming Drives for them: ${recommendations.slice(0, 5).map(r => r.company).join(', ')}. `;
                    }
                }
            }
        }

        const resources = await Resource.find().limit(5);
        if (resources && resources.length > 0) {
            contextText += `Campus Prep Resources available: ${resources.map(r => r.title).join(', ')}.`;
        }

        const amritaContext = `
        General Amrita University Placement Knowledge:
        - Amrita Vishwa Vidyapeetham consistently achieves 95%+ campus placements.
        - The highest CTC offered is highly competitive, often exceeding ₹50 LPA.
        - The average CTC for recent batches is around ₹18 LPA, particularly strong in CSE and AI.
        - Top recruiters include Google, Microsoft, Amazon, Cisco, TCS, IBM, and Atlassian.
        - CIR (Corporate and Industry Relations) is the dedicated department at Amrita handling placements, internships, and life-skills training.
        - The university focuses heavily on holistic development, combining technical skills with values.
        `;

        contextText += amritaContext;

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `${sysPrompt}
        
        System Context: ${contextText}
        
        User Query: "${message}"`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text();

        res.send({ response: responseText });
    } catch (e) {
        console.error("AI Error:", e);
        res.status(500).send({ error: e.message, response: "I encountered an error connecting to the AI neural engine. Please try again." });
    }
};

exports.generateMockInterview = async (req, res) => {
    try {
        const { company, role } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required: Please add your GEMINI_API_KEY to the server .env file." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert technical interviewer at ${company || 'a top tech company'} for the role of ${role || 'Software Engineer'}.
        Generate 5 tailored interview questions for a university student applying for this role.
        The questions should be a mix of Technical, HR, and Problem Solving.
        Return ONLY a JSON array of objects with 'id', 'question', 'type', and 'difficulty' fields.
        Example format:
        [
            {"id": 1, "question": "...", "type": "Technical", "difficulty": "Medium"},
            ...
        ]
        Do not include markdown blocks like \`\`\`json, just return the raw JSON array string.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        const questions = JSON.parse(responseText);
        res.send({ questions });

    } catch (e) {
        console.error("AI Mock Interview Gen Error:", e);
        res.status(500).send({ error: "Failed to generate interview questions. Please try again." });
    }
};

exports.evaluateMockAnswer = async (req, res) => {
    try {
        const { question, answer, company, role } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You are an expert technical interviewer at ${company || 'a top tech company'} for the role of ${role || 'Software Engineer'}.
        The candidate was asked: "${question}"
        The candidate answered: "${answer}"
        
        Evaluate this answer out of 10. Provide constructive feedback, point out what was good, what was missing, and how to improve.
        Return ONLY a valid JSON object with 'score' (number) and 'feedback' (string) fields.
        Example: {"score": 7, "feedback": "Good answer, but you missed mentioning X..."}
        Do not include markdown blocks.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        const evaluation = JSON.parse(responseText);
        res.send(evaluation);

    } catch (e) {
        console.error("AI Evaluation Error:", e);
        res.status(500).send({ error: "Failed to evaluate answer." });
    }
};

exports.interviewChat = async (req, res) => {
    try {
        const { company, role, type, chatHistory, currentAnswer, questionCount } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // If it's the very first question, we just ask a question.
        // Otherwise, we evaluate the previous answer and ask the next question.
        const prompt = `You are an expert ${type || 'Technical'} interviewer at ${company || 'a top tech company'} for the role of ${role || 'Software Engineer'}.
        
        The candidate has so far answered ${questionCount} questions.
        
        ${currentAnswer ? "The candidate just answered your previous question with: \"" + currentAnswer + "\"" : "This is the very first question of the interview."}
        
        INSTRUCTIONS:
        1. If this is NOT the very first question, first evaluate their answer constructively (point out what was good, what was missing). Assign a score (0-10) internally to average out at the end, but do NOT return the raw score integer out loud in the feedback unless it's the final recap.
        2. Give them the NEXT interview question. Make it a conversational follow-up if applicable, or a completely new question (mix of technical, behavioral, HR).
        3. Only ask ONE question at a time. Do NOT ask multiple questions.
        4. If ${questionCount} >= 5, inform the candidate the interview is over and provide a comprehensive final performance review and an estimated final score out of 100.
        
        Return ONLY a JSON object with this exact structure:
        {
            "feedback": "Your evaluation of their previous answer (if applicable, else empty string or brief greeting).",
            "nextQuestion": "The next question you are asking (if the interview is over, put an empty string here).",
            "isComplete": ${questionCount >= 5 ? 'true' : 'false'},
            "finalScore": ${questionCount >= 5 ? '75' : 'null'} // Only return a number if isComplete is true
        }
        
        Make sure the feedback and nextQuestion feel like a natural, conversational interview flow, like you're speaking to them over a video call. Do not use markdown blocks (\`\`\`json). Just the raw JSON.`;

        let fullContextPrompt = prompt;
        if (chatHistory && chatHistory.length > 0) {
            const formattedHistory = chatHistory.map(h => {
                const speaker = h.role === 'user' ? 'Candidate' : 'Interviewer';
                return speaker + ': ' + h.content;
            }).join('\n\n');
            fullContextPrompt += '\n\n--- PREVIOUS CONVERSATION HISTORY ---\n' + formattedHistory;
        }

        const result = await model.generateContent(fullContextPrompt);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        const payload = JSON.parse(responseText);
        res.send(payload);

    } catch (e) {
        console.error("AI Interview Chat Error:", e);
        res.status(500).send({ error: "Failed to process interview message." });
    }
};

exports.analyzeResume = async (req, res) => {
    try {
        const { targetRole } = req.body;
        let resumeText = req.body.resumeText || '';

        // If a file was uploaded, parse it
        console.log("[DEBUG] Resume analysis request. Role:", targetRole);
        if (req.file) {
            console.log("[DEBUG] Buffer size:", req.file.buffer ? req.file.buffer.length : 0);
            try {
                // Use centralized FileParser
                const pdfModule = require('pdf-parse');

                if (typeof pdfModule === 'function') {
                    const pdfData = await pdfModule(req.file.buffer);
                    resumeText = pdfData.text;
                } else if (pdfModule.PDFParse) {
                    const parser = new pdfModule.PDFParse({ data: req.file.buffer });
                    const result = await parser.getText();
                    resumeText = result.text;
                    await parser.destroy();
                } else {
                    throw new Error("Could not find suitable pdf-parse export.");
                }

                if (!resumeText || resumeText.trim().length < 50) {
                    console.log("[DEBUG] pdf-parse failed, trying officeparser buffer...");
                    const officeparser = require('officeparser');
                    const fs = require('fs');
                    const path = require('path');
                    const tmpFilePath = path.join(__dirname, '..', `temp_resume_${Date.now()}.pdf`);
                    fs.writeFileSync(tmpFilePath, req.file.buffer);
                    try {
                        resumeText = await officeparser.parseOffice(tmpFilePath);
                    } finally {
                        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
                    }
                }
            } catch (err) {
                console.warn("[DEBUG] Primary extraction failed:", err.message);
                try {
                    const officeparser = require('officeparser');
                    const fs = require('fs');
                    const path = require('path');
                    const tmpFilePath = path.join(__dirname, '..', `temp_resume_${Date.now()}.pdf`);
                    fs.writeFileSync(tmpFilePath, req.file.buffer);
                    try {
                        resumeText = await officeparser.parseOffice(tmpFilePath);
                    } finally {
                        if (fs.existsSync(tmpFilePath)) fs.unlinkSync(tmpFilePath);
                    }
                } catch (err2) {
                    console.error("[DEBUG] All extraction methods failed.");
                    return res.status(400).send({
                        error: "Failed to extract text from PDF. " +
                            "Error details: " + err.message + ". " +
                            "Please ensure the PDF contains selectable text (not just an image)."
                    });
                }
            }
        } else {
            console.log("[DEBUG] No file in request. Checking for resumeText in body.");
        }

        if (!resumeText || !resumeText.trim() || resumeText.trim().length < 20) {
            return res.status(400).send({
                error: "The AI couldn't read any text from your resume. " +
                    "This usually happens if your PDF is an image (scanned) or uses a format that isn't OCR-friendly. " +
                    "Please try uploading a text-based PDF or copying the text directly."
            });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using 2.5-flash as the primary, but we'll try to handle quota errors
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


        const prompt = `Act as an expert ATS(Applicant Tracking System) and Senior Technical Recruiter.
        Target Role: ${targetRole || 'Software Engineer'}
        Resume Content: "${resumeText}"
 
        Analyze the resume and provide:
        1. An overall ATS formatting & content score(out of 100).
        2. Top 3 Strengths.
        3. Top 3 Weaknesses or missing keywords.
        4. Brief actionable improvement tips(max 3).
        
        Return ONLY a JSON object with this exact structure:
        {
            "score": 85,
            "strengths": ["...", "...", "..."],
            "weaknesses": ["...", "...", "..."],
            "tips": ["...", "...", "..."]
        }
        Do not include markdown blocks.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        const analysis = JSON.parse(responseText);
        res.send(analysis);
    } catch (e) {
        console.error("AI Resume Analysis Error:", e);
        if (e.message && e.message.includes('429')) {
            return res.status(429).send({ error: "Gemini API quota exceeded. Your current key has a very low daily limit (20 requests/day). Please try again later or use a different key." });
        }
        res.status(500).send({ error: "Failed to analyze resume.", details: e.message });
    }
};

exports.companyResearch = async (req, res) => {
    try {
        const { companyName, role } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Act as an expert career counselor. Provide a brief research summary for a student interviewing at ${companyName} for the role of ${role || 'Software Engineer'}.
        Provide:
        1. "culture": A 2-sentence summary of the company culture.
        2. "interviewProcess": 2-3 points on their typical interview rounds.
        3. "commonTopics": 3 common technical/HR topics they focus on.
        4. "tips": 2 specific tips to crack their interview.

        Return ONLY a JSON object with these 4 string/array fields. Do not include markdown blocks.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        res.send(JSON.parse(responseText));
    } catch (e) {
        console.error("AI Company Research Error:", e);
        res.status(500).send({ error: "Failed to research company." });
    }
};

exports.adminInsights = async (req, res) => {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required." });
        }

        const totalStudents = await StudentProfile.countDocuments();
        const placedStudents = await StudentProfile.countDocuments({ placementStatus: 'placed' });
        const unplacedStudents = totalStudents - placedStudents;
        const activeDrives = await PlacementDrive.countDocuments({ status: { $in: ['active', 'upcoming'] } });

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Act as a Head of Placements (Director) AI.
        Here are the current stats of the placements:
        - Total Students: ${totalStudents}
        - Placed: ${placedStudents}
        - Unplaced: ${unplacedStudents}
        - Active Drives: ${activeDrives}

        Generate a futuristic, data-driven "AI Insights Report". Include:
        1. "summary": A 2-sentence executive summary.
        2. "predictions": 3 actionable predictions/metrics (e.g. "Expect 15% increase in Product roles based on market trends").
        3. "actionPlan": 3 specific recommendations for the administration to improve placements right now.

        Return ONLY a JSON object with these 3 fields. Do not include markdown blocks.`;

        const result = await model.generateContent(prompt);
        let responseText = result.response.text().trim();

        if (responseText.startsWith('```json')) {
            responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (responseText.startsWith('```')) {
            responseText = responseText.replace(/```/g, '').trim();
        }

        res.send(JSON.parse(responseText));
    } catch (e) {
        console.error("AI Admin Insights Error:", e);
        res.status(500).send({ error: "Failed to generate admin insights." });
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
        const notes = await Note.find({ user: req.user._id });
        if (!notes || notes.length === 0) return res.status(404).send({ error: "No notes found to summarize." });

        const combinedNotes = notes.map(n => `Title: ${n.name}\nContent: ${n.text}`).join('\n\n---\n\n');

        try {
            const summary = await geminiService.generateSummary(combinedNotes);
            res.send({
                summary,
                sourceName: "Your Personal Notes",
                context: combinedNotes
            });
        } catch (geminiErr) {
            console.error("Gemini Notes Error:", geminiErr);
            return res.status(500).send({ error: `AI Error: ${geminiErr.message}` });
        }
    } catch (e) {
        console.error("Summarize Notes Error:", e);
        res.status(500).send({ error: "Failed to summarize notes." });
    }
};
