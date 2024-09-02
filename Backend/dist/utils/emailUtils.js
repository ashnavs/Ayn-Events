"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendOTPEmail = (email, otp, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: `${process.env.EMAIL_USER}`,
                pass: `${process.env.EMAIL_PASS}`
            },
        });
        const mailOptions = {
            from: `${process.env.EMAIL_USER}`,
            to: `${email}`,
            subject: "Email Verification Required",
            html: `
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Email Verification</title>
        <style>
          body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            background-color: #f9f9f9;
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }
          .email-container {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            max-width: 500px;
            width: 100%;
            text-align: center;
          }
          .header {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
          }
          .content {
            margin-top: 20px;
            font-size: 16px;
            color: #555555;
          }
          .otp-code {
            margin: 20px 0;
            padding: 10px 20px;
            font-size: 20px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4CAF50;
            border-radius: 5px;
            display: inline-block;
          }
          .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #777777;
          }
          .verify-button {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 20px;
            font-size: 16px;
            font-weight: bold;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
          }
          .verify-button:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">Verify Your Email Address</div>
          <div class="content">
            <p>${name}</p>
            <p>Thank you for registering with us. To complete your registration, please use the OTP below:</p>
            <div class="otp-code">${otp}</div>
            <p>If you did not request this, please ignore this email.</p>
          </div>
          <a href="#" class="verify-button">Verify Email</a>
          <div class="footer">
            <p>If you have any questions, feel free to contact our support team.</p>
          </div>
        </div>
      </body>
      </html>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Send mail");
                console.log(error);
            }
            else {
                console.log("Email has been sent:", info.response);
            }
        });
    }
    catch (error) {
        console.log(error);
    }
});
exports.default = sendOTPEmail;
