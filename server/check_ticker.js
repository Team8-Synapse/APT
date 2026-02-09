const axios = require('axios');

async function checkTicker() {
    try {
        const response = await axios.get('http://localhost:5005/api/ticker');
        console.log('Status:', response.status);
        console.log('Data:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
    }
}

checkTicker();
