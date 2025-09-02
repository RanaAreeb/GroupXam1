import { NextRequest } from "next/server";
import nodemailer from "nodemailer";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, inquiryType, packageType } = await req.json();
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
    
    // Create enhanced email content for package inquiries
    let emailContent = `Name: ${name}\nEmail: ${email}\n`;
    
    if (inquiryType) {
      emailContent += `Inquiry Type: ${inquiryType}\n`;
    }
    
    // Add package pricing information for reference
    const packageInfo = {
      'students': '$2 one-time charge per exam',
      'k12': '$10/month, $50/6months, $100/year',
      'universities': '$20/month, $120/6months, $240/year'
    };

    if (packageType && inquiryType === 'package') {
      emailContent += `Package Type: ${packageType}\n`;
      
      if (packageInfo[packageType as keyof typeof packageInfo]) {
        emailContent += `Package Pricing: ${packageInfo[packageType as keyof typeof packageInfo]}\n`;
      }
    }
    
    emailContent += `\nMessage:\n${message}`;
    
    // Enhanced subject line for package inquiries
    let emailSubject = `[groupXam Contact] ${subject}`;
    if (inquiryType === 'package') {
      emailSubject = `[ProctorIT Package Inquiry] ${packageType ? packageType.toUpperCase() : ''} - ${subject}`;
    }
    
    await transporter.sendMail({
      from: process.env.GMAIL_ADDRESS,
      to: recipients.join(', '),
      subject: emailSubject,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #059669;">groupXam Contact Form Submission</h2>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #065f46;">Contact Information</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${inquiryType ? `<p><strong>Inquiry Type:</strong> ${inquiryType}</p>` : ''}
            ${packageType && inquiryType === 'package' ? `
              <p><strong>Package Type:</strong> ${packageType}</p>
              <p><strong>Package Pricing:</strong> ${packageInfo[packageType as keyof typeof packageInfo] || 'Contact for pricing'}</p>
            ` : ''}
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #374151;">Message</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
          
          ${inquiryType === 'package' ? `
            <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <p style="margin: 0; font-size: 14px; color: #1e40af;">
                <strong>Note:</strong> This is a ProctorIT package inquiry. Please follow up with pricing details and payment options.
              </p>
            </div>
          ` : ''}
        </div>
      `,
      replyTo: email, // Allow replies to go to the original sender
    });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to send email." }), {
      status: 500,
    });
  }
}
