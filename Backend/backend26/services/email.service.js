const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify().then(() => {
  console.log('Email service ready to send messages');
}).catch((error) => {
  console.error('Email service configuration error:', error);
});

module.exports.sendMail = async (mailOptions) => {
  if (!mailOptions.from) {
    mailOptions.from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  }

  if (!mailOptions.from) {
    throw new Error('Le champ EMAIL_FROM est requis dans le fichier .env');
  }

  return transporter.sendMail(mailOptions);
};
