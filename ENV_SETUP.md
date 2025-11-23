# Environment Variables Setup

This document explains how to set up environment variables for both the backend and frontend to enable production deployment.

## Backend Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Database Connection
CONNECTION_STRING=mongodb://localhost:27017/foodrecipe

# Server Configuration
PORT=8000
NODE_ENV=development

# JWT Secret Key (change this to a strong random string in production)
SECERET_KEY=your-secret-key-here-change-in-production

# Message Encryption Key (must be exactly 32 characters)
ENCRYPTION_KEY=your-32-char-secret-key-here!!

# API Base URL (for production, set this to your deployed backend URL)
API_BASE_URL=http://localhost:8000
```

### Production Backend Example:
```env
CONNECTION_STRING=mongodb+srv://username:password@cluster.mongodb.net/foodrecipe
PORT=8000
NODE_ENV=production
SECERET_KEY=your-very-secure-random-secret-key-here
API_BASE_URL=https://your-backend-domain.com
```

## Frontend Environment Variables

Create a `.env` file in the `Frontend/Food-blog-Web/` directory with the following variable:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000
```

### Production Frontend Example:
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

**Note:** In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend code.

## How It Works

- The frontend uses `src/config/api.js` which reads from `import.meta.env.VITE_API_BASE_URL`
- If the environment variable is not set, it defaults to `http://localhost:8000`
- All API calls in the frontend use the `API_BASE_URL` constant from the config file
- The backend uses `process.env` to read environment variables

## Deployment Checklist

1. ✅ Create `.env` file in backend directory
2. ✅ Create `.env` file in frontend directory
3. ✅ Set `VITE_API_BASE_URL` to your production backend URL
4. ✅ Set `API_BASE_URL` in backend `.env` (if needed)
5. ✅ Update `CONNECTION_STRING` with production MongoDB URI
6. ✅ Set a strong `SECERET_KEY` for JWT tokens
7. ✅ Set `NODE_ENV=production` in backend

## Security Notes

- **Never commit `.env` files to version control**
- Add `.env` to `.gitignore`
- Use strong, random values for `SECERET_KEY` in production
- Use HTTPS in production for API calls

