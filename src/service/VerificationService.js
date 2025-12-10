import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Verification from "../models/Verification.js";
import AppError from "../utils/AppError.js";
import SibApiV3Sdk from "sib-api-v3-sdk";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_APIKEY;

const emailApi = new SibApiV3Sdk.TransactionalEmailsApi();

class VerificationService {
    async sendOTP(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) throw new AppError("Email is not exist", 400);

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const hashedOtp = await bcrypt.hash(otp, 10);

            const expireTime = new Date(Date.now() + 3 * 60 * 1000);
            await Verification.create({
                userId: user._id,
                otp: hashedOtp,
                expire: expireTime,
            });


            await emailApi.sendTransacEmail({
                sender: { email: "clondy@kdev.io.vn", name: "Clondy" },
                to: [{ email }],
                subject: "Verify your email",
                htmlContent: `
                <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 480px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e5e5e5;">
                    <h2 style="color: #333; text-align: center;">Verify your email</h2>
                    <p style="font-size: 15px; color: #555;">Hello,</p>
                    <p style="font-size: 15px; color: #555;">
                        Thank you for using <strong>Clondy</strong>! Please use the verification code below:
                    </p>
                    <div style="text-align: center; margin: 24px 0;">
                        <span style="display: inline-block; background-color: #4a90e2; color: white; font-size: 24px; letter-spacing: 4px; padding: 12px 24px; border-radius: 8px; font-weight: bold;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #666;">This code will expire in <strong>3 minutes</strong>.</p>
                </div>
                `,
            });

            return "OTP has been sent";
        } catch (err) {
            throw new AppError("Error: " + err.message, 500);
        }
    }

    async sendVerifyEmail(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) throw new AppError("Email is not exist", 400);

            await emailApi.sendTransacEmail({
                sender: { email: "clondy@kdev.io.vn", name: "Clondy" },
                to: [{ email }],
                subject: "Your email is verified",
                htmlContent: `
                <div style="font-family: 'Segoe UI', Roboto, Arial, sans-serif; max-width: 480px; margin: auto; background-color: #f9f9f9; padding: 24px; border-radius: 12px; border: 1px solid #e5e5e5;">
                    <h2 style="color: #333; text-align: center;">Account Verified Successfully</h2>
                    <p style="font-size: 15px; color: #555;">Hello,</p>
                    <p style="font-size: 15px; color: #555;">
                        Congratulations! Your email has been successfully verified.
                    </p>
                </div>
                `,
            });

            return "Email has been sent";
        } catch (err) {
            throw new AppError("Error: " + err.message, 500);
        }
    }

    async verifyCode(email, otp) {
        try {
            const user = await User.findOne({ email });
            if (!user) throw new AppError("Email is not exist");

            const record = await Verification.findOne({ userId: user._id });
            if (!record) throw new AppError("OTP not found", 400);

            const isValid = await bcrypt.compare(otp, record.otp);
            if (!isValid) throw new AppError("OTP not match", 400);

            if (record.expire < Date.now()) throw new AppError("OTP expired", 400);

            return true;
        } catch (err) {
            throw new AppError("Error: " + err.message, 500);
        }
    }
}

export default new VerificationService();
