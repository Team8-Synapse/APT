const axios = require('axios');
axios.get('http://localhost:5005/api/admin/stats?batch=2027')
    .then(res => {
        console.log(res.data);
    })
    .catch(err => {
        if (err.response) {
            console.log('Status:', err.response.status);
            console.log('Data:', err.response.data);
        } else {
            console.log('Error:', err.message);
        }
    });
