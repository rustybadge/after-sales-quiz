# Email Setup for After Sales Quiz

## Current Status
✅ Form submission working  
❌ Automatic emails not configured  

## Option 1: Zapier Webhook (Easiest - No Code)

1. **Go to [Zapier.com](https://zapier.com)** and create an account
2. **Create a new Zap** with this trigger:
   - **Trigger**: "Webhooks by Zapier" → "Catch Hook"
3. **Add Action**: "Email by Zapier" → "Send Email"
4. **Configure the email** with your quiz results template
5. **Copy the webhook URL** from Zapier
6. **Add to Netlify**: Go to Site Settings → Forms → Form notifications → Add notification → Webhook

## Option 2: Make.com (Formerly Integromat)

1. **Go to [Make.com](https://make.com)** and create an account
2. **Create a new scenario** with:
   - **Trigger**: "Netlify" → "Form submission"
   - **Action**: "Email" → "Send email"
3. **Connect your email service** (Gmail, Outlook, etc.)
4. **Test the automation**

## Option 3: Manual Processing (Simple but Not Scalable)

1. **Check Netlify dashboard** daily for new submissions
2. **Manually send emails** using your email client
3. **Use email templates** for consistency

## Option 4: Netlify Functions (Advanced - Requires Code)

The `netlify/functions/send-action-plan.js` file I created requires:
1. **Resend API key** (email service)
2. **Custom domain** for sending emails
3. **Environment variables** in Netlify

## Recommended: Start with Option 1 (Zapier)

Zapier is the easiest way to get started:
- No coding required
- Connects directly to Netlify
- Can send to Gmail, Outlook, or any email service
- Free tier allows 100 webhook calls/month

## Next Steps

1. **Choose your preferred option** (Zapier recommended)
2. **Set up the integration**
3. **Test with a form submission**
4. **Customize your email template**

## Email Template Example

```
Subject: Your After Sales Action Plan is Ready

Hi there,

Thanks for completing our After Sales Quiz! Here's your personalized action plan:

Company: [Company Name]
Overall Score: [Score]%
Persona: [Persona Type]

Next Steps:
1. Review your results - Focus on categories below 80%
2. Prioritize quick wins - Start with the easiest improvements  
3. Track progress - Re-take the quiz in 30 days

We'll follow up with detailed recommendations within 24 hours.

Best regards,
The Humblebee Team
```
