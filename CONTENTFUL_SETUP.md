# Contentful Email Subscription Setup

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
REACT_APP_CONTENTFUL_SPACE_ID=your_space_id_here
REACT_APP_CONTENTFUL_ACCESS_TOKEN=your_access_token_here
REACT_APP_CONTENTFUL_MANAGEMENT_TOKEN=your_management_token_here
```

## Contentful Content Type Setup

You need to create a new content type called `emailSubscriber` in your Contentful space with the following fields:

### Content Type: `emailSubscriber`

**Fields:**
1. **Email** (Short text, required)
   - Field ID: `email`
   - Validation: Must be a valid email format
   - Unique: Yes

2. **Subscribed At** (Date & time, required)
   - Field ID: `subscribedAt`
   - Default: Current date/time

3. **Status** (Short text, required)
   - Field ID: `status`
   - Default value: `active`
   - Validation: Must be one of: `active`, `inactive`, `unsubscribed`

## How to Get Your Tokens

### 1. Space ID and Access Token
1. Go to your Contentful space
2. Navigate to Settings → API keys
3. Create a new API key or use an existing one
4. Copy the Space ID and Content Delivery API access token

### 2. Management Token
1. Go to Settings → API keys
2. Click on "Content management tokens"
3. Generate a new token
4. Copy the token (this allows the app to create new entries)

## Testing the Integration

Once set up, your email subscription form will:
1. Check if the email already exists in Contentful
2. Save new email addresses to your Contentful space
3. Show appropriate success/error messages
4. Prevent duplicate subscriptions

## Viewing Subscribers

You can view all email subscribers in your Contentful web app under the "Email Subscriber" content type.

## Next Steps

Consider setting up:
- Email automation with services like SendGrid or Mailchimp
- Webhook notifications when new blog posts are published
- Unsubscribe functionality
- Analytics tracking for subscription rates 