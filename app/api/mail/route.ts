// app/api/mail/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const QuoteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
});

export async function POST(request: Request) {
  try {
    // Validate environment variables
    const requiredEnvVars = ['SMTP_USERNAME', 'SMTP_PASSWORD', 'ADMIN_EMAIL'];
    const missingEnvVars = requiredEnvVars.filter(
      (envVar) => !process.env[envVar]
    );

    if (missingEnvVars.length > 0) {
      console.error(`Missing environment variables: ${missingEnvVars.join(', ')}`);
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = await request.json();
    const validatedData = QuoteRequestSchema.parse(body);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
      tls: {
        rejectUnauthorized: true
      }
    });

    // Create HTML email content
    const htmlContent = `
      <html>
        <body>
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${validatedData.name}</p>
          <p><strong>Email:</strong> ${validatedData.email}</p>
          <p><strong>Message:</strong> ${validatedData.message}</p>
        </body>
      </html>
    `;

    // Send email
    await transporter.sendMail({
      from: {
        name: 'Contact Form',
        address: process.env.SMTP_USERNAME!
      },
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact Form Submission from ${validatedData.name}`,
      text: `
        Name: ${validatedData.name}
        Email: ${validatedData.email}
        Message: ${validatedData.message}
      `,
      html: htmlContent,
    });

    // Send auto-reply
    await transporter.sendMail({
      from: {
        name: 'Thillai Cable',
        address: process.env.SMTP_USERNAME!
      },
      to: validatedData.email,
      subject: 'Thank You for Contacting Thillai Cable',
      text: `
        Dear ${validatedData.name},
    
        Thank you for reaching out to Thillai Cable. We have received your message and our team will review it promptly.
    
        We strive to respond to all inquiries within 24 hours during business days. If your matter requires immediate attention, please call us at +91 XXX XXX XXXX.
    
        Your Message Details:
        - Name: ${validatedData.name}
        - Email: ${validatedData.email}
        - Message: ${validatedData.message}
    
        Operating Hours:
        Monday - Saturday: 9:00 AM - 8:00 PM
        Sunday: 10:00 AM - 6:00 PM
    
        For quick assistance:
        - Technical Support: +91 XXX XXX XXXX
        - WhatsApp: +91 XXX XXX XXXX
        - Email: support@thillaicable.com
    
        Thank you for choosing Thillai Cable. We appreciate your interest in our services.
    
        Best regards,
        Team Thillai Cable
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333333;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #0047AB;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 5px 5px 0 0;
            }
            .content {
              padding: 20px;
              background-color: #ffffff;
              border: 1px solid #dddddd;
            }
            .message-details {
              background-color: #f9f9f9;
              padding: 15px;
              margin: 20px 0;
              border-left: 4px solid #0047AB;
            }
            .contact-info {
              background-color: #f5f5f5;
              padding: 15px;
              margin-top: 20px;
              border-radius: 5px;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666666;
              font-size: 12px;
            }
            .social-links {
              margin: 20px 0;
              text-align: center;
            }
            .button {
              background-color: #0047AB;
              color: white;
              padding: 10px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You for Contacting Us</h1>
            </div>
            
            <div class="content">
              <p>Dear ${validatedData.name},</p>
              
              <p>Thank you for reaching out to Thillai Cable. We have received your message and our team will review it promptly.</p>
              
              <p>We strive to respond to all inquiries within 24 hours during business days.</p>
    
              <div class="message-details">
                <h3>Your Message Details:</h3>
                <p><strong>Name:</strong> ${validatedData.name}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                <p><strong>Message:</strong> ${validatedData.message}</p>
              </div>
    
              <div class="contact-info">
                <h3>Quick Assistance</h3>
                <p><strong>Operating Hours:</strong></p>
                <p>Monday - Saturday: 9:00 AM - 8:00 PM<br>
                   Sunday: 10:00 AM - 6:00 PM</p>
                
                <p><strong>Contact Information:</strong></p>
                <p>Technical Support: +91 9488223480<br>
                   WhatsApp: +91 9786983480<br>
                   Email: support@thillaicable.com</p>
              </div>
    
              <div class="social-links">
                <p>Follow us on social media for updates and offers:</p>
                <p>
                  Facebook | Instagram | Twitter | YouTube
                </p>
              </div>
            </div>
    
            <div class="footer">
              <p>This is an automated response. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Thillai Cable. All rights reserved.</p>
              <p>Karungallur, 636303</p>
            </div>
          </div>
        </body>
        </html>
      `
    });
    

    return NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );

  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid request data',
          errors: error.errors 
        },
        { status: 400 }
      );
    }

    // Log other errors
    console.error('Error processing contact form:', error);
    
    return NextResponse.json(
      { success: false, message: 'Error sending message' },
      { status: 500 }
    );
  }
}
