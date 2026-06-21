import nodemailer from "nodemailer";
import { Resend } from "resend";
import { env } from "./env";

export async function sendDigest(subject: string, html: string): Promise<void> {
  const to = env("DIGEST_TO_EMAIL");
  if (!to) return;

  if (env("RESEND_API_KEY")) {
    const resend = new Resend(env("RESEND_API_KEY"));
    await resend.emails.send({
      from: env("SMTP_FROM", "Deal Desk <noreply@example.com>"),
      to,
      subject,
      html
    });
    return;
  }

  if (env("SMTP_HOST")) {
    const transporter = nodemailer.createTransport({
      host: env("SMTP_HOST"),
      port: Number(env("SMTP_PORT", "587")),
      auth: env("SMTP_USER") ? { user: env("SMTP_USER"), pass: env("SMTP_PASS") } : undefined
    });
    await transporter.sendMail({
      from: env("SMTP_FROM", "Deal Desk <noreply@example.com>"),
      to,
      subject,
      html
    });
  }
}
