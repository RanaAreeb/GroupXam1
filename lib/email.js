import nodemailer from 'nodemailer';

// Create transporter using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_ADDRESS,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
  });
};

// Generate a random 6-digit verification code
export const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send verification email
export const sendVerificationEmail = async (email, verificationCode, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: email,
      subject: 'Verify Your groupXam Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">groupXam</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Account Verification</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Hello ${userName}!</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px;">
              Thank you for creating an account with groupXam! To complete your registration and start your learning journey, please verify your email address.
            </p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <p style="color: #374151; font-size: 14px; margin: 0 0 10px 0; font-weight: 600;">Your verification code is:</p>
              <div style="background: #10b981; color: white; font-size: 32px; font-weight: bold; padding: 15px; border-radius: 8px; letter-spacing: 4px; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </div>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px;">
              Enter this code in the verification form to activate your account. This code will expire in 10 minutes for security reasons.
            </p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 25px 0; border-radius: 4px;">
              <p style="color: #92400e; margin: 0; font-size: 14px;">
                <strong>Security Note:</strong> Never share this code with anyone. groupXam will never ask for your verification code via email or phone.
              </p>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 0;">
              If you didn't create an account with groupXam, please ignore this email.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 groupXam. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Verification email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    return { success: false, error: error.message };
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, userName, userRole) => {
  try {
    const transporter = createTransporter();

    const roleText = userRole === 'university' ? 'institution' : 'student';
    const dashboardUrl = userRole === 'university' ? '/university/dashboard' : '/dashboard';

    const mailOptions = {
      from: process.env.GMAIL_ADDRESS,
      to: email,
      subject: 'Welcome to groupXam! Your Account is Now Active',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">groupXam</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Welcome aboard!</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #374151; margin-bottom: 20px;">Welcome to groupXam, ${userName}! 🎉</h2>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 25px;">
              Congratulations! Your email has been successfully verified and your ${roleText} account is now active. You're all set to start your learning journey with groupXam.
            </p>
            
            <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0;">
              <h3 style="color: #065f46; margin: 0 0 15px 0;">What's Next?</h3>
              
              <a href="https://groupxam.com/" 
                 style="background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600; display: inline-block;">
                Visit Homepage
              </a>
            </div>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #374151; margin: 0 0 15px 0;">Getting Started:</h4>
              <ul style="color: #6b7280; line-height: 1.8; margin: 0; padding-left: 20px;">
                <li>Explore our comprehensive study materials</li>
                <li>Take practice quizzes and assessments</li>
                <li>Track your progress and performance</li>
                <li>Connect with other learners</li>
                ${userRole === 'university' ? '<li>Create and manage exams for your students</li>' : ''}
              </ul>
            </div>
            
            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 0;">
              If you have any questions or need assistance, feel free to reach out to our support team. We're here to help you succeed!
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #9ca3af; font-size: 12px;">
            <p>© 2024 groupXam. All rights reserved.</p>
            <p>This email was sent to ${email}</p>
          </div>
        </div>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, error: error.message };
  }
}; 