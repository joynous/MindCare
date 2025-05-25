// app/api/verify-payment/route.ts
import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { supabase } from '../../lib/supabase';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const brevo = require('@getbrevo/brevo'); // Use require instead of import

// Initialize legacy Brevo client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.apiKey = {
    'api-key': process.env.BREVO_API_KEY
};
apiInstance.defaultHeaders = {
  'api-key': process.env.BREVO_API_KEY
};

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    if (!process.env.BREVO_API_KEY || !process.env.SENDER_EMAIL) {
      throw new Error('Email service configuration is missing');
    }

    const { paymentId, registrationId, amount, eventId} = await req.json();
    
    //1. Check available seats
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('totalseats, bookedseats, eventname, eventvenue, eventdate, eventtime')
      .eq('eventid', eventId)
      .single();

    console.log("eventError", eventError);

    if (eventError || !eventData) throw new Error('Event not found');
    if (eventData.bookedseats >= eventData.totalseats) {
      throw new Error('No seats available');
    }


    // 2. Capture payment
    const captureResponse = await razorpay.payments.capture(
      paymentId,
      amount * 100,
      "INR"
    );
    
    // 3. Verify capture status
    if (captureResponse.status !== 'captured') {
      return NextResponse.json(
        { success: false, error: `Capture failed: ${captureResponse.error_description}` },
        { status: 400 }
      );
    }

    // Update booked seats
    const { error: seatError } = await supabase
      .from('events')
      .update({ bookedseats: eventData.bookedseats + 1 })
      .eq('eventid', eventId);

    if (seatError) throw seatError;


    // 3. Update database
    const { error: updateError } = await supabase
      .from('registrations')
      .update({
        payment_id: paymentId,
        status: 'captured',
        amount: amount,
        event: eventId
      })
      .eq('id', registrationId);

    if (updateError) throw updateError;

    // 4. Get user details for email
    const { data: registration, error: fetchError } = await supabase
      .from('registrations')
      .select('email, name, event')
      .eq('id', registrationId)
      .single();

    if (fetchError) throw fetchError;

    // 5. Send confirmation email
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      sendSmtpEmail.to = [{ email: registration.email, name: registration.name }];
      sendSmtpEmail.sender = { 
        email: process.env.SENDER_EMAIL,
        name: 'Mental Health Community' 
      };
      sendSmtpEmail.subject = `Registration Confirmed: ${eventData.eventname}`;
      sendSmtpEmail.htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        /* Inline CSS for email client compatibility */
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #F7FFF7; }
        .container { max-width: 600px; margin: 0 auto; padding: 30px; background: white; }
        .header { background: #3AA3A0; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .logo { max-width: 150px; height: auto; }
        .content { padding: 30px 20px; color: #1A2E35; }
        .details-card { background: #F8F9FA; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .badge { background: #F7D330; color: #1A2E35; padding: 5px 10px; border-radius: 4px; font-size: 12px; }
        .button { background: #3AA3A0; color: white!important; padding: 12px 25px; text-decoration: none; border-radius: 25px; display: inline-block; margin: 15px 0; }
        .footer { text-align: center; padding: 20px; color: #6C757D; font-size: 12px; }
        .social-icon {
  transition: opacity 0.3s ease;
  border-radius: 50%;
  padding: 5px;
  background: #F7FFF7;
}
.social-icon:hover {
  opacity: 0.8;
  background: #3AA3A0;
}
    </style>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <div class="header">
            <img src="[Your-Logo-URL]" class="logo" alt="Joynous Logo">
        </div>

        <!-- Main Content -->
        <div class="content">
            <h1 style="color: #1A2E35; margin-bottom: 25px;">Hi ${registration.name},</h1>
            
            <div style="text-align: center; margin-bottom: 30px;">
                <span class="badge">Registration Confirmed!</span>
                <h2 style="color: #3AA3A0; margin: 15px 0;">${eventData.eventname}</h2>
            </div>

            <!-- Event Details Card -->
            <div class="details-card">
                <h3 style="color: #1A2E35; margin-top: 0;">📅 Event Details</h3>
                <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 15px; margin: 15px 0;">
                    <div style="color: #6C757D;">Date & Time:</div>
                    <div>${new Date(eventData.eventdate).toLocaleDateString('en-IN')} | ${eventData.eventtime}</div>
                    
                    <div style="color: #6C757D;">Venue:</div>
                    <div>${eventData.eventvenue}</div>
                    
                    <div style="color: #6C757D;">Seats Booked:</div>
                    <div>1 Ticket</div>
                </div>
            </div>

            <!-- Payment Details -->
            <div style="margin: 25px 0;">
                <h3 style="color: #1A2E35; margin-bottom: 15px;">💳 Payment Summary</h3>
                <div style="background: #F7FFF7; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                        <span>Amount Paid:</span>
                        <span style="font-weight: bold;">₹${amount}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span>Transaction ID:</span>
                        <span style="color: #3AA3A0;">${paymentId}</span>
                    </div>
                </div>
            </div>

            <!-- CTA Buttons -->
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.joynous.cc/events/${eventId}" class="button">
                    View Event Details
                </a>
                <p style="margin: 15px 0;">Need help? <a href="mailto:support@joynous.cc" style="color: #3AA3A0; text-decoration: none;">
  <span style="border-bottom: 1px solid #3AA3A0;">support@joynous.cc</span>
</a></p>
            </div>
        </div>

<div class="footer">
  <p style="margin-bottom: 10px; color: #1A2E35;">Follow us for updates:</p>
  <div style="margin: 15px 0;">
    <a href="https://www.instagram.com/_joynous_" 
       class="social-icon" 
       style="margin: 0 10px; text-decoration: none; display: inline-block;">
      <img src="https://img.icons8.com/fluency/48/instagram-new.png" 
           alt="Instagram"
           width="32"
           height="32"
           style="display: block; border: 0; outline: none;">
    </a>
    
    <a href="https://chat.whatsapp.com/E8TtSo1ITfiJaAJx0d4nLl" 
       class="social-icon" 
       style="margin: 0 10px; text-decoration: none; display: inline-block;">
      <img src="https://img.icons8.com/color/48/whatsapp--v1.png" 
           alt="WhatsApp"
           width="32"
           height="32"
           style="display: block; border: 0; outline: none;">
    </a>
  </div>
  <p style="font-size: 11px; color: #6C757D; line-height: 1.6;">
    Need help? <a href="mailto:support@joynous.cc" 
                 style="color: #3AA3A0; text-decoration: none; border-bottom: 1px solid #3AA3A0;">
      Contact Support
    </a><br>
    © ${new Date().getFullYear()} Joynous Community<br>
    R K Puram, New Delhi, 110022
  </p>
</div>    
</div>
</body>
</html>`;

        await apiInstance.sendTransacEmail(sendSmtpEmail);
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue even if email fails, but log the error
    }

    return NextResponse.json({ 
      success: true,
      paymentId: captureResponse.id,
      amount: Number(captureResponse.amount) / 100
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Payment processing failed',
        ...(error instanceof Error && process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  }
}