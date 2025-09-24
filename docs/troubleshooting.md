# Troubleshooting Guide

Common issues and solutions for H2RMS.

## Installation Issues

### Node.js Version Conflicts

**Problem**: Application fails to start due to Node.js version mismatch.

**Solution**:
```bash
# Check your Node.js version
node --version

# Install Node.js v18 or higher
# Use nvm (Node Version Manager) for easy switching
nvm install 18
nvm use 18
```

### Package Installation Failures

**Problem**: `npm install` or `yarn install` fails.

**Solutions**:
```bash
# Clear package manager cache
npm cache clean --force
# or
yarn cache clean

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
npm install
```

## Database Issues

### Supabase Connection Errors

**Problem**: Cannot connect to Supabase database.

**Solutions**:
1. Verify your Supabase URL and keys in `.env.local`
2. Check if your Supabase project is active
3. Verify network connectivity

```bash
# Test connection
curl -H "apikey: YOUR_ANON_KEY" https://your-project.supabase.co/rest/v1/
```

### Migration Failures

**Problem**: Database migrations fail to run.

**Solutions**:
```bash
# Reset and rerun migrations
npm run db:reset
npm run db:migrate
```

## Authentication Issues

### NextAuth Configuration

**Problem**: Authentication not working properly.

**Solutions**:
1. Verify `NEXTAUTH_URL` matches your domain
2. Check `NEXTAUTH_SECRET` is set
3. Ensure authentication provider is configured correctly

### Session Management

**Problem**: User sessions not persisting.

**Solutions**:
1. Check cookie settings
2. Verify session configuration in NextAuth
3. Clear browser cookies and try again

## API Issues

### CORS Errors

**Problem**: Cross-origin requests are blocked.

**Solution**:
```javascript
// Add to your API route
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
```

### Rate Limiting

**Problem**: API requests are being rate limited.

**Solutions**:
1. Check your rate limit configuration
2. Implement proper retry logic
3. Consider upgrading your plan if using external services

## PDF Generation Issues

### PDF Service Unavailable

**Problem**: PDF generation fails or times out.

**Solutions**:
1. Check PDF service configuration
2. Verify API keys and endpoints
3. Test PDF service independently
4. Check server resources and memory

### Styling Issues in PDFs

**Problem**: Generated PDFs have formatting issues.

**Solutions**:
1. Use inline CSS for better compatibility
2. Test with different PDF engines
3. Verify font loading
4. Check page size and margins

## Performance Issues

### Slow Page Loading

**Problem**: Application loads slowly.

**Solutions**:
1. Enable Next.js optimizations
2. Implement proper caching strategies
3. Optimize images and assets
4. Use CDN for static resources

### Memory Issues

**Problem**: Application runs out of memory.

**Solutions**:
1. Increase server memory allocation
2. Implement pagination for large datasets
3. Optimize database queries
4. Clear unused cache regularly

## Deployment Issues

### Vercel Deployment Failures

**Problem**: Deployment to Vercel fails.

**Solutions**:
1. Check build logs for errors
2. Verify environment variables are set
3. Ensure all dependencies are listed in package.json
4. Check file size limits

### Environment Variables Not Loading

**Problem**: Environment variables not available in production.

**Solutions**:
1. Add variables to Vercel dashboard
2. Verify variable names match exactly
3. Check if variables need `NEXT_PUBLIC_` prefix
4. Redeploy after adding variables

## Development Issues

### Hot Reloading Not Working

**Problem**: Changes not reflected during development.

**Solutions**:
```bash
# Restart development server
npm run dev

# Clear Next.js cache
rm -rf .next
npm run dev
```

### TypeScript Errors

**Problem**: TypeScript compilation errors.

**Solutions**:
1. Run type checking: `npm run type-check`
2. Update TypeScript definitions
3. Check for missing dependencies
4. Verify tsconfig.json configuration

## Getting Additional Help

### Log Collection

Enable detailed logging for troubleshooting:
```env
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
```

### Debug Mode

Run the application in debug mode:
```bash
DEBUG=* npm run dev
```

### Support Channels

1. Check the [GitHub Issues](https://github.com/your-org/h2rms/issues)
2. Review documentation for updates
3. Contact the development team

### Useful Commands

```bash
# Check system status
npm run health-check

# Validate configuration
npm run config:validate

# Run diagnostics
npm run diagnostics

# Clean and rebuild
npm run clean && npm run build
```