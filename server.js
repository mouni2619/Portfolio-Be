
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/send', (req, res) => {
  const { from_email, from_name, subject, message } = req.body;

  console.log("Received data:", req.body); // Log the received data

  // Validate request body
  if (!from_email || !from_name || !subject || !message) {
    return res.status(400).send({ success: false, error: 'All fields are required.' });
  }

  // Configure nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: from_email,
    to: process.env.EMAIL,
    subject: `Contact form submission: ${subject}`,
    text: `Name: ${from_name}\nEmail: ${from_email}\n\nMessage:\n${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error); // Log the error
      return res.status(500).send({ success: false, error: 'Failed to send email.' });
    }
    console.log('Email sent: ' + info.response); // Log success message
    res.status(200).send({ success: true, message: 'Email sent successfully!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
