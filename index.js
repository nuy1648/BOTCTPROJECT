const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const line = require('@line/bot-sdk');
require('dotenv').config();
const path = require('path');
const dbconnection = require('./database/db');


const config = {
  channelAccessToken: process.env.ACCESSTOKEN,
  channelSecret: process.env.SECRETTOKEN,
  userId: process.env.USERID,
  PORT: process.env.PORT || 3000,

};

const client = new line.Client(config);

app.use(express.json());
app.use(express.static("public"));
dbconnection();

function adminMiddleware(req, res, next) {
  const isAdmin = req.headers['x-admin'] === 'true'; // Example: Check for a custom header
  if (isAdmin) {
    next();
  } else {
    res.status(403).send('Access denied. Admins only.');
  }
}


app.get('/admin', adminMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('message', (data) => {
    console.log(data);
    io.emit('message', data);
  });

  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', data);
  });

  socket.on('adminMessage', (message) => {
    console.log(`Admin message: ${message}`);
    io.emit('adminMessage', message);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});


app.post('/webhook', line.middleware(config), (req, res) => {
    Promise.all([req.body.events.map(handleEvent)
    ])
    .then((result) => res.json(result))
});



function sendMessageToLine(userId, message) {
  setInterval(() => {
    client.pushMessage(userId, {
      type: 'text',
      text: message
    });
  }, 600000);
}

// sendMessageToLine(userId, 'มีข้อความเข้า กรุณาตอบกลับ.');


function handleEvent(event) {
  console.log(event)
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }
    
} 


http.listen(config.PORT, () => {
  console.log(`Server is running on ${config.PORT}`);
});