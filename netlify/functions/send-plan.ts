import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse the request body
    const body = JSON.parse(event.body);
    console.log('Received body:', JSON.stringify(body, null, 2));
    
    const { email, company, totalScore, personaName, pdfData } = body;

    // Log what we received
    console.log('Extracted fields:', { email, company, totalScore, personaName, pdfDataLength: pdfData ? pdfData.length : 'undefined' });

    if (!email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing email field' })
      };
    }

    if (!pdfData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing PDF data' })
      };
    }

    // Convert base64 PDF data back to buffer
    const pdfBuffer = Buffer.from(pdfData, 'base64');

          // Send email with PDF attachment
      const { data, error } = await resend.emails.send({
        from: 'After-Sales Quiz <onboarding@resend.dev>',
      to: [email],
      subject: 'Your Humblebee After-Sales Action Plan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">HUMBLEBEE</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">After-Sales Performance Experts</p>
          </div>
          
          <!-- Content -->
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb;">
            <h2 style="color: #1f2937; margin-top: 0;">Your Action Plan is Ready! 🎯</h2>
          
          <p>Hi there,</p>
          
          <p>Thanks for completing our After-Sales Quiz! Your personalized action plan is attached to this email.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Quiz Results Summary</h3>
            <p><strong>Company:</strong> ${company || 'Not specified'}</p>
            <p><strong>Overall Score:</strong> ${totalScore}%</p>
            <p><strong>Persona:</strong> ${personaName}</p>
          </div>
          
          <h3>What's in Your Action Plan</h3>
          <ul>
            <li>Detailed category breakdown with scores</li>
            <li>Personalized recommendations based on your results</li>
            <li>90-day implementation roadmap</li>
            <li>Next steps to improve your after-sales performance</li>
          </ul>
          
          <p><strong>Next Steps:</strong></p>
          <ol>
            <li>Review your action plan (attached PDF)</li>
            <li>Focus on categories below 80% first</li>
            <li>Implement the quick wins over the next 30 days</li>
            <li>Re-take the quiz to measure your progress</li>
          </ol>
          
          <p>Need help implementing any of these recommendations? We're here to support you!</p>
          
          <p>Best regards,<br>The Humblebee Team</p>
          </div>
          
          <!-- Footer -->
          <div style="background: #1f2937; padding: 20px; text-align: center; border-radius: 0 0 10px 10px;">
            <img src="data:image/png;base64,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" alt="Humblebee Logo" style="width: 25px; height: 25px; margin-right: 8px; vertical-align: middle;">
            <span style="color: white; font-size: 14px;"><strong>HUMBLEBEE</strong></span>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">After-Sales Performance Optimization</p>
            <p style="color: #9ca3af; margin: 5px 0 0 0; font-size: 12px;">hello@humblebee.se | www.humblebee.se</p>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #374151;">
            <p style="color: #6b7280; margin: 0; font-size: 11px;">
              This email was sent to ${email}. If you didn't expect this, please ignore it.
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `humblebee-action-plan-${company || 'company'}.pdf`,
          content: pdfBuffer
        }
      ]
    });

    if (error) {
      console.error('Error sending email:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to send email' })
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        message: 'Email sent successfully',
        data 
      })
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
