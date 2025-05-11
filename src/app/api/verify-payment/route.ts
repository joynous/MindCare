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

    const { paymentId, registrationId, amount, eventId } = await req.json();
    
    // 1. Capture payment
    const captureResponse = await razorpay.payments.capture(
      paymentId,
      amount * 100,
      "INR"
    );

    // 2. Verify capture status
    if (captureResponse.status !== 'captured') {
      return NextResponse.json(
        { success: false, error: `Capture failed: ${captureResponse.error_description}` },
        { status: 400 }
      );
    }

     // Check available seats
    const { data: eventData, error: eventError } = await supabase
      .from('events')
      .select('totalSeats, bookedSeats')
      .eq('eventId', eventId)
      .single();

    if (eventError || !eventData) throw new Error('Event not found');
    if (eventData.bookedSeats >= eventData.totalSeats) {
      throw new Error('No seats available');
    }

    // Update booked seats
    const { error: seatError } = await supabase
      .from('events')
      .update({ bookedSeats: eventData.bookedSeats + 1 })
      .eq('eventId', eventId);

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
      sendSmtpEmail.subject = `Registration Confirmed: ${registration.event}`;
      sendSmtpEmail.htmlContent = `
          <p>Hello ${registration.name},</p>
          <h3>Your registration details:</h3>
          <ul>
            <li>Event: ${registration.event}</li>
            <li>Date: dummyDate</li>
            <li>Venue: dummyVenue</li>
          </ul>
          <p>We look forward to seeing you at the event!</p>
          <p>Payment Amount: ₹${amount}</p>
          <p>Transaction ID: ${paymentId}</p>
        `;

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