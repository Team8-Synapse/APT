const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const https = require('https');

async function testUpload() {
    const file = fs.createWriteStream("dummy.pdf");
    https.get("https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", function (response) {
        response.pipe(file);
        file.on('finish', async function () {
            file.close();

            const form = new FormData();
            form.append('resume', fs.createReadStream('dummy.pdf'));
            form.append('targetRole', 'Software Engineer');

            try {
                console.log("Sending request to http://localhost:5005/api/ai/analyze-resume");
                const res = await axios.post('http://localhost:5005/api/ai/analyze-resume', form, {
                    headers: form.getHeaders()
                });
                console.log("SUCCESS:", res.data);
            } catch (e) {
                console.error("FAIL:", e.response ? e.response.data : e.message);
            }
        });
    });
}
testUpload();
