// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Twilio credentials
const accountSid = 'ACa76b6f04916f20d9b191b71712def1ef';
const authToken = '7156098527c205de95d805beedd48e80';
const twilioPhoneNumber = '+16263250354';

const client = twilio(accountSid, authToken);

app.use(cors());
app.use(bodyParser.json());

// Endpoint to send OTP
app.post('/send-otp', (req, res) => {
  const { phoneNumber, countryCode } = req.body;

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Message body containing the OTP
  const messageBody = `Your OTP for verification is: ${otp}`;

  // Send OTP via Twilio
  client.messages
    .create({
      body: messageBody,
      from: `+${countryCode}${twilioPhoneNumber}`,
      to: `+${phoneNumber}`,
    })
    .then(() => {
      res.status(200).send({ success: true, otp: otp });
    })
    .catch((error) => {
      console.error('Error sending OTP:', error);
      res.status(500).send({ success: false, error: 'Failed to send OTP' });
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
