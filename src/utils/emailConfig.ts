import nodemailer, { TransportOptions } from "nodemailer";
import { env } from "../env";
import { OTPType } from "../constants";

const otpEmailContent: Record<OTPType, { subject: string; body: string }> = {
  [OTPType.EMAIL_VERIFY]: {
    subject: "Verify your email",
    body: "Please verify your email address",
  },
  [OTPType.PASSWORD_RESET]: {
    subject: "Reset your password",
    body: "You requested a password reset",
  },
  [OTPType.VIEW_SHOE]: {
    subject: "Your shoe viewing OTP",
    body: "Your OTP to view shoe details",
  },
};

export async function sendOTPEmail(email: string, code: string, type: OTPType) {
  const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: env.MAIL_PORT,
    auth: {
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
    },
  } as TransportOptions);

  const { subject, body } = otpEmailContent[type];

  await transporter.sendMail({
    from: `"Product Trace" <${env.MAIL_USER}>`,
    to: email,
    subject,
    html: `
      <p>${body}</p>n
      <p>Your OTP code is: <b>${code}</b></p>
      <p>It expires in 1 minute.</p>
    `,
  });
}
