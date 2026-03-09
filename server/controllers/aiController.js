const aiService = require('../services/AI.service');
const geminiService = require('../services/Gemini.service');
const fileParser = require('../services/FileParser');
const StudentProfile = require('../models/StudentProfile');
const Resource = require('../models/Resource');
const PlacementDrive = require('../models/PlacementDrive');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Note = require('../models/Note');

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

        if (context) {
            let response = await geminiService.askWithContext(message, context, sourceName);
            return res.send({ response });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.send({ response: "AI features setup required: Please add your GEMINI_API_KEY to the server .env file." });
        }

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

        // We will no longer replace ** so that the frontend can format it with bold text
        // responseText = responseText.replace(/\*\*/g, '');

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
        if (req.file) {
            try {
                const pdfParse = require('pdf-parse');
                const pdfData = await pdfParse(req.file.buffer);
                resumeText = pdfData.text;
            } catch (pdfErr) {
                console.error("PDF Parsing Error:", pdfErr);
                return res.status(400).send({ error: "Failed to extract text from the uploaded PDF." });
            }
        }

        if (!resumeText || !resumeText.trim()) {
            return res.status(400).send({ error: "No resume text found. Please upload a valid PDF or provide text." });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).send({ error: "AI features setup required." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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

        // Gather some basic stats to feed to the AI (in a real app, you'd aggregate this from DB)
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

// --- TEAMMATE'S ADDITIONS ---

exports.chatResponse = async (req, res) => {
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
