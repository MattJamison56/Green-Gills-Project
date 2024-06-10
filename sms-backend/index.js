const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Yo this the backend. What're you doing here?");
});

app.post('/send-sms', (req, res) => {
  const { to, message } = req.body;

  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to
    })
    .then(message => res.status(200).send({ success: true, messageSid: message.sid }))
    .catch(error => res.status(500).send({ success: false, error: error.message }));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
