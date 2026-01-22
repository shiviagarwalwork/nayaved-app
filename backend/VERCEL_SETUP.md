# NayaVed Backend - Vercel Deployment Setup

The backend has been deployed to Vercel at:
```
https://backend-8j5meijqw-shiviagarwalwork-6100s-projects.vercel.app
```

## Required Configuration

### Step 1: Add Environment Variables

You need to add the following environment variables in Vercel:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **backend** project
3. Go to **Settings** → **Environment Variables**
4. Add these variables for **Production**, **Preview**, and **Development**:

| Variable | Value | Description |
|----------|-------|-------------|
| `CLAUDE_API_KEY` | `sk-ant-api...` | Your Anthropic API key from console.anthropic.com |
| `DEVELOPER_CODES` | `AYUVED_DEV_2024,SHIVI_ACCESS` | Comma-separated developer access codes |
| `FREE_SCAN_LIMIT` | `2` | Number of free AI scans |
| `FREE_CHAT_LIMIT` | `10` | Number of free chat messages |

**Or use CLI:**
```bash
vercel env add CLAUDE_API_KEY
# Then paste your API key when prompted

vercel env add DEVELOPER_CODES
# Enter: AYUVED_DEV_2024,SHIVI_ACCESS

vercel env add FREE_SCAN_LIMIT
# Enter: 2

vercel env add FREE_CHAT_LIMIT
# Enter: 10
```

### Step 2: Disable Deployment Protection (Required for Public API)

The API needs to be publicly accessible for the mobile app. To disable protection:

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select the **backend** project
3. Go to **Settings** → **Deployment Protection**
4. Under "Vercel Authentication", select **Disabled**
5. Click **Save**

### Step 3: Redeploy

After setting environment variables and disabling protection:

```bash
cd backend
vercel --prod --yes
```

Or from Vercel Dashboard:
1. Go to **Deployments** tab
2. Click the three dots on latest deployment
3. Select **Redeploy**

---

## Verify Deployment

After setup, test the API:

```bash
# Health check
curl https://backend-8j5meijqw-shiviagarwalwork-6100s-projects.vercel.app/

# Expected response:
# {"status":"ok","service":"NayaVed API","version":"1.0.0"}
```

---

## Custom Domain (Optional)

To use a custom domain like `api.nayaved.app`:

1. Go to **Settings** → **Domains**
2. Add your domain
3. Configure DNS as instructed
4. Update the mobile app's API URL

---

## Production URL

Once configured, your production API URL is:
```
https://backend-8j5meijqw-shiviagarwalwork-6100s-projects.vercel.app
```

Or with a simpler alias:
```bash
vercel alias backend-8j5meijqw-shiviagarwalwork-6100s-projects.vercel.app nayaved-api.vercel.app
```

---

## Troubleshooting

### "Authentication Required" Error
- Deployment protection is still enabled
- Go to Settings → Deployment Protection → Disable

### "Server configuration error: API key not set"
- CLAUDE_API_KEY environment variable is missing
- Add it via dashboard or CLI

### API Returns 500 Error
- Check Vercel logs: `vercel logs backend-xxx.vercel.app`
- Verify Claude API key is valid

### CORS Errors from Mobile App
- The API already has CORS enabled for all origins
- If issues persist, check the request headers

---

*Setup guide created: January 21, 2026*
