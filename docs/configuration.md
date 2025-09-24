# Configuration Guide

This guide covers the configuration settings for H2RMS.

## Environment Variables

Create a `.env.local` file in your project root with the following variables:

### Database Configuration

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Application Settings

```env
# Application
NEXT_PUBLIC_APP_NAME=H2RMS
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

### PDF Generation

```env
# PDF Service Configuration
PDF_SERVICE_URL=your_pdf_service_url
PDF_API_KEY=your_pdf_api_key
```

### Email Configuration

```env
# Email Service (optional)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourcompany.com
```

## Application Configuration

### Default Settings

The application includes default configurations in `config/app.js`:

```javascript
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || 'H2RMS',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
  timezone: 'UTC',
  dateFormat: 'YYYY-MM-DD',
  currency: 'USD'
};
```

### Feature Flags

Enable or disable features using environment variables:

```env
# Feature Flags
FEATURE_PDF_EXPORT=true
FEATURE_QR_CODES=true
FEATURE_CHARTS=true
FEATURE_EMAIL_NOTIFICATIONS=false
```

## Database Configuration

See [Supabase Setup](api/supabase-setup.md) for detailed database configuration.

## Security Configuration

### CORS Settings

Configure CORS in your API routes:

```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? ['https://yourdomain.com']
    : ['http://localhost:3000'],
  credentials: true
};
```

### Rate Limiting

Configure rate limiting for API endpoints:

```env
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=15
```

## Logging Configuration

```env
# Logging
LOG_LEVEL=info
LOG_FILE_PATH=./logs/app.log
ENABLE_REQUEST_LOGGING=true
```

## Performance Configuration

```env
# Performance
ENABLE_CACHING=true
CACHE_TTL=300
ENABLE_COMPRESSION=true
```

## Validation

To validate your configuration:

1. Run the configuration check script:
```bash
npm run config:check
```

2. Verify environment variables are loaded:
```bash
npm run config:validate
```

## Environment-Specific Configurations

### Development
- Debug mode enabled
- Hot reloading
- Detailed error messages

### Production
- Optimized builds
- Error reporting
- Performance monitoring

## Next Steps

- [Set up Supabase](api/supabase-setup.md)
- [Configure Authentication](api/authentication.md)
- [Deploy to Vercel](deployment/vercel-deployment.md)