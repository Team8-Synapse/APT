// Test the local parser logic in isolation
const fs = require('fs');
const path = require('path');

function parsePromptLocally(prompt) {
    const p = prompt.toLowerCase();
    const filters = {
        batch: null, department: null, section: null,
        minCgpa: null, maxCgpa: null, maxBacklogs: null, minBacklogs: null, placementStatus: null,
    };

    const yearMatch = p.match(/\b(202[0-9]|203[0-9])\b/);
    if (yearMatch) filters.batch = yearMatch[1];

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

    const sectionMatch = p.match(/section\s+([a-c])\b|section-([a-c])\b|\bsec\s+([a-c])\b/i);
    if (sectionMatch) filters.section = (sectionMatch[1] || sectionMatch[2] || sectionMatch[3]).toUpperCase();

    const cgpaGtMatch = p.match(/cgpa\s*(?:>|>=|above|more than|greater than|over|atleast|at least|minimum|min)\s*(\d+(?:\.\d+)?)/);
    if (cgpaGtMatch) filters.minCgpa = parseFloat(cgpaGtMatch[1]);

    const cgpaLtMatch = p.match(/cgpa\s*(?:<|<=|below|less than|under|at most|maximum|max)\s*(\d+(?:\.\d+)?)/);
    if (cgpaLtMatch) filters.maxCgpa = parseFloat(cgpaLtMatch[1]);

    const cgpaBetweenMatch = p.match(/cgpa\s+between\s+(\d+(?:\.\d+)?)\s+and\s+(\d+(?:\.\d+)?)/);
    if (cgpaBetweenMatch) { filters.minCgpa = parseFloat(cgpaBetweenMatch[1]); filters.maxCgpa = parseFloat(cgpaBetweenMatch[2]); }

    const cgpaPlusMatch = p.match(/(\d+(?:\.\d+)?)\+\s*cgpa|cgpa\s+(\d+(?:\.\d+)?)\+/);
    if (cgpaPlusMatch && !filters.minCgpa) filters.minCgpa = parseFloat(cgpaPlusMatch[1] || cgpaPlusMatch[2]);

    if (p.match(/no backlog|zero backlog|0 backlog|without backlog/)) filters.maxBacklogs = 0;
    const backlogLtMatch = p.match(/backlogs?\s*(?:<|<=|less than|under|max|at most)\s*(\d+)/);
    if (backlogLtMatch) filters.maxBacklogs = parseInt(backlogLtMatch[1]);
    if (p.match(/has backlog|with backlog|have backlog/)) filters.minBacklogs = 1;
    const backlogGtMatch = p.match(/backlogs?\s*(?:>|>=|more than|at least|min)\s*(\d+)/);
    if (backlogGtMatch) filters.minBacklogs = parseInt(backlogGtMatch[1]);

    if (p.match(/\bnot placed\b|unplaced/)) filters.placementStatus = 'Not Placed';
    else if (p.match(/\bin process\b|in-process|inprocess|processing/)) filters.placementStatus = 'In Process';
    else if (p.match(/\bplaced\b/)) filters.placementStatus = 'Placed';

    return filters;
}

function readCSV() {
    const content = fs.readFileSync(path.join(__dirname, 'data/students.csv'), 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    return lines.slice(1).map(line => {
        const vals = line.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((h, idx) => obj[h] = vals[idx] || '');
        return {
            rollNumber: obj.roll_no, fullName: obj.full_name,
            department: obj.dept_code, batch: obj.batch_year,
            cgpa: parseFloat(obj.cgpa) || 0, backlogs: parseInt(obj.backlogs) || 0,
            placementStatus: obj.placement_status,
        };
    });
}

function applyFilters(students, filters) {
    let r = [...students];
    if (filters.batch) r = r.filter(s => String(s.batch) === String(filters.batch));
    if (filters.department) r = r.filter(s => s.department.toUpperCase() === filters.department.toUpperCase());
    if (filters.section) r = r.filter(s => s.section && s.section.toUpperCase() === filters.section.toUpperCase());
    if (filters.minCgpa != null) r = r.filter(s => s.cgpa >= parseFloat(filters.minCgpa));
    if (filters.maxCgpa != null) r = r.filter(s => s.cgpa <= parseFloat(filters.maxCgpa));
    if (filters.maxBacklogs != null) r = r.filter(s => s.backlogs <= parseInt(filters.maxBacklogs));
    if (filters.minBacklogs != null) r = r.filter(s => s.backlogs >= parseInt(filters.minBacklogs));
    if (filters.placementStatus) r = r.filter(s => s.placementStatus.toLowerCase() === filters.placementStatus.toLowerCase());
    r.sort((a, b) => b.cgpa - a.cgpa);
    return r;
}

const testCases = [
    '2026 batch, CGPA > 8',
    'Year 2026 batch, cgpa > 8',
    'CSE students with no backlogs',
    'placed students from 2027',
    'not placed 2026 batch',
    'ECE department, cgpa above 7.5, no backlogs',
    '2028 batch aids cgpa between 7 and 9',
    'section A, 2026, cgpa >= 8.5',
];

const students = readCSV();
for (const t of testCases) {
    const filters = parsePromptLocally(t);
    const matched = applyFilters(students, filters);
    console.log(`\nPrompt: "${t}"`);
    console.log('  Filters:', JSON.stringify(filters));
    console.log(`  Matched: ${matched.length} students`);
    if (matched.length > 0) console.log(`  Top 3: ${matched.slice(0, 3).map(s => `${s.fullName}(${s.cgpa})`).join(', ')}`);
}
