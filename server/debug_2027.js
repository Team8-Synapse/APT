const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, 'data/students.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
const students2027 = lines.slice(1).filter(line => line.includes('2027'));
console.log('Count of lines containing 2027:', students2027.length);
if (students2027.length > 0) {
    const vals = students2027[0].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
    const batchIdx = headers.indexOf('batch_year');
    console.log('Batch from line:', vals[batchIdx]);
    console.log('Is strictly equal to 2027?', vals[batchIdx] === '2027');
}
