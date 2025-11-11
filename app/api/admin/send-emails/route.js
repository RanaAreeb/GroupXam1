import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const { subject, message, template, selectedUsers, productLink, productName, imageData, imageName } = await request.json();

        // Validate required fields
        if (!subject || !selectedUsers || selectedUsers.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: subject and selectedUsers'
            }, { status: 400 });
        }

        // Check if we have too many recipients (limit to 50)
        if (selectedUsers.length > 50) {
            return NextResponse.json({
                success: false,
                error: 'Too many recipients. Maximum 50 users allowed.'
            }, { status: 400 });
        }

        // Get user details from database
        const { getDatabase } = await import('@/lib/db');
        const db = await getDatabase();
        const users = await db.collection('users').find({
            _id: { $in: selectedUsers.map(id => new ObjectId(id)) }
        }).toArray();

        if (users.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No valid users found'
            }, { status: 400 });
        }

        // Create email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ADDRESS,
                pass: process.env.GOOGLE_APP_PASSWORD
            }
        });

        let heroAttachmentTemplate = null;
        let heroImageSource = null;

        if (imageData) {
            if (typeof imageData !== 'string' || !imageData.startsWith('data:image/')) {
                return NextResponse.json({
                    success: false,
                    error: 'Invalid image format. Please upload a valid image file.'
                }, { status: 400 });
            }

            // Rough size check (~1.5MB limit)
            if (imageData.length > 1_600_000) {
                return NextResponse.json({
                    success: false,
                    error: 'Image is too large. Please use an image under 1MB.'
                }, { status: 400 });
            }

            const matches = imageData.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
            if (!matches) {
                return NextResponse.json({
                    success: false,
                    error: 'Could not read the uploaded image. Please try a different file.'
                }, { status: 400 });
            }

            const mimeType = matches[1];
            const base64Content = matches[2];
            const extension = mimeType.split('/')[1] || 'png';
            const sanitizedName = (imageName || `groupxam-showcase.${extension}`).replace(/[^a-zA-Z0-9._-]/g, '_');
            const cid = `hero-image-${Date.now()}@groupxam`;

            heroAttachmentTemplate = {
                filename: sanitizedName.endsWith(`.${extension}`) ? sanitizedName : `${sanitizedName}.${extension}`,
                content: base64Content,
                encoding: 'base64',
                cid,
                contentType: mimeType,
            };
            heroImageSource = `cid:${cid}`;
        }

        // Create email templates
        const templateFallbackMessages = {
            feature_update: `Sunu-I just got smarter for your learners.\n\nWhat's new:\n- Polished AI responses with clearer study guidance\n- Research-ready answers that surface citations on demand\n- A refreshed admin dashboard to track AI usage at a glance\n\nOpen the dashboard to explore the latest experience.`,
            announcement: `We have an important update to share with you.\n\nHere's the overview:\n- Platform availability schedule\n- What's changing for students\n- How to get support if you have questions\n\nPlease review the full announcement in your dashboard.`,
            promotion: `Boost your study plan with GroupXam Premium.\n\nWith Premium you'll get:\n- Scholarly research assistance with source summaries\n- Coding and writing mentors for every assignment\n- 30-day chat history and advanced study planners\n\nUpgrade now to keep your preparation on track.`,
            custom: `Here's the latest update from the GroupXam team.`,
        };

        const getEmailTemplate = (template, user, subject, messageBody, productLink, productName, heroImage) => {
            const resolvedMessage =
                typeof messageBody === 'string' && messageBody.trim().length > 0
                    ? messageBody
                    : templateFallbackMessages[template] || templateFallbackMessages.feature_update;

            const paragraphs = (resolvedMessage || '')
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .map((line) => `<p style="margin: 0 0 14px; color: #374151; font-size: 15px;">${line}</p>`)
                .join('');

            const heroSection = heroImage
                ? `
            <div style="margin: 0 0 24px;">
              <img
                src="${heroImage}"
                alt="${(productName || 'GroupXam AI Preview').replace(/"/g, '&quot;')}"
                style="width: 100%; max-width: 560px; display: block; margin: 0 auto; border-radius: 18px; box-shadow: 0 18px 40px rgba(79, 70, 229, 0.18);"
              />
            </div>
          `
                : '';

            const buttonText = productName ? `Explore ${productName}` : 'Visit GroupXam';

            const baseTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.7; color: #1f2937; margin: 0; background: #f3f4f6; padding: 0;">
          <div style="max-width: 640px; margin: 0 auto; padding: 32px 20px;">
            <div style="background: linear-gradient(135deg, #312e81 0%, #2563eb 100%); padding: 32px 28px; border-radius: 24px 24px 0 0; text-align: center; position: relative; overflow: hidden;">
              <div style="position:absolute; inset:0; background:linear-gradient(135deg, rgba(236,72,153,0.2), rgba(59,130,246,0.25)); mix-blend-mode: lighten;"></div>
              <div style="position:relative; z-index:1;">
                <p style="margin:0; text-transform:uppercase; letter-spacing:4px; font-size:12px; color:#bfdbfe;">GroupXam Premium</p>
                <h1 style="color:#ffffff; margin:12px 0 0; font-size:28px; font-weight:700;">${productName || 'Discover what\'s new'}</h1>
                <p style="color:#dbeafe; margin:16px auto 0; max-width:440px; font-size:15px;">Smarter study flows, polished AI responses, and an upgraded dashboard to keep every learner on track.</p>
              </div>
          </div>
            <div style="background:#ffffff; padding: 32px 28px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 24px 24px;">
              <h2 style="color:#111827; margin-top: 0; font-size: 22px; font-weight: 700;">Hello ${user.name || 'there'},</h2>
              ${heroSection}
              <div style="background:linear-gradient(135deg, rgba(79,70,229,0.08), rgba(59,130,246,0.08)); padding: 22px; border-radius: 18px; border: 1px solid rgba(79,70,229,0.18); margin-bottom: 24px;">
                ${paragraphs || '<p style="margin:0; color:#374151; font-size:15px;">We\'re excited to show you the latest AI experience inside GroupXam.</p>'}
              </div>
              <div style="text-align:center; margin: 28px 0;">
                <a href="${productLink || (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.groupxam.com')}"
                   style="display:inline-block; padding: 14px 34px; border-radius: 999px; background: linear-gradient(135deg, #4f46e5 0%, #2563eb 100%); color: #ffffff; font-weight: 600; text-decoration: none; box-shadow: 0 16px 30px rgba(79, 70, 229, 0.35);">
                  ${buttonText}
                </a>
              </div>
              <div style="background:#f9fafb; border-radius:16px; padding:20px; border:1px solid #e5e7eb;">
                <p style="margin:0; color:#4b5563; font-size:14px;">
                  Need a hand getting started? Reply to this email or reach us at
                  <a href="mailto:${process.env.GMAIL_ADDRESS}" style="color:#2563eb; text-decoration:none;">${process.env.GMAIL_ADDRESS}</a>.
                  We're here to help your learners stay ahead.
                </p>
              </div>
            </div>
          </div>
          <div style="text-align: center; margin: 24px 0 0; font-size: 12px; color: #6b7280;">
            <p style="margin:0;">© ${new Date().getFullYear()} GroupXam. All rights reserved.</p>
            <p style="margin:4px 0 0;">You’re receiving this because you’re part of the GroupXam community.</p>
          </div>
        </body>
        </html>
      `;

            return baseTemplate;
        };

        // Send emails to each user
        const emailPromises = users.map(async (user) => {
            try {
                const emailHtml = getEmailTemplate(template, user, subject, message, productLink, productName, heroImageSource);

                const mailOptions = {
                    from: {
                        name: 'GroupXam Team',
                        address: process.env.GMAIL_ADDRESS
                    },
                    to: user.email,
                    subject: subject,
                    html: emailHtml,
                    attachments: heroAttachmentTemplate ? [{ ...heroAttachmentTemplate }] : undefined,
                };

                await transporter.sendMail(mailOptions);
                return { success: true, email: user.email };
            } catch (error) {
                console.error(`Failed to send email to ${user.email}:`, error);
                return { success: false, email: user.email, error: error.message };
            }
        });

        // Wait for all emails to be sent
        const results = await Promise.all(emailPromises);

        const successful = results.filter(r => r.success);
        const failed = results.filter(r => !r.success);

        // Log the email sending activity
        try {
            await db.collection('activities').insertOne({
                message: `Admin sent email notification to ${successful.length} users`,
                timestamp: new Date(),
                type: 'email_notification',
                details: {
                    subject,
                    template,
                    totalRecipients: users.length,
                    successful: successful.length,
                    failed: failed.length,
                    failedEmails: failed.map(f => f.email)
                }
            });
        } catch (logError) {
            console.error('Failed to log email activity:', logError);
        }

        return NextResponse.json({
            success: true,
            sentCount: successful.length,
            failedCount: failed.length,
            results: {
                successful: successful.map(s => s.email),
                failed: failed.map(f => ({ email: f.email, error: f.error }))
            }
        });

    } catch (error) {
        console.error('Error sending emails:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to send emails. Please try again.'
        }, { status: 500 });
    }
}
