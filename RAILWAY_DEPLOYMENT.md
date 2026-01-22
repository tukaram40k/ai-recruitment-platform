# Railway Deployment Guide

This guide explains how to deploy the AI Recruitment Platform on Railway.

## Prerequisites

- [Railway account](https://railway.app/)
- [Railway CLI](https://docs.railway.app/develop/cli) (optional but recommended)
- GitHub repository connected to Railway

## Architecture on Railway

Railway will deploy 3 services:
1. **PostgreSQL** - Database (Railway plugin)
2. **Backend** - FastAPI Python API
3. **Frontend** - React app with Nginx

## Deployment Steps

### Option 1: Deploy via Railway Dashboard (Recommended)

#### Step 1: Create a New Project
1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository

#### Step 2: Add PostgreSQL Database
1. In your project, click "New"
2. Select "Database" → "Add PostgreSQL"
3. Railway will automatically create `DATABASE_URL` variable

#### Step 3: Deploy Backend Service
1. Click "New" → "GitHub Repo"
2. Select your repository
3. Configure the service:
   - **Root Directory**: `backend`
   - **Start Command**: `python init_db.py && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. Add environment variables (Settings → Variables):
   ```
   SECRET_KEY=<generate-a-secure-random-string>
   ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=1440
   NVIDIA_API_KEY=<your-nvidia-api-key>
   TWO_FACTOR_ENABLED=true
   OTP_EXPIRE_MINUTES=10
   ```

5. Link the PostgreSQL database:
   - Click "Variables"
   - Click "Add Reference"
   - Select the PostgreSQL service's `DATABASE_URL`

6. Generate a domain:
   - Go to Settings → Networking
   - Click "Generate Domain"
   - Note the URL (e.g., `backend-xxx.railway.app`)

#### Step 4: Deploy Frontend Service
1. Click "New" → "GitHub Repo"
2. Select your repository again
3. Configure the service:
   - **Root Directory**: `client`

4. Add environment variables:
   ```
   BACKEND_URL=https://backend-xxx.railway.app
   ```
   (Use the backend URL from Step 3)

5. Generate a domain:
   - Go to Settings → Networking
   - Click "Generate Domain"

### Option 2: Deploy via Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy backend
cd backend
railway up

# Deploy frontend
cd ../client
railway up
```

## Environment Variables Reference

### Backend Service
| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string (auto-set by Railway) |
| `SECRET_KEY` | Yes | JWT signing key (use a long random string) |
| `ALGORITHM` | No | JWT algorithm (default: HS256) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Token expiry (default: 1440) |
| `NVIDIA_API_KEY` | Yes | NVIDIA API key for AI features |
| `TWO_FACTOR_ENABLED` | No | Enable 2FA (default: true) |
| `OTP_EXPIRE_MINUTES` | No | OTP expiry time (default: 10) |
| `SMTP_HOST` | No | SMTP server for email 2FA |
| `SMTP_PORT` | No | SMTP port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASSWORD` | No | SMTP password |

### Frontend Service
| Variable | Required | Description |
|----------|----------|-------------|
| `BACKEND_URL` | Yes | Internal URL to backend service |
| `PORT` | Auto | Set automatically by Railway |

## Post-Deployment

### Verify Deployment
1. Visit your frontend URL
2. Check backend health: `https://your-backend.railway.app/health`
3. Test login functionality

### Custom Domain (Optional)
1. Go to service Settings → Networking
2. Click "Custom Domain"
3. Add your domain
4. Configure DNS as instructed

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is properly linked
- Verify all required env vars are set
- Check logs: `railway logs`

### Frontend can't reach backend
- Ensure BACKEND_URL is set correctly
- Check backend is deployed and has a domain
- Verify backend health endpoint works

### Database connection issues
- Railway PostgreSQL uses SSL by default
- Check the DATABASE_URL format is correct

## Costs

Railway pricing (as of 2024):
- **Hobby Plan**: $5/month (includes $5 usage credit)
- **Pro Plan**: $20/month + usage

Estimated monthly cost for this app: ~$5-15 depending on traffic.

## Local Development

For local development, continue using Docker Compose:
```bash
docker-compose up --build
```

This uses the same Dockerfiles but with local configuration.
