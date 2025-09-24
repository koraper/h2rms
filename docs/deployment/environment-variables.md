# Environment Variables Guide

This guide covers all environment variables used in H2RMS, their purposes, and how to configure them across different environments.

## Overview

H2RMS uses environment variables for:
- Database configuration
- Authentication settings
- Third-party service integration
- Feature flags
- Performance tuning
- Security configuration

## Core Environment Variables

### 1. Database Configuration

```env
# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Direct Database Connection (Optional)
DATABASE_URL=postgresql://username:password@host:5432/database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=h2rms
DB_USER=postgres
DB_PASSWORD=your-password
DB_SSL=require
```

**Description:**
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL (client-side)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anonymous key for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY`: Secret key for server-side operations with elevated privileges

### 2. Authentication Configuration

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here
NEXTAUTH_DEBUG=false

# JWT Configuration
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Session Configuration
SESSION_MAX_AGE=86400
SESSION_UPDATE_AGE=3600
```

**Description:**
- `NEXTAUTH_URL`: Base URL for authentication callbacks
- `NEXTAUTH_SECRET`: Secret key for JWT token encryption (generate with `openssl rand -base64 32`)
- `JWT_SECRET`: Additional JWT secret for custom token handling

### 3. OAuth Provider Configuration

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Microsoft OAuth
MICROSOFT_CLIENT_ID=your-microsoft-client-id
MICROSOFT_CLIENT_SECRET=your-microsoft-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
```

## Application Configuration

### 1. Basic App Settings

```env
# Application Info
NEXT_PUBLIC_APP_NAME=H2RMS
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_APP_DESCRIPTION="Human Resources Management System"
NEXT_PUBLIC_COMPANY_NAME="Your Company"

# Environment
NODE_ENV=development
NEXT_PUBLIC_ENVIRONMENT=development
VERCEL_ENV=development

# API Configuration
API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_API_URL=http://localhost:3000/api
API_TIMEOUT=30000
```

### 2. Feature Flags

```env
# Feature Toggles
FEATURE_PDF_EXPORT=true
FEATURE_QR_CODES=true
FEATURE_CHARTS=true
FEATURE_EMAIL_NOTIFICATIONS=true
FEATURE_REAL_TIME_UPDATES=true
FEATURE_MOBILE_APP=false
FEATURE_ADVANCED_REPORTING=true
FEATURE_BIOMETRIC_AUTH=false
FEATURE_AI_INSIGHTS=false
FEATURE_MULTI_LANGUAGE=true

# Beta Features
BETA_NEW_DASHBOARD=false
BETA_PERFORMANCE_ANALYTICS=false
BETA_CALENDAR_INTEGRATION=false
```

## Email Configuration

### 1. SMTP Settings

```env
# Email Server
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourcompany.com
EMAIL_REPLY_TO=support@yourcompany.com

# Email Provider (alternative to SMTP)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
```

### 2. Email Templates

```env
# Template Configuration
EMAIL_TEMPLATE_PATH=/templates/emails
EMAIL_LOGO_URL=https://yourcompany.com/logo.png
EMAIL_SUPPORT_EMAIL=support@yourcompany.com
EMAIL_UNSUBSCRIBE_URL=https://yourapp.com/unsubscribe
```

## Third-Party Services

### 1. File Storage

```env
# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Google Cloud Storage
GCS_PROJECT_ID=your-gcs-project-id
GCS_KEY_FILE=path-to-service-account-key.json
GCS_BUCKET=your-gcs-bucket-name

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=your-storage-account
AZURE_STORAGE_KEY=your-storage-key
AZURE_CONTAINER=your-container-name
```

### 2. Analytics & Monitoring

```env
# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Vercel Analytics
VERCEL_ANALYTICS_ID=your-analytics-id

# Sentry Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
SENTRY_AUTH_TOKEN=your-auth-token

# Mixpanel Analytics
NEXT_PUBLIC_MIXPANEL_TOKEN=your-mixpanel-token

# PostHog Analytics
NEXT_PUBLIC_POSTHOG_KEY=your-posthog-key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 3. Communication Services

```env
# Slack Integration
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_WEBHOOK_URL=your-slack-webhook-url

# Microsoft Teams
TEAMS_WEBHOOK_URL=your-teams-webhook-url

# Twilio SMS
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_ID=your-phone-id
```

## Security Configuration

### 1. Encryption & Hashing

```env
# Encryption Keys
ENCRYPTION_KEY=your-32-byte-encryption-key
AES_ENCRYPTION_KEY=your-aes-key
RSA_PRIVATE_KEY=your-rsa-private-key
RSA_PUBLIC_KEY=your-rsa-public-key

# Hashing
BCRYPT_ROUNDS=12
PASSWORD_SALT=your-password-salt
ARGON2_MEMORY=65536
ARGON2_TIME=3
ARGON2_PARALLELISM=4
```

### 2. Security Headers & CORS

```env
# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://yourapp.com
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
CORS_ALLOWED_HEADERS=Content-Type,Authorization,X-Requested-With

# Security Headers
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline'"
HSTS_MAX_AGE=31536000
X_FRAME_OPTIONS=DENY
```

### 3. Rate Limiting

```env
# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_SKIP_SUCCESSFUL=false
RATE_LIMIT_STORE=memory

# API Rate Limits
API_RATE_LIMIT_AUTH=5
API_RATE_LIMIT_GENERAL=100
API_RATE_LIMIT_UPLOAD=10
```

## Performance & Caching

### 1. Caching Configuration

```env
# Redis Cache
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password
REDIS_TTL=3600

# In-Memory Cache
CACHE_ENABLED=true
CACHE_TTL=300
CACHE_MAX_SIZE=100
CACHE_CHECK_PERIOD=600
```

### 2. Performance Settings

```env
# Database Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10
DB_POOL_IDLE_TIMEOUT=10000
DB_QUERY_TIMEOUT=30000

# File Upload Limits
MAX_FILE_SIZE=10485760
MAX_FILES_PER_UPLOAD=5
ALLOWED_FILE_TYPES=jpg,jpeg,png,pdf,doc,docx

# API Timeouts
API_TIMEOUT=30000
UPLOAD_TIMEOUT=120000
REPORT_GENERATION_TIMEOUT=300000
```

## Development & Debugging

### 1. Development Settings

```env
# Development
DEBUG=true
VERBOSE_LOGGING=true
DEV_TOOLS=true
HOT_RELOAD=true
BROWSER_SYNC=false

# Logging
LOG_LEVEL=debug
LOG_FORMAT=combined
LOG_FILE=logs/app.log
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5
```

### 2. Testing Configuration

```env
# Testing
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/h2rms_test
TEST_TIMEOUT=30000
COVERAGE_THRESHOLD=80
E2E_BASE_URL=http://localhost:3000
CYPRESS_BASE_URL=http://localhost:3000

# Mock Data
USE_MOCK_DATA=false
MOCK_API_DELAY=500
SEED_DATABASE=false
```

## Production-Specific Variables

### 1. Production Overrides

```env
# Production Environment
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
DEBUG=false
VERBOSE_LOGGING=false

# Production URLs
NEXTAUTH_URL=https://yourapp.com
NEXT_PUBLIC_API_URL=https://yourapp.com/api
CORS_ORIGIN=https://yourapp.com

# Production Database
DATABASE_URL=postgresql://prod_user:secure_password@prod-host:5432/h2rms_prod
DB_SSL=require
DB_POOL_MAX=20
```

### 2. Monitoring & Alerts

```env
# Health Checks
HEALTH_CHECK_INTERVAL=60000
HEALTH_CHECK_TIMEOUT=5000
UPTIME_ROBOT_KEY=your-uptime-robot-key

# Alerts
ALERT_EMAIL=alerts@yourcompany.com
SLACK_ALERT_WEBHOOK=your-slack-alert-webhook
PAGER_DUTY_KEY=your-pager-duty-key

# Metrics
METRICS_ENABLED=true
METRICS_PORT=9090
PROMETHEUS_ENDPOINT=/metrics
```

## Environment-Specific Configuration

### 1. Development (.env.local)

```env
# Development-specific settings
NODE_ENV=development
NEXTAUTH_URL=http://localhost:3000
DEBUG=true
VERBOSE_LOGGING=true
NEXT_PUBLIC_ENVIRONMENT=development

# Local database
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-local-anon-key
```

### 2. Staging (.env.staging)

```env
# Staging environment
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=staging
NEXTAUTH_URL=https://staging.yourapp.com
DEBUG=false

# Staging database
NEXT_PUBLIC_SUPABASE_URL=https://staging-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-staging-anon-key
```

### 3. Production (.env.production)

```env
# Production environment
NODE_ENV=production
NEXT_PUBLIC_ENVIRONMENT=production
NEXTAUTH_URL=https://yourapp.com
DEBUG=false
VERBOSE_LOGGING=false

# Production database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
```

## Security Best Practices

### 1. Secret Management

```bash
# Generate secure secrets
openssl rand -base64 32  # For NEXTAUTH_SECRET
openssl rand -hex 32     # For encryption keys
uuid                     # For API keys

# Use environment-specific secrets
# Never reuse secrets across environments
# Rotate secrets regularly
```

### 2. Variable Naming Conventions

- Use `NEXT_PUBLIC_` prefix for client-side variables
- Use descriptive names (e.g., `EMAIL_SERVER_HOST` not `EMAIL_HOST`)
- Group related variables with common prefixes
- Use UPPER_CASE_WITH_UNDERSCORES

### 3. Validation

Create environment validation schema:

```javascript
// lib/env.js
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),
  DATABASE_URL: z.string().optional(),
  EMAIL_SERVER_HOST: z.string().optional(),
  EMAIL_SERVER_PORT: z.coerce.number().optional(),
});

export const env = envSchema.parse(process.env);
```

## Loading Environment Variables

### 1. Next.js Configuration

```javascript
// next.config.js
module.exports = {
  env: {
    // Custom environment variables
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Public runtime configuration
  publicRuntimeConfig: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL,
    environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  },

  // Server runtime configuration
  serverRuntimeConfig: {
    secret: process.env.SECRET_KEY,
  },
};
```

### 2. Environment Loading Priority

Next.js loads environment variables in this order:
1. `.env.local` (always loaded, except during tests)
2. `.env.[NODE_ENV].local`
3. `.env.[NODE_ENV]`
4. `.env`

### 3. Custom Environment Loader

```javascript
// lib/loadEnv.js
import { config } from 'dotenv';
import { expand } from 'dotenv-expand';

export function loadEnvironment() {
  const env = config({
    path: [
      '.env.local',
      `.env.${process.env.NODE_ENV}.local`,
      `.env.${process.env.NODE_ENV}`,
      '.env'
    ]
  });

  expand(env);
  return env;
}
```

## Deployment Configuration

### 1. Vercel Deployment

```bash
# Set environment variables via CLI
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_SUPABASE_URL production

# Bulk import from file
vercel env pull .env.local
```

### 2. Docker Configuration

```dockerfile
# Dockerfile
FROM node:18-alpine

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy environment file
COPY .env.production .env.local

# Build application
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### 3. CI/CD Environment Variables

```yaml
# .github/workflows/deploy.yml
env:
  NODE_ENV: production
  NEXT_PUBLIC_ENVIRONMENT: production

jobs:
  deploy:
    environment: production
    env:
      VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
      NEXTAUTH_SECRET: ${{ secrets.NEXTAUTH_SECRET }}
```

## Monitoring & Debugging

### 1. Environment Variable Logging

```javascript
// lib/env-debug.js
export function debugEnvironment() {
  if (process.env.NODE_ENV === 'development') {
    console.log('Environment Variables:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
    console.log('Database connected:', !!process.env.DATABASE_URL);
    console.log('Email configured:', !!process.env.EMAIL_SERVER_HOST);

    // Never log sensitive values in production!
    console.log('Public vars:', Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key];
        return obj;
      }, {})
    );
  }
}
```

### 2. Health Check with Environment

```javascript
// pages/api/health.js
export default function handler(req, res) {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXTAUTH_SECRET',
    'NODE_ENV'
  ];

  const missingVars = requiredVars.filter(
    varName => !process.env[varName]
  );

  if (missingVars.length > 0) {
    return res.status(503).json({
      status: 'unhealthy',
      error: 'Missing environment variables',
      missing: missingVars
    });
  }

  res.status(200).json({
    status: 'healthy',
    environment: process.env.NODE_ENV,
    version: process.env.NEXT_PUBLIC_APP_VERSION
  });
}
```

## Troubleshooting

### Common Issues

1. **Variables not loading**
   - Check file naming (`.env.local`, not `.env.development`)
   - Verify variable names (case-sensitive)
   - Restart development server after changes

2. **Client vs Server variables**
   - Use `NEXT_PUBLIC_` prefix for client-side variables
   - Server-side variables are not accessible in browser

3. **Missing variables in production**
   - Set variables in deployment platform
   - Check environment-specific files
   - Verify build process includes environment loading

### Debug Commands

```bash
# Check loaded environment variables
node -e "console.log(process.env)" | grep NEXT_PUBLIC

# Validate environment file
node -e "require('dotenv').config({path: '.env.local'}); console.log('Loaded successfully')"

# Test environment loading
npm run dev -- --debug
```

## Best Practices Summary

1. **Never commit secrets** to version control
2. **Use different secrets** for each environment
3. **Validate environment variables** at startup
4. **Group related variables** with prefixes
5. **Document all variables** and their purposes
6. **Use strong, unique secrets** (32+ characters)
7. **Rotate secrets regularly**
8. **Monitor for exposed secrets** in logs
9. **Use environment-specific files** properly
10. **Test configuration** in all environments