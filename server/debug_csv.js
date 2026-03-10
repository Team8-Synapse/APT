const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, 'data/students.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
console.log('Headers:', headers);
const students = lines.slice(1, 5).map(line => {
    const values = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
    const student = {};
    headers.forEach((header, i) => student[header] = values[i] || '');
    return student;
});
console.log('Sample Students:', JSON.stringify(students, null, 2));
console.log('Filter check (batch 2027):', students.filter(s => s.batch_year === '2027').length);
