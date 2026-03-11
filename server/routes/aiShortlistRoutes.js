const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const https = require('https');
const XLSX = require('xlsx');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// ─── Helper: Call Gemini with retry ──────────────────────────────────────────
async function callGemini(prompt, retries = 2) {
    return new Promise(async (resolve, reject) => {
        const attempt = async (attemptsLeft) => {
            const body = JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] });
            const url = new URL(GEMINI_URL);
            const options = {
                hostname: url.hostname,
                path: url.pathname + url.search,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(body),
                },
            };
            const req = https.request(options, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', async () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.error) {
                            const code = json.error.code;
                            if ((code === 429 || code === 500 || code === 503) && attemptsLeft > 0) {
                                const delay = code === 429 ? 5000 : 2000;
                                console.log(`Gemini ${code}, retrying after ${delay}ms...`);
                                await new Promise(r => setTimeout(r, delay));
                                attempt(attemptsLeft - 1);
                            } else {
                                reject(new Error(`Gemini API error ${code}: ${json.error.message}`));
                            }
                        } else {
                            resolve(json);
                        }
                    } catch (e) { reject(e); }
                });
            });
            req.on('error', reject);
            req.write(body);
            req.end();
        };
        attempt(retries);
    });
}

// ─── Local fallback parser (no Gemini needed) ────────────────────────────────
// Handles common natural language patterns reliably
function parsePromptLocally(prompt) {
    const p = prompt.toLowerCase();
    const filters = {
        batch: null,
        department: null,
        section: null,
        minCgpa: null,
        maxCgpa: null,
        maxBacklogs: null,
        minBacklogs: null,
        placementStatus: null,
    };

    // ── Batch year (4-digit year) ──
    const yearMatch = p.match(/\b(202[0-9]|203[0-9])\b/);
    if (yearMatch) filters.batch = yearMatch[1];

    // ── Department ──
    const deptMap = {
        'cse': 'CSE', 'computer science': 'CSE',
        'ece': 'ECE', 'electronics and communication': 'ECE',
        'eee': 'EEE', 'electrical': 'EEE',
        'mec': 'MEC', 'mechanical': 'MEC',
        'elc': 'ELC', 'electronics': 'ELC',
        'aie': 'AIE', 'artificial intelligence and engineering': 'AIE',
        'aids': 'AIDS', 'ai and data science': 'AIDS', 'data science': 'AIDS',
    };
    for (const [keyword, code] of Object.entries(deptMap)) {
        if (p.includes(keyword)) { filters.department = code; break; }
    }

    // ── Section ──
    const sectionMatch = p.match(/section\s+([a-c])\b|section-([a-c])\b|\bsec\s+([a-c])\b/i);
    if (sectionMatch) {
        filters.section = (sectionMatch[1] || sectionMatch[2] || sectionMatch[3]).toUpperCase();
    }

    // ── CGPA ──
    // "cgpa > 8", "cgpa >= 8", "cgpa above 8", "cgpa more than 8"
    const cgpaGtMatch = p.match(/cgpa\s*(?:>|>=|above|more than|greater than|over|atleast|at least|minimum|min)\s*(\d+(?:\.\d+)?)/);
    if (cgpaGtMatch) filters.minCgpa = parseFloat(cgpaGtMatch[1]);

    // "cgpa < 7", "cgpa <= 7", "cgpa below 7", "cgpa less than 7"
    const cgpaLtMatch = p.match(/cgpa\s*(?:<|<=|below|less than|under|at most|maximum|max)\s*(\d+(?:\.\d+)?)/);
    if (cgpaLtMatch) filters.maxCgpa = parseFloat(cgpaLtMatch[1]);

    // "cgpa between 7 and 9"
    const cgpaBetweenMatch = p.match(/cgpa\s+between\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)/);
    if (cgpaBetweenMatch) {
        filters.minCgpa = parseFloat(cgpaBetweenMatch[1]);
        filters.maxCgpa = parseFloat(cgpaBetweenMatch[2]);
    }

    // "cgpa 8+" or "8+ cgpa"
    const cgpaPlusMatch = p.match(/(\d+(?:\.\d+)?)\+\s*cgpa|cgpa\s+(\d+(?:\.\d+)?)\+/);
    if (cgpaPlusMatch && !filters.minCgpa) {
        filters.minCgpa = parseFloat(cgpaPlusMatch[1] || cgpaPlusMatch[2]);
    }

    // ── Backlogs ──
    // "no backlogs", "zero backlogs"
    if (p.match(/no backlog|zero backlog|0 backlog|without backlog/)) {
        filters.maxBacklogs = 0;
    }
    // "backlogs < 2", "backlogs <= 1", "less than 2 backlogs"
    const backlogLtMatch = p.match(/backlogs?\s*(?:<|<=|less than|under|max|at most)\s*(\d+)/);
    if (backlogLtMatch) filters.maxBacklogs = parseInt(backlogLtMatch[1]);

    // "backlogs > 0", "has backlogs", "with backlogs"
    if (p.match(/has backlog|with backlog|have backlog/)) {
        filters.minBacklogs = 1;
    }
    const backlogGtMatch = p.match(/backlogs?\s*(?:>|>=|more than|at least|min)\s*(\d+)/);
    if (backlogGtMatch) filters.minBacklogs = parseInt(backlogGtMatch[1]);

    // ── Placement Status ──
    if (p.match(/\bnot placed\b|unplaced/)) {
        filters.placementStatus = 'Not Placed';
    } else if (p.match(/\bin process\b|in-process|inprocess|processing/)) {
        filters.placementStatus = 'In Process';
    } else if (p.match(/\bplaced\b/)) {
        // "placed" alone (not inside "not placed" — already handled above)
        filters.placementStatus = 'Placed';
    }

    return filters;
}

// ─── Helper: Read & parse Excel dataset ───────────────────────────────────────
function readStudentsCSV() {
    try {
        const filePath = path.join(__dirname, '../data/amrita_batches_2023_2027.xlsx');
        if (!fs.existsSync(filePath)) {
            console.error(`[AI Helper] File not found at: ${filePath}`);
            return [];
        }

        const workbook = XLSX.readFile(filePath);
        let allStudents = [];

        workbook.SheetNames.forEach(sheetName => {
            const rawData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
            const sheetStudents = rawData.map(s => ({
                rollNumber: s['Roll Number'] || '',
                fullName: s['Name'] || '',
                email: s['University Email ID'] || '',
                department: s['Dept'] || '',
                section: s['Section'] || '',
                batch: String(s['Year of Grad'] || '').trim(),
                cgpa: parseFloat(s['CGPA']) || 0,
                backlogs: 0, // Not explicitly in the provided keys
                placementStatus: s['Placement Status'] === 'Placed' || s['Placement Status'] === 'Yes' ? 'Placed' : 'Not Placed',
                originalData: s
            }));
            allStudents = allStudents.concat(sheetStudents);
        });

        return allStudents;
    } catch (err) {
        console.error('AI Data Parse Error:', err);
        return [];
    }
}

// ─── Apply filters to student list ───────────────────────────────────────────
function applyFilters(students, filters) {
    let result = [...students];

    if (filters.batch) {
        result = result.filter(s => String(s.batch) === String(filters.batch));
    }
    if (filters.department) {
        result = result.filter(s => String(s.department || '').toUpperCase() === String(filters.department).toUpperCase());
    }
    if (filters.section) {
        result = result.filter(s => String(s.section || '').toUpperCase() === String(filters.section).toUpperCase());
    }
    if (filters.minCgpa != null) {
        result = result.filter(s => s.cgpa >= parseFloat(filters.minCgpa));
    }
    if (filters.maxCgpa != null) {
        result = result.filter(s => s.cgpa <= parseFloat(filters.maxCgpa));
    }
    if (filters.maxBacklogs != null) {
        result = result.filter(s => s.backlogs <= parseInt(filters.maxBacklogs));
    }
    if (filters.minBacklogs != null) {
        result = result.filter(s => s.backlogs >= parseInt(filters.minBacklogs));
    }
    if (filters.placementStatus) {
        result = result.filter(s =>
            String(s.placementStatus || '').toLowerCase() === String(filters.placementStatus).toLowerCase()
        );
    }

    // Sort by CGPA descending
    result.sort((a, b) => b.cgpa - a.cgpa);
    return result;
}

// ─── POST /api/ai-shortlist/query ─────────────────────────────────────────────
router.post('/query', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // Step 1: Try local parser first (fast, always works)
        let filters = parsePromptLocally(prompt);
        let usedFallback = true;

        // Step 2: Try to enhance with Gemini if local parser found nothing useful
        const locallyFound = Object.values(filters).some(v => v !== null);
        if (!locallyFound) {
            try {
                const systemPrompt = `You are a student filter assistant. Extract filter criteria from the query and return ONLY valid JSON (no markdown fences, no extra text).

Available values in the database:
- batch: "2026", "2027", "2028" (graduation year — NOT admission year)
- department (dept_code): "CSE", "ECE", "EEE", "MEC", "ELC", "AIE", "AIDS"
- cgpa: float 0-10
- backlogs: integer >= 0
- placementStatus: MUST be exactly "Placed", "Not Placed", or "In Process"
- section: "A", "B", "C"

JSON keys: batch, department, section, minCgpa, maxCgpa, maxBacklogs, minBacklogs, placementStatus
Use null for any field not explicitly mentioned.

User query: "${prompt}"

Return ONLY the JSON:`;

                const geminiResp = await callGemini(systemPrompt);
                const rawText = geminiResp?.candidates?.[0]?.content?.parts?.[0]?.text || '';
                if (rawText) {
                    const cleanJson = rawText
                        .replace(/```json\n?/gi, '')
                        .replace(/```\n?/g, '')
                        .trim();
                    const parsed = JSON.parse(cleanJson);
                    if (parsed && typeof parsed === 'object') {
                        filters = parsed;
                        usedFallback = false;
                    }
                }
            } catch (geminiErr) {
                console.warn('Gemini unavailable, using local parser:', geminiErr.message);
            }
        }

        // Step 3: Apply filters
        const allStudents = readStudentsCSV();
        const matched = applyFilters(allStudents, filters);

        // Build human-readable filter description
        const filterDesc = [];
        if (filters.batch) filterDesc.push(`Batch ${filters.batch}`);
        if (filters.department) filterDesc.push(`${filters.department} dept`);
        if (filters.section) filterDesc.push(`Section ${filters.section}`);
        if (filters.minCgpa != null) filterDesc.push(`CGPA ≥ ${filters.minCgpa}`);
        if (filters.maxCgpa != null) filterDesc.push(`CGPA ≤ ${filters.maxCgpa}`);
        if (filters.maxBacklogs != null) filterDesc.push(`Backlogs ≤ ${filters.maxBacklogs}`);
        if (filters.minBacklogs != null) filterDesc.push(`Backlogs ≥ ${filters.minBacklogs}`);
        if (filters.placementStatus) filterDesc.push(`Status: ${filters.placementStatus}`);

        res.json({
            success: true,
            prompt,
            filtersApplied: filters,
            filterSummary: filterDesc.length ? filterDesc.join(', ') : 'No specific filters (showing all)',
            parserUsed: usedFallback ? 'local' : 'gemini',
            count: matched.length,
            students: matched,
        });

    } catch (err) {
        console.error('AI shortlist error:', err);
        res.status(500).json({ error: err.message });
    }
});

// ─── POST /api/ai-shortlist/download ─────────────────────────────────────────
router.post('/download', (req, res) => {
    try {
        const { students, filename = 'shortlisted_students' } = req.body;
        if (!students || !Array.isArray(students)) {
            return res.status(400).json({ error: 'students array required' });
        }

        const rows = students.map((s, i) => ({
            'S.No': i + 1,
            'Roll Number': s.rollNumber,
            'Full Name': s.fullName,
            'Email': s.email,
            'Department': s.department,
            'Section': s.section,
            'Batch': s.batch,
            'CGPA': s.cgpa,
            'Backlogs': s.backlogs,
            'Placement Status': s.placementStatus,
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(rows);
        ws['!cols'] = [
            { wch: 6 }, { wch: 25 }, { wch: 22 }, { wch: 38 },
            { wch: 8 }, { wch: 8 }, { wch: 6 }, { wch: 7 },
            { wch: 10 }, { wch: 14 }
        ];
        XLSX.utils.book_append_sheet(wb, ws, 'Shortlisted Students');
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', `attachment; filename="${filename}.xlsx"`);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);

    } catch (err) {
        console.error('Excel download error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
