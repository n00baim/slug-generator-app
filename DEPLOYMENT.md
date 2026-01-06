# 🚀 Deploy to Render.com (Free)

Follow these steps to host your slug generator app on the internet for FREE!

## Prerequisites

1. GitHub account (free) - [Sign up here](https://github.com/join)
2. Render.com account (free) - [Sign up here](https://render.com/register)

## Step 1: Push to GitHub

1. **Create a GitHub repository:**
   - Go to https://github.com/new
   - Name: `slug-generator-app`
   - Set to Public
   - DON'T initialize with README (we already have one)
   - Click "Create repository"

2. **Push your code:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Slug Generator App"
   git remote add origin https://github.com/YOUR_USERNAME/slug-generator-app.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy on Render.com

1. **Connect to Render:**
   - Go to https://dashboard.render.com
   - Click "New +" → "Web Service"
   - Click "Connect GitHub" and authorize Render
   - Select your `slug-generator-app` repository

2. **Configure the service:**
   - **Name:** `slug-generator` (or any name you like)
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Select "Free" (⚠️ Very important!)

3. **Click "Create Web Service"**

## Step 3: Wait for Deployment

- First deployment takes 2-3 minutes
- You'll see build logs in real-time
- When done, you'll get a URL like: `https://slug-generator-xxxx.onrender.com`

## ✅ Done!

Your app is now live on the internet! Share the URL with friends!

## Important Notes

### Free Tier Limitations:
- ⚠️ **Sleeps after 15 min of inactivity** - First load after sleep takes 30-60 seconds
- 750 hours/month free (plenty for personal use)
- App stays awake while being used

### To Keep It Awake:
- Use a service like [UptimeRobot](https://uptimerobot.com/) (free) to ping your app every 14 minutes
- Or just accept the 30-second wake-up time (it's free!)

## Troubleshooting

**Build fails?**
- Check that Node version in package.json is correct
- Make sure all dependencies are in package.json

**App crashes?**
- Check Render logs in dashboard
- Make sure PORT environment variable is used (already configured)

**Slow first load?**
- Normal for free tier after sleeping
- Subsequent loads are fast

## Environment Variables

You DON'T need to set any environment variables because:
- We're using Pollinations.ai (no API key needed)
- Everything works out of the box!

---

Need help? Check Render docs: https://render.com/docs
