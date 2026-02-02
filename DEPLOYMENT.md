# PlantCare AI - Deployment Guide

This guide will help you deploy the PlantCare AI application with:
- **Frontend**: Vercel (React)
- **Backend**: Render.com (Node.js)
- **Database**: MongoDB Atlas

---

## Prerequisites

Before deploying, make sure you have:
1. A [GitHub](https://github.com) account
2. A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier available)
3. A [Cloudinary](https://cloudinary.com) account (free tier available)
4. A [Vercel](https://vercel.com) account (free)
5. A [Render](https://render.com) account (free tier available)

### API Keys Required:
- **Groq API Key**: Get from [console.groq.com](https://console.groq.com)
- **Google Gemini API Key**: Get from [makersuite.google.com](https://makersuite.google.com/app/apikey)
- **Perenual API Key**: Get from [perenual.com](https://perenual.com/docs/api)

---

## Step 1: Push Code to GitHub

```bash
# Navigate to project root
cd "PlantCare AI"

# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Ready for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/plantcare-ai.git

# Push to GitHub
git push -u origin main
```

---

## Step 2: Set Up MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign in
2. Create a new **Free Cluster** (M0 Sandbox)
3. Choose a cloud provider and region closest to you
4. Click **Create Cluster**
5. Under **Security**:
   - Create a database user with username and password
   - Under **Network Access**, add `0.0.0.0/0` to allow access from anywhere
6. Click **Connect** > **Connect your application**
7. Copy the connection string, it looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password and add database name:
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/plantcare?retryWrites=true&w=majority
   ```

---

## Step 3: Set Up Cloudinary

1. Go to [Cloudinary](https://cloudinary.com) and sign up/login
2. Go to **Dashboard**
3. Note down:
   - Cloud Name
   - API Key
   - API Secret

---

## Step 4: Deploy Backend on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** > **Web Service**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `plantcare-api`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `plant-care-backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

5. Add **Environment Variables** (click "Advanced" > "Add Environment Variable"):

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A random 32+ character string |
   | `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name |
   | `CLOUDINARY_API_KEY` | Your Cloudinary API key |
   | `CLOUDINARY_API_SECRET` | Your Cloudinary API secret |
   | `GEMINI_API_KEY` | Your Google Gemini API key |
   | `GROQ_API_KEY` | Your Groq API key |
   | `PERENUAL_API_KEY` | Your Perenual API key |
   | `FRONTEND_URL` | Leave empty for now (add after frontend deploy) |

6. Click **Create Web Service**
7. Wait for deployment to complete (first deploy takes 5-10 minutes)
8. Copy your backend URL (e.g., `https://plantcare-api.onrender.com`)

---

## Step 5: Deploy Frontend on Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** > **Project**
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Create React App
   - **Root Directory**: `plant-care-frontend`

5. Add **Environment Variables**:

   | Key | Value |
   |-----|-------|
   | `REACT_APP_API_URL` | Your Render backend URL (e.g., `https://plantcare-api.onrender.com`) |

6. Click **Deploy**
7. Wait for deployment to complete
8. Copy your frontend URL (e.g., `https://plantcare-ai.vercel.app`)

---

## Step 6: Update Backend CORS (Important!)

1. Go back to Render Dashboard
2. Click on your `plantcare-api` service
3. Go to **Environment**
4. Add or update:
   - `FRONTEND_URL` = Your Vercel frontend URL (e.g., `https://plantcare-ai.vercel.app`)
5. Click **Save Changes** - this will trigger a redeploy

---

## Step 7: Verify Deployment

1. Visit your frontend URL
2. Test the following features:
   - User registration and login
   - Adding a plant
   - Disease detection (with image upload)
   - Care reminders
   - AI suggestions

---

## Troubleshooting

### Backend not connecting to database
- Verify MongoDB Atlas connection string is correct
- Ensure `0.0.0.0/0` is in Network Access whitelist
- Check Render logs for connection errors

### Images not uploading
- Verify Cloudinary credentials are correct
- Check Cloudinary dashboard for any errors

### AI features not working
- Verify GROQ_API_KEY and GEMINI_API_KEY are set
- Check API rate limits on respective dashboards

### CORS errors
- Ensure FRONTEND_URL is set correctly in Render
- Clear browser cache and try again

### Free tier limitations
- **Render Free**: Service spins down after 15 minutes of inactivity. First request after spin-down takes 30-60 seconds.
- **MongoDB Atlas M0**: 512MB storage limit
- **Cloudinary Free**: 25GB bandwidth/month

---

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render (Backend):
1. Go to Service Settings > Custom Domains
2. Add your custom domain
3. Update DNS records as instructed

---

## Environment Variables Summary

### Backend (Render)
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=your_random_secret
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
GEMINI_API_KEY=xxx
GROQ_API_KEY=xxx
PERENUAL_API_KEY=xxx
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
REACT_APP_API_URL=https://your-backend.onrender.com
```

---

## Support

If you encounter any issues, check:
1. Render logs for backend errors
2. Browser console for frontend errors
3. Network tab for API request failures

Good luck with your deployment! 🌱
