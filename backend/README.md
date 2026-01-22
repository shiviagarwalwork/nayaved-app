# NayaVed Backend API

Backend service for the NayaVed Ayurveda mobile app. Handles Claude AI integration, user usage tracking, and subscription management.

## Features

- Claude Vision API integration for image analysis (tongue, skin, eyes, nails)
- Claude Chat API for Ayurvedic consultations
- Usage tracking and limits for free tier users
- Developer access codes for unlimited testing
- Premium subscription support (ready for IAP integration)

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```
CLAUDE_API_KEY=sk-ant-your-api-key-here
DEVELOPER_CODES=AYUVED_DEV_2024,YOUR_CUSTOM_CODE
FREE_SCAN_LIMIT=2
FREE_CHAT_LIMIT=10
PORT=3000
```

### 3. Run Locally

```bash
npm run dev
```

The server will start at http://localhost:3000

## Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the backend directory
3. Set environment variables in Vercel dashboard:
   - `CLAUDE_API_KEY`
   - `DEVELOPER_CODES`
   - `FREE_SCAN_LIMIT`
   - `FREE_CHAT_LIMIT`

### Deploy to Railway

1. Connect your GitHub repo to Railway
2. Set the root directory to `backend`
3. Add environment variables in Railway dashboard

### Deploy to Render

1. Create a new Web Service
2. Connect your repo and set root to `backend`
3. Add environment variables

## API Endpoints

### Health Check
```
GET /
```

### User Status
```
GET /api/user/status
Headers: x-user-id: <user_id>
```

### Developer Access
```
POST /api/developer/activate
Headers: x-user-id: <user_id>
Body: { "code": "AYUVED_DEV_2024" }
```

### Vision Analysis
```
POST /api/analyze/tongue
POST /api/analyze/skin
POST /api/analyze/eyes
POST /api/analyze/nails

Headers: x-user-id: <user_id>
Body: { "imageBase64": "<base64_image_data>" }
```

### Chat Consultation
```
POST /api/chat/consultation
Headers: x-user-id: <user_id>
Body: {
  "message": "I have trouble sleeping",
  "conversationHistory": [],
  "userDosha": "Vata"
}
```

## Usage Limits

### Free Tier
- 2 AI scans total
- 10 chat messages total

### Premium/Developer
- Unlimited scans
- Unlimited chat messages

## Developer Codes

Default code: `AYUVED_DEV_2024`

Add custom codes in `.env`:
```
DEVELOPER_CODES=AYUVED_DEV_2024,TEAM_ACCESS,BETA_TESTER
```

## Production Considerations

1. **Database**: Replace in-memory storage with a proper database (Firebase, Supabase, MongoDB)
2. **Authentication**: Integrate with your auth system for secure user identification
3. **Rate Limiting**: Add rate limiting to prevent abuse
4. **IAP Verification**: Implement Apple/Google receipt verification for premium subscriptions
5. **Logging**: Add proper logging and monitoring
6. **HTTPS**: Ensure HTTPS is enabled in production
