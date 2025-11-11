import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { ObjectId } from 'mongodb';

export async function POST(request) {
    try {
        const { subject, message, template, selectedUsers, productLink, productName } = await request.json();

        // Validate required fields
        if (!subject || !message || !selectedUsers || selectedUsers.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'Missing required fields: subject, message, and selectedUsers'
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

        // Create email templates
        const getEmailTemplate = (template, user, subject, message, productLink, productName) => {
            const baseTemplate = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${subject}</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">GroupXam</h1>
            <p style="color: #e0e0e0; margin: 10px 0 0 0; font-size: 16px;">Your Learning Platform</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e9ecef;">
            <h2 style="color: #2c3e50; margin-top: 0;">Hello ${user.name || 'there'}!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              ${message.replace(/\n/g, '<br>')}
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${productLink || (process.env.NEXT_PUBLIC_BASE_URL || 'https://www.groupxam.com')}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 25px; 
                        display: inline-block; 
                        font-weight: bold;">
                ${productName ? `Try ${productName}` : 'Visit GroupXam'}
              </a>
            </div>
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #6c757d;">
              <p>Thank you for being part of the GroupXam community!</p>
              <p>If you have any questions, feel free to contact us at <a href="mailto:${process.env.GMAIL_ADDRESS}" style="color: #667eea;">${process.env.GMAIL_ADDRESS}</a></p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #6c757d;">
            <p>© ${new Date().getFullYear()} GroupXam. All rights reserved.</p>
            <p>You received this email because you are a registered user of GroupXam.</p>
          </div>
        </body>
        </html>
      `;

            return baseTemplate;
        };

        // Send emails to each user
        const emailPromises = users.map(async (user) => {
            try {
                const emailHtml = getEmailTemplate(template, user, subject, message, productLink, productName);

                const mailOptions = {
                    from: {
                        name: 'GroupXam Team',
                        address: process.env.GMAIL_ADDRESS
                    },
                    to: user.email,
                    subject: subject,
                    html: emailHtml
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
