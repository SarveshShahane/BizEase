# Vercel Deployment Guide

## 🚀 Deploying to Vercel

This project has been configured for Vercel deployment. Follow these steps:

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Configure Environment Variables
Before deployment, you need to set up environment variables in Vercel:

```bash
# Set Telegram credentials
vercel env add TELEGRAM_BOT_TOKEN
vercel env add TELEGRAM_CHAT_ID

# Set Reddit credentials
vercel env add REDDIT_CLIENT_ID
vercel env add REDDIT_CLIENT_SECRET
vercel env add REDDIT_USERNAME
vercel env add REDDIT_PASSWORD
vercel env add REDDIT_SUBREDDIT
```

Or set them via the Vercel dashboard:
1. Go to your project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the same names as above

### 4. Deploy
```bash
# From the project root directory
vercel

# Or for production deployment
vercel --prod
```

## 📋 Deployment Checklist

- [ ] Environment variables configured
- [ ] All dependencies listed in package.json
- [ ] Vercel configuration verified
- [ ] Test deployment successful

## 🔧 Architecture Changes for Vercel

The app has been refactored for serverless deployment:

1. **File Storage**: Changed from disk storage to memory storage for file uploads
2. **Express App**: Converted to serverless function in `/api/index.js`
3. **Static Files**: Moved to `/public` directory for static hosting
4. **Routes**: All API routes now handle Vercel's request/response format

## 🌐 Post-Deployment

After successful deployment:
1. Test both text and image posting
2. Verify Telegram and Reddit integrations
3. Check error handling and logs in Vercel dashboard

## 💡 Tips

- Vercel provides automatic HTTPS
- Functions timeout after 30 seconds on the free plan
- File uploads are limited by memory constraints
- Use Vercel dashboard for monitoring and logs
