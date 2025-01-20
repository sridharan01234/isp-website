import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Input validation schema
const QuoteRequestSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  address: z.string().optional(),
  plan: z.string().min(1, "Plan selection is required"),
  message: z.string().optional(),
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

    // Parse and validate request body
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

    // Create HTML email content for admin
    const adminHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0047AB; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .quote-details { margin: 20px 0; padding: 15px; border-left: 4px solid #0047AB; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Quote Request</h1>
          </div>
          <div class="content">
            <div class="quote-details">
              <h3>Customer Details:</h3>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
              ${validatedData.phone ? `<p><strong>Phone:</strong> ${validatedData.phone}</p>` : ''}
              ${validatedData.address ? `<p><strong>Address:</strong> ${validatedData.address}</p>` : ''}
              <p><strong>Selected Plan:</strong> ${validatedData.plan}</p>
              ${validatedData.message ? `<p><strong>Message:</strong> ${validatedData.message}</p>` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create HTML email content for customer
    const customerHtmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #0047AB; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; }
          .quote-details { background-color: #f9f9f9; padding: 15px; margin: 20px 0; }
          .contact-info { background-color: #f5f5f5; padding: 15px; margin-top: 20px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Your Quote Request</h1>
          </div>
          <div class="content">
            <p>Dear ${validatedData.name},</p>
            <p>Thank you for requesting a quote from Thillai Cable. We have received your request for our ${validatedData.plan} plan.</p>
            
            <div class="quote-details">
              <h3>Your Request Details:</h3>
              <p><strong>Selected Plan:</strong> ${validatedData.plan}</p>
              <p><strong>Name:</strong> ${validatedData.name}</p>
              <p><strong>Email:</strong> ${validatedData.email}</p>
            </div>

            <p>Our team will review your request and get back to you within 24 hours with a detailed quote.</p>

            <div class="contact-info">
              <h3>Need Immediate Assistance?</h3>
              <p>Contact our support team:</p>
              <p>📞 Phone: +91 9488223480</p>
              <p>📱 WhatsApp: +91 9786983480</p>
              <p>✉️ Email: sridharan01234@gmail.com</p>
              
              <p><strong>Business Hours:</strong><br>
              Monday - Saturday: 9:00 AM - 8:00 PM<br>
              Sunday: 10:00 AM - 6:00 PM</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Thillai Cable. All rights reserved.</p>
            <p>Karungallur, 636303</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to admin
    await transporter.sendMail({
      from: {
        name: 'Quote Request System',
        address: process.env.SMTP_USERNAME!
      },
      to: process.env.ADMIN_EMAIL,
      subject: `New Quote Request - ${validatedData.plan} Plan`,
      html: adminHtmlContent,
    });

    // Send confirmation email to customer
    await transporter.sendMail({
      from: {
        name: 'Thillai Cable',
        address: process.env.SMTP_USERNAME!
      },
      to: validatedData.email,
      subject: 'Thank You for Your Quote Request - Thillai Cable',
      html: customerHtmlContent,
    });

    return NextResponse.json(
      { success: true, message: 'Quote request submitted successfully' },
      { status: 200 }
    );

  } catch (error) {
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

    console.error('Error processing quote request:', error);
    return NextResponse.json(
      { success: false, message: 'Error submitting quote request' },
      { status: 500 }
    );
  }
}
