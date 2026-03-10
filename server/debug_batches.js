const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, 'data/students.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '');
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',').map(h => h.trim().replace(/^"(.*)"$/, '$1'));
const batchIdx = headers.indexOf('batch_year');
const uniqueBatches = new Set(lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
    return vals[batchIdx];
}));
console.log('Unique Batches:', Array.from(uniqueBatches));
