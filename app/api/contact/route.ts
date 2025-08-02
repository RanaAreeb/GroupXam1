import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();
    if (!name || !email || !subject || !message) {
      return new Response(
        JSON.stringify({ error: "All fields are required." }),
        { status: 400 }
      );
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GOOGLE_APP_PASSWORD,
      },
    });
    // Send to both emails
    const recipients = [process.env.GMAIL_ADDRESS, process.env.CONTACT_RECIPIENT_EMAIL];
    
    await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to: recipients.join(', '),
      subject: `[groupXam Contact] ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      replyTo: email, // Allow replies to go to the original sender
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
    });
  }
}
