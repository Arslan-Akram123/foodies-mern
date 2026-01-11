const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // CRITICAL: Must be 'pass', not 'password'
    },
  });

  // Verify connection configuration (Optional: helps debugging)
  // transporter.verify(function (error, success) {
  //   if (error) { console.log("SMTP Error:", error); } 
  //   else { console.log("Server is ready to take our messages"); }
  // });

  const mailOptions = {
    from: `"FOODIES Kitchen" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;