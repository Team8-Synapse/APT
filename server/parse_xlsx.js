const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const xlsxPath = path.join(__dirname, 'data/amrita_batches_2023_2027.xlsx');
const workbook = XLSX.readFile(xlsxPath);

const output = [];
output.push('SHEETS: ' + workbook.SheetNames.join(', '));

workbook.SheetNames.forEach(sheetName => {
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    output.push(`\nSHEET: ${sheetName} | ROWS: ${data.length}`);
    output.push('HEADERS: ' + JSON.stringify(data[0]));
    if (data[1]) output.push('SAMPLE: ' + JSON.stringify(data[1]));
});

fs.writeFileSync(path.join(__dirname, 'xlsx_info.txt'), output.join('\n'));
console.log('Done - check xlsx_info.txt');
