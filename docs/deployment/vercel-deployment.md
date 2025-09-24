# Vercel Deployment Guide

This guide covers deploying H2RMS to Vercel, including configuration, environment variables, and best practices.

## Prerequisites

- Vercel account (create at [vercel.com](https://vercel.com))
- Git repository with your H2RMS code
- Supabase project configured
- Domain name (optional, for custom domains)

## Quick Deployment

### 1. Deploy from Git Repository

The easiest way to deploy is directly from your Git repository:

1. **Connect Repository**
   - Log in to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository (GitHub, GitLab, or Bitbucket)

2. **Configure Project**
   - **Project Name**: `h2rms` (or your preferred name)
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (unless your Next.js app is in a subdirectory)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

3. **Set Environment Variables** (see section below)

4. **Deploy**
   - Click "Deploy"
   - Wait for build and deployment to complete

### 2. Deploy using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd h2rms
vercel

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your team/personal account)
# - Link to existing project? N (for first deployment)
# - What's your project's name? h2rms
# - In which directory is your code located? ./

# For production deployment
vercel --prod
```

## Environment Variables Configuration

### 1. Required Environment Variables

Add these variables in your Vercel project settings:

```env
# Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Authentication
NEXTAUTH_URL=https://your-app.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key

# Application
NEXT_PUBLIC_APP_NAME=H2RMS
NEXT_PUBLIC_APP_VERSION=1.0.0
NODE_ENV=production
```

### 2. Optional Environment Variables

```env
# Email Configuration
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourcompany.com

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# PDF Generation
PDF_SERVICE_URL=your-pdf-service-url
PDF_API_KEY=your-pdf-api-key

# Analytics (optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

### 3. Setting Environment Variables

**Via Vercel Dashboard:**
1. Go to your project in Vercel Dashboard
2. Click "Settings" tab
3. Click "Environment Variables"
4. Add each variable with appropriate environment (Production, Preview, Development)

**Via Vercel CLI:**
```bash
# Add environment variable
vercel env add VARIABLE_NAME

# List environment variables
vercel env ls

# Remove environment variable
vercel env rm VARIABLE_NAME
```

## Build Configuration

### 1. vercel.json Configuration

Create `vercel.json` in your project root:

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "framework": "nextjs",
  "regions": ["iad1"],
  "functions": {
    "pages/api/**/*.js": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.com"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/api/health",
      "destination": "/api/health"
    }
  ],
  "redirects": [
    {
      "source": "/dashboard",
      "destination": "/dashboard/overview",
      "permanent": false
    }
  ]
}
```

### 2. Next.js Configuration for Vercel

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },

  // Enable static exports for better performance
  output: 'standalone',

  // Image optimization
  images: {
    domains: ['your-supabase-project.supabase.co'],
    formats: ['image/webp', 'image/avif']
  },

  // API routes configuration
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*'
      }
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_VERSION: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0'
  }
};

module.exports = nextConfig;
```

## Database Configuration

### 1. Supabase Configuration for Production

Update your Supabase project settings:

**Authentication Settings:**
- Site URL: `https://your-app.vercel.app`
- Redirect URLs:
  - `https://your-app.vercel.app/api/auth/callback`
  - `https://your-custom-domain.com/api/auth/callback` (if using custom domain)

**API Settings:**
- Enable RLS (Row Level Security) on all tables
- Set up proper CORS policies

### 2. Database Migration for Production

Run migrations after deployment:

```bash
# Using Supabase CLI
supabase db push --project-ref your-project-ref

# Or run SQL directly in Supabase dashboard
```

## Performance Optimization

### 1. Build Optimization

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "cross-env ANALYZE=true next build",
    "export": "next export",
    "postbuild": "next-sitemap"
  }
}
```

### 2. Bundle Analyzer

Install and configure bundle analyzer:

```bash
npm install --save-dev @next/bundle-analyzer cross-env
```

Create `next.config.analyzer.js`:

```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

module.exports = withBundleAnalyzer({
  // Your existing next.config.js content
});
```

### 3. Static Generation

Optimize pages for static generation:

```javascript
// pages/reports/index.js
export async function getStaticProps() {
  // Pre-generate report data at build time
  const staticReportData = await fetchStaticReportData();

  return {
    props: {
      reportData: staticReportData
    },
    revalidate: 3600 // Revalidate every hour
  };
}
```

## Custom Domain Setup

### 1. Add Custom Domain in Vercel

1. Go to project settings in Vercel Dashboard
2. Click "Domains" tab
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. DNS Configuration

**For root domain (example.com):**
```
Type: A
Name: @
Value: 76.76.19.61
```

**For subdomain (www.example.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates for all domains. No additional configuration needed.

## Monitoring and Analytics

### 1. Vercel Analytics

Enable Vercel Analytics:

```bash
npm install @vercel/analytics
```

Add to `pages/_app.js`:

```javascript
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
```

### 2. Error Monitoring

Set up error tracking with Sentry:

```bash
npm install @sentry/nextjs
```

Create `sentry.client.config.js`:

```javascript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1
});
```

### 3. Health Check Endpoint

Create `pages/api/health.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  try {
    // Check database connection
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (error) throw error;

    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: 'connected',
      version: process.env.NEXT_PUBLIC_APP_VERSION
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
```

## Deployment Workflow

### 1. CI/CD with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Run linting
        run: npm run lint

      - name: Build project
        run: npm run build
        env:
          NEXT_PUBLIC_SUPABASE_URL: ${{ secrets.NEXT_PUBLIC_SUPABASE_URL }}
          NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }}

      - name: Deploy to Vercel
        uses: vercel/action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

### 2. Preview Deployments

Vercel automatically creates preview deployments for:
- Pull requests
- Non-production branches

Each preview gets a unique URL for testing.

### 3. Rollback Strategy

**Immediate Rollback:**
```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote [deployment-url]
```

**Rollback via Dashboard:**
1. Go to project in Vercel Dashboard
2. Click "Deployments" tab
3. Find previous successful deployment
4. Click "Promote to Production"

## Security Best Practices

### 1. Environment Variable Security

- Never commit secrets to version control
- Use Vercel's encrypted environment variables
- Rotate secrets regularly
- Use different secrets for different environments

### 2. API Security

```javascript
// middleware/security.js
import rateLimit from 'express-rate-limit';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

// Use in API routes
export default function handler(req, res) {
  limiter(req, res, () => {
    // Your API logic
  });
}
```

### 3. Content Security Policy

Add CSP headers in `next.config.js`:

```javascript
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.app;
      child-src *.youtube.com *.google.com *.supabase.co;
      style-src 'self' 'unsafe-inline' *.googleapis.com;
      img-src * blob: data:;
      media-src 'none';
      connect-src *;
      font-src 'self' *.googleapis.com *.gstatic.com;
    `.replace(/\n/g, '')
  }
];
```

## Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check build logs
   vercel logs [deployment-url]

   # Local build test
   npm run build
   ```

2. **Environment Variable Issues**
   - Ensure all required variables are set in Vercel
   - Check variable names match exactly
   - Verify `NEXT_PUBLIC_` prefix for client-side variables

3. **Database Connection Issues**
   - Verify Supabase URL and keys
   - Check RLS policies
   - Ensure database is accessible from Vercel

4. **Authentication Problems**
   - Update redirect URLs in Supabase
   - Verify `NEXTAUTH_URL` matches deployment URL
   - Check OAuth provider configurations

### Debug Mode

Enable debug logging:

```javascript
// next.config.js
module.exports = {
  env: {
    DEBUG: process.env.NODE_ENV === 'development' ? '1' : '0'
  }
};
```

## Performance Monitoring

### 1. Core Web Vitals

Monitor performance metrics:

```javascript
// pages/_app.js
export function reportWebVitals(metric) {
  switch (metric.name) {
    case 'FCP':
    case 'LCP':
    case 'CLS':
    case 'FID':
    case 'TTFB':
      // Send metrics to analytics service
      analytics.track(metric.name, metric.value);
      break;
    default:
      break;
  }
}
```

### 2. Edge Runtime

Use Edge Runtime for better performance:

```javascript
// pages/api/edge-example.js
export const config = {
  runtime: 'edge'
};

export default function handler(req) {
  return new Response('Hello from the edge!', {
    status: 200,
    headers: {
      'content-type': 'text/plain'
    }
  });
}
```

## Cost Optimization

### 1. Function Optimization

- Keep API routes lightweight
- Use Edge Functions where possible
- Implement proper caching
- Optimize bundle size

### 2. Bandwidth Optimization

- Enable compression
- Optimize images
- Use CDN for static assets
- Implement proper caching headers

### 3. Usage Monitoring

Monitor Vercel usage:
- Function execution time
- Bandwidth usage
- Build minutes
- Number of deployments

## Backup and Disaster Recovery

### 1. Database Backups

Supabase handles automatic backups, but also:

```bash
# Export data
supabase db dump --project-ref your-project-ref > backup.sql

# Import data
psql -h your-host -U postgres -d postgres < backup.sql
```

### 2. Code Backups

- Use Git for version control
- Multiple remote repositories
- Regular snapshots of configuration

### 3. Environment Backup

```bash
# Export environment variables
vercel env pull .env.backup

# Restore environment variables
# (manually add from .env.backup file)
```

## Next Steps

After successful deployment:

1. **Set up monitoring and alerts**
2. **Configure custom domain**
3. **Implement CI/CD pipeline**
4. **Set up staging environment**
5. **Configure backup procedures**
6. **Document deployment process**
7. **Train team on deployment workflow**

For advanced configurations and scaling, see the [Environment Variables](environment-variables.md) guide.