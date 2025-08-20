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
      from: 'After-Sales Quiz <noreply@humblebee.se>',
      to: [email],
      subject: 'Your Humblebee After-Sales Action Plan',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your Action Plan is Ready! 🎯</h2>
          
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
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This email was sent to ${email}. If you didn't expect this, please ignore it.
          </p>
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
