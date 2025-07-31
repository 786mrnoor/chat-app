import sendEmail from '../config/nodemailer.js';

const emailTemplate = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f6f9fc;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #fff;
      padding: 32px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      font-size: 22px;
      margin-bottom: 16px;
      font-weight: bold;
      color: #2b2d42;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin-top: 24px;
      font-weight: bold;
    }
    .footer {
      margin-top: 32px;
      font-size: 13px;
      color: #888;
      line-height: 1.5;
    }
    .code {
      display: inline-block;
      font-family: monospace;
      background: #f1f1f1;
      padding: 4px 8px;
      border-radius: 4px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">Reset Your Password</div>
    <p>Hello {{userName}},</p>
    <p>We received a request to reset your password. Click the button below to choose a new one:</p>
    <a href="{{resetLink}}" class="button">Reset Password</a>
    <p>If you didn’t request a password reset, you can safely ignore this email.</p>
    <p>This link will expire in <strong>15 minutes</strong> for security reasons.</p>
    <div class="footer">
      — Chat App Team<br/>
      If the button doesn't work, paste this link into your browser: <br/>
      <span class="code">{{resetLink}}</span>
    </div>
  </div>
</body>
</html>
`;

export default function sendForgotPasswordEmail(email, username, token) {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
  const html = emailTemplate.replace('{{userName}}', username).replace(/{{resetLink}}/g, resetUrl);

  return sendEmail(email, 'Reset your password', html);
}
