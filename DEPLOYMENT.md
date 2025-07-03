# 🚀 FREE Deployment Guide: AI Call Assistant

Deploy your AI Call Assistant **completely FREE** using Vercel + Supabase!

## 📋 Prerequisites

- GitHub account
- Node.js installed locally
- Your AI Call Assistant code

## 🗄️ Step 1: Set Up Database (Supabase - FREE)

1. **Go to [Supabase](https://supabase.com)**
2. **Sign up** for a free account
3. **Create new project**
   - Choose a name: "ai-call-assistant"
   - Create a secure password
   - Select region closest to you
4. **Get your database credentials**:
   - Go to Settings → Database
   - Note your connection string
   - Note your password

## 🚀 Step 2: Deploy to Vercel (FREE)

### Option A: GitHub Integration (Recommended)

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-call-assistant.git
   git push -u origin main
   ```

2. **Go to [Vercel](https://vercel.com)**
3. **Sign up** with your GitHub account
4. **Import your repository**
5. **Deploy automatically**

### Option B: Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy your app**
   ```bash
   vercel --prod
   ```

## ⚙️ Step 3: Configure Environment Variables

In your Vercel dashboard, go to **Settings → Environment Variables** and add:

```env
# Database (Required)
DATABASE_URL=postgresql://username:password@host:5432/database_name

# Authentication (Required)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Environment (Required)
NODE_ENV=production

# Optional: For actual Twilio calls
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number

# Optional: For OpenAI features
OPENAI_API_KEY=your-openai-api-key
```

## 🔧 Step 4: Set Up Database Schema

1. **Update your database config** for Supabase:
   ```typescript
   // Update drizzle.config.ts with your Supabase credentials
   export default {
     schema: "./shared/schema.ts",
     out: "./drizzle",
     dialect: "postgresql",
     dbCredentials: {
       url: process.env.DATABASE_URL,
     },
   };
   ```

2. **Run database migrations**:
   ```bash
   npm run db:push
   ```

## 🎉 Step 5: Your App is Live!

Your AI Call Assistant is now deployed and accessible at:
- **Vercel URL**: `https://your-app-name.vercel.app`
- **Custom Domain**: Add your own domain in Vercel settings (optional)

## 💰 Cost Breakdown

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | ✅ FREE | 100GB bandwidth, 1000 functions |
| **Supabase** | ✅ FREE | 500MB database, 2GB transfer |
| **Total** | **$0/month** | Perfect for testing & small apps |

## 🔄 Auto-Deployment

Every time you push to GitHub, Vercel will automatically:
1. Build your app
2. Deploy the new version
3. Update your live site

## 🛠️ Troubleshooting

### Build Issues
- Check your `package.json` build script
- Ensure all dependencies are listed
- Check TypeScript compilation

### Database Connection
- Verify your `DATABASE_URL` is correct
- Check Supabase project status
- Ensure database schema is applied

### Environment Variables
- All required variables are set in Vercel
- No spaces in variable names
- Restart deployment after adding variables

## 📞 Support

If you need help:
1. Check Vercel deployment logs
2. Check Supabase database logs
3. Test locally first with `npm run dev`

---

🎊 **Congratulations!** Your AI Call Assistant is now live and accessible worldwide for **FREE**! 