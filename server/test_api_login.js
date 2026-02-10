const http = require('http');

const data = JSON.stringify({
    email: 'cir@amrita.edu',
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 5005,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = http.request(options, (res) => {
    console.log(`StatusCode: ${res.statusCode}`);
    let body = '';

    res.on('data', (d) => {
        body += d;
    });

    res.on('end', () => {
        console.log('Response Body:', body);
    });
});

req.on('error', (error) => {
    console.error('Error:', error);
});

req.write(data);
req.end();
