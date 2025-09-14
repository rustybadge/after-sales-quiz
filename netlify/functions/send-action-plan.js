const { Resend } = require('resend');

exports.handler = async function(event, context) {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Parse the form data
    const formData = new URLSearchParams(event.body);
    const email = formData.get('email');
    const company = formData.get('company');
    const totalScore = formData.get('totalScore');
    const persona = formData.get('persona');

    // Initialize Resend (you'll need to add your API key)
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send the email
    const { data, error } = await resend.emails.send({
      from: 'After Sales Quiz <noreply@yourdomain.com>',
      to: [email],
      subject: 'Your After Sales Action Plan is Ready',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Your After Sales Action Plan</h2>
          
          <p>Hi there,</p>
          
          <p>Thanks for completing our After Sales Quiz! Here's your personalized action plan based on your results:</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Quiz Results Summary</h3>
            <p><strong>Company:</strong> ${company || 'Not specified'}</p>
            <p><strong>Overall Score:</strong> ${totalScore}%</p>
            <p><strong>Persona:</strong> ${persona}</p>
          </div>
          
          <h3>Next Steps</h3>
          <ol>
            <li><strong>Review your results</strong> - Focus on categories below 80%</li>
            <li><strong>Prioritize quick wins</strong> - Start with the easiest improvements</li>
            <li><strong>Track progress</strong> - Re-take the quiz in 30 days</li>
          </ol>
          
          <p>We'll follow up with more detailed recommendations and benchmark data within 24 hours.</p>
          
          <p>Best regards,<br>The Humblebee Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="font-size: 12px; color: #666;">
            This email was sent to ${email}. If you didn't expect this, please ignore it.
          </p>
        </div>
      `
    });

    if (error) {
      console.error('Error sending email:', error);
      return { statusCode: 500, body: 'Failed to send email' };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', data })
    };

  } catch (error) {
    console.error('Function error:', error);
    return { statusCode: 500, body: 'Internal server error' };
  }
};
