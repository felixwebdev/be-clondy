import nodemailer from "nodemailer";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Verification from "../models/Verification.js";
import ApiResponse from "../utils/ApiResponse.js";
import AppError from "../utils/AppError.js";

dotenv.config();

const BREVO_HOST = process.env.BREVO_HOST;
const BREVO_PORT = process.env.BREVO_PORT;
const BREVO_USER = process.env.BREVO_USER;
const BREVO_PASS = process.env.BREVO_PASS;

const transporter = nodemailer.createTransport({
  host: BREVO_HOST,
  port: 587,
  auth: {
    user: BREVO_USER,
    pass: BREVO_PASS,
  },
});

class VerificationService {
  async sendOTP(email) {
    try {
      //Checking if user isExist
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError("Email is not exist", 400);
      }

      //Hashed OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(otp, 10);

      //Create verification
      const expireTime = new Date(Date.now() + 3 * 60 * 1000);
      await Verification.create({
        userId: user._id,
        otp: hashedOtp,
        expire: expireTime,
      });

      //Create mail options
      const mailOptions = {
        from: "clondy@kdev.io.vn",
        to: email,
        subject: "Verify your email",
        html: `
        <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 480px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e5e5e5;">
          <h2 style="color: #333; text-align: center;">Verify your email</h2>
          <p style="font-size: 15px; color: #555;">
            Hello,
          </p>
          <p style="font-size: 15px; color: #555;">
            Thank you for use <strong>Clondy</strong>! To complete your process, please use the verification code below:
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <span style="display: inline-block; background-color: #4a90e2; color: white; font-size: 24px; letter-spacing: 4px; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #666;">
            This code will expire <strong>3 minutes</strong> after it was sent.
          </p>
          <p style="font-size: 14px; color: #999; margin-top: 24px; text-align: center;">
            If you did not request this, please ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
          <p style="font-size: 13px; color: #aaa; text-align: center;">
            © ${new Date().getFullYear()} Clondy. All rights reserved.
          </p>
        </div>
      `,
      };

      //Send email
      await transporter.sendMail(mailOptions);

      return "OTP has been sent";
    } catch (err) {
      throw new AppError("Error: " + err, 500);
    }
  }

  async sendVerifyEmail(email) {
    try {
      //Checking if user isExist
      const user = await User.findOne({ email });
      if (!user) {
        throw new AppError("Email is not exist", 400);
      }

      //Create mail options
      const mailOptions = {
        from: "clondy@kdev.io.vn",
        to: email,
        subject: "Your email is verified",
        html: `
        <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 480px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e5e5e5;">
        <h2 style="color: #333; text-align: center;">Account Verified Successfully</h2>
        <p style="font-size: 15px; color: #555;">
          Hello,
        </p>
        <p style="font-size: 15px; color: #555;">
          Congratulations! Your email has been successfully verified. You can now enjoy all the features and services of <strong>Clondy</strong>.
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; background-color: #4a90e2; color: white; font-size: 18px; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
            ✅ Verification Completed
          </span>
        </div>
        <p style="font-size: 14px; color: #666;">
          You can now log in and start using your account.
        </p>
        <p style="font-size: 14px; color: #999; margin-top: 24px; text-align: center;">
          If this was not you, please contact our support team immediately.
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="font-size: 13px; color: #aaa; text-align: center;">
          © ${new Date().getFullYear()} Clondy. All rights reserved.
        </p>
        </div>
      `,
      };

      //Send email
      await transporter.sendMail(mailOptions);

      return "Email has been sent";
    } catch (err) {
      throw new AppError("Error: " + err, 500);
    }
  }

  async verifyCode(email, otp) {
    try {
      //Find user
      const user = await User.findOne({ email });
      if (!user) throw new AppError("Email is not exist");

      //Find OTP
      const record = await Verification.findOne({ userId: user._id });
      if (!record) throw new AppError("OTP not found", 400);

      //Check OTP
      const isValid = bcrypt.compare(otp, record.otp);
      if (!isValid) throw new AppError("OTP not match", 400);

      //Check expireTime
      if (record.expire < Date.now()) throw new AppError("OTP expired", 400);

      return true;
    } catch (err) {
      throw new AppError("Error: " + err, 500);
    }
  }
}

export default new VerificationService();
