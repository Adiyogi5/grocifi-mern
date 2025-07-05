const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  secure: false,
  auth: {
    user: "34507188a2b95f",
    pass: "3ea41e4339ae2d",
  },
  debug: true,
  logger: true,
});

async function sendEmail(to, subject, text) {
  try {
    console.log("to ---->", to);
    console.log("subject ---->", subject);
    console.log("text ---->", text);

    let info = await transport.sendMail({
      from: "adpostmansupport@gmail.com",
      to,
      subject,
      text,
      html: `<p>${text}</p>`,
      // attachments: [
      //     {
      //         filename: "document.pdf",
      //         path: "./path-to-document.pdf",
      //     },
      // ],
    });
    console.log("Email sent successfully", info);
    console.log("Email sent:", info.messageId);
    return true; 
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

module.exports = { sendEmail };
// Usage
