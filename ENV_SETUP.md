# NSS Frontend Environment Configuration

This file should be created in your deployment environment (Vercel) with the appropriate backend URL.

## For Vercel Deployment

Set the following environment variable in your Vercel project settings:

```
VITE_API_URL=https://nssbackend-czak.onrender.com/api
```

## How to Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Click on your NSS project
3. Go to "Settings" tab
4. Click "Environment Variables" in the sidebar
5. Add the variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://nssbackend-czak.onrender.com/api`
   - **Environment**: Select "Production", "Preview", and "Development"
6. Click "Save"
7. Redeploy your project

## For Different Environments

### Production (https://app.nationalsportsschool.in)
```
VITE_API_URL=https://nssbackend-czak.onrender.com/api
```

### Development (localhost)
```
VITE_API_URL=http://localhost:3000/api
```

### Staging (if you have one)
```
VITE_API_URL=https://staging-backend.onrender.com/api
```

## Fallback Behavior

If `VITE_API_URL` is not set, the frontend will automatically fallback to:
```
https://nssbackend-czak.onrender.com/api
```

This ensures the application works even without environment variables configured.
