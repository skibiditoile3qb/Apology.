const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

const ADMIN_PASSWORD = 'admin123'; // Change this to something stronger!

app.use(express.static('public'));

// Log IPs from incoming requests
app.use((req, res, next) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const log = `${new Date().toISOString()} - ${ip}\n`;
  fs.appendFileSync('ip-log.txt', log);
  next();
});

// Serve IP log to admin
app.get('/admin', (req, res) => {
  if (req.query.pwd !== ADMIN_PASSWORD) {
    return res.send('Unauthorized');
  }
  const logData = fs.readFileSync('ip-log.txt', 'utf8');
  res.send(logData);
});

// Start server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
