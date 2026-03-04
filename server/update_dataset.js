const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const xlsxPath = path.join(__dirname, 'data/amrita_batches_2023_2027.xlsx');
const csvPath = path.join(__dirname, 'data/students.csv');

const workbook = XLSX.readFile(xlsxPath);
const allStudents = [];

// Header for students.csv: roll_no,full_name,email,dept_code,section,batch_year,cgpa,backlogs,placement_status
allStudents.push(['roll_no', 'full_name', 'email', 'dept_code', 'section', 'batch_year', 'cgpa', 'backlogs', 'placement_status'].join(','));

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    // sheet_to_json with header: 1 returns array of arrays
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Skip header row
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || row.length === 0) continue;

        // roll_no: row[0], full_name: row[1], email: row[7], dept_code: row[5], section: row[6], batch_year: row[3], cgpa: row[9], placement_status: row[10]
        const roll_no = row[0] || '';
        const full_name = (row[1] || '').replace(/,/g, ''); // Remove commas to prevent CSV breakage
        const email = row[7] || '';
        const dept_code = row[5] || '';
        const section = row[6] || '';
        const batch_year = row[3] || sheetName;
        const cgpa = row[9] || 0;
        const rawStatus = row[10] || 'No';

        // Map "Yes"/"No" to "Placed"/"Not Placed" matches current CSV format
        const placement_status = rawStatus === 'Yes' ? 'Placed' : 'Not Placed';

        // Random backlogs (0-2) for variety, since it's not in the Excel
        const backlogs = Math.floor(Math.random() * 3);

        const csvRow = [
            roll_no,
            full_name,
            email,
            dept_code,
            section,
            batch_year,
            cgpa,
            backlogs,
            placement_status
        ].join(',');

        allStudents.push(csvRow);
    }
});

fs.writeFileSync(csvPath, allStudents.join('\n'));
console.log(`Successfully updated students.csv with ${allStudents.length - 1} records.`);
