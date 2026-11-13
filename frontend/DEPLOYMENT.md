# Deployment Guide - Tulsi Mishrika E-Commerce

## Overview

This guide walks you through deploying the Tulsi Mishrika e-commerce website to production. The application consists of a React frontend (Vite) and a Supabase backend.

## Prerequisites

Before deploying, ensure you have:
- [x] Supabase project created and configured
- [x] Database migrations applied
- [x] Seed data populated
- [x] Environment variables configured
- [x] All features tested locally

## Architecture

```
Production Stack:
- Frontend: Vercel / Netlify / AWS Amplify
- Backend: Supabase (managed)
- Database: PostgreSQL (Supabase)
- Storage: Supabase Storage (for product images)
- Auth: Supabase Auth (OTP)
```

---

## Step 1: Supabase Production Setup

### 1.1 Create Production Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click "New Project"
3. Choose organization and project name
4. Select region (choose closest to your users)
5. Generate a strong database password
6. Wait for project provisioning (~2 minutes)

### 1.2 Apply Database Migrations

```bash
# Navigate to supabase directory
cd supabase

# Link to your production project
npx supabase link --project-ref YOUR_PROJECT_REF

# Push migrations
npx supabase db push

# OR manually run migrations in SQL Editor
# Copy contents of migrations/20240101000000_initial_schema.sql
# Paste and execute in Supabase SQL Editor
```

### 1.3 Seed Production Data

```bash
# Run seed data
npx supabase db execute --file seed.sql

# OR run manually in SQL Editor
# Copy contents of seed.sql and execute
```

### 1.4 Configure Authentication

**Email Provider (SMTP):**

1. Go to **Authentication → Providers → Email**
2. Enable Email provider
3. Configure SMTP Settings:
   - **Host**: `smtp.gmail.com` (or your provider)
   - **Port**: `587`
   - **Username**: Your email
   - **Password**: App-specific password
   - **Sender Name**: Tulsi Mishrika
   - **Sender Email**: noreply@tulsimishrika.com

**Email Templates:**

Customize email templates in **Authentication → Email Templates**:
- Confirmation email
- Magic Link
- Change Email
- Reset Password

### 1.5 Set Up Storage (Optional for Product Images)

1. Go to **Storage**
2. Create bucket: `product-images`
3. Set as **Public bucket**
4. Upload product images
5. Update seed data with image URLs

### 1.6 Configure Row Level Security

RLS is already configured in migrations. Verify policies:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Should show rowsecurity = true for all tables
```

### 1.7 Get API Credentials

1. Go to **Settings → API**
2. Copy these values:
   - **Project URL**: `https://xxx.supabase.co`
   - **anon/public key**: `eyJ...`
   - **service_role key** (keep secret, never expose)

---

## Step 2: Frontend Production Build

### 2.1 Update Environment Variables

Create `.env.production`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_anon_key
```

**Important:** Never commit `.env.production` to Git!

### 2.2 Build for Production

```bash
cd frontend

# Install dependencies
npm install

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

This creates an optimized build in `frontend/dist/`.

### 2.3 Build Optimization Checklist

- [x] Remove console.logs (except errors)
- [x] Optimize images (compress, use WebP)
- [x] Enable code splitting (Vite default)
- [x] Minify CSS and JS (Vite default)
- [x] Tree-shake unused code (Vite default)
- [x] Set proper caching headers

---

## Step 3: Deploy Frontend

### Option A: Vercel (Recommended)

**One-Click Deploy:**

1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

6. Add Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

7. Click "Deploy"

**Custom Domain:**

1. Go to Project Settings → Domains
2. Add your domain (e.g., `tulsimishrika.com`)
3. Follow DNS configuration instructions
4. Wait for SSL certificate (~24 hours)

### Option B: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
cd frontend
netlify deploy --prod

# Or connect via web UI
# Settings → Build & Deploy
# Build command: npm run build
# Publish directory: dist
```

### Option C: AWS Amplify

1. Go to AWS Amplify Console
2. Click "New App" → "Host web app"
3. Connect repository
4. Configure build:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - cd frontend
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: frontend/dist
       files:
         - '**/*'
     cache:
       paths:
         - frontend/node_modules/**/*
   ```
5. Add environment variables
6. Deploy

### Option D: Self-Hosted (VPS/Server)

```bash
# Build locally
npm run build

# Upload dist/ to server via SCP
scp -r dist/* user@server:/var/www/tulsimishrika

# Configure Nginx
server {
    listen 80;
    server_name tulsimishrika.com;
    root /var/www/tulsimishrika;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Enable gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Get SSL certificate
sudo certbot --nginx -d tulsimishrika.com
```

---

## Step 4: Post-Deployment Verification

### 4.1 Functionality Testing

**Authentication:**
- [ ] OTP login works (email received)
- [ ] Logout works
- [ ] Protected routes redirect to login
- [ ] Session persists across refreshes

**Products:**
- [ ] Shop page loads products
- [ ] Product detail pages work
- [ ] Product images display correctly
- [ ] Prices format correctly

**Cart:**
- [ ] Add to cart works
- [ ] Update quantity works
- [ ] Remove from cart works
- [ ] Cart persists (localStorage + Supabase)
- [ ] Cart count badge updates

**Checkout:**
- [ ] Checkout form validates
- [ ] Address fields work
- [ ] Payment method selection works
- [ ] Order creation succeeds
- [ ] Cart clears after order

**Orders:**
- [ ] Order confirmation displays
- [ ] Order appears in account history
- [ ] Order details are correct

**Content Pages:**
- [ ] All navigation links work
- [ ] Forms submit correctly
- [ ] 404 page displays for invalid routes

### 4.2 Performance Testing

```bash
# Lighthouse audit
npm install -g lighthouse
lighthouse https://tulsimishrika.com --view

# Target scores:
# Performance: >90
# Accessibility: >90
# Best Practices: >90
# SEO: >90
```

**Optimization Tips:**
- Enable CDN (Vercel/Netlify includes this)
- Compress images (use WebP format)
- Enable HTTP/2
- Implement lazy loading for images
- Use font-display: swap for web fonts

### 4.3 Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Environment variables not exposed
- [ ] RLS policies tested and working
- [ ] CORS configured correctly in Supabase
- [ ] XSS protection enabled
- [ ] CSP headers configured
- [ ] Rate limiting on auth endpoints (Supabase default)
- [ ] No sensitive data in client bundle

### 4.4 SEO Optimization

**Meta Tags (in `index.html`):**

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>Tulsi Mishrika - Pure Traditional Crystal Sugar | Natural Mishri</title>
  <meta name="title" content="Tulsi Mishrika - Pure Traditional Crystal Sugar" />
  <meta name="description" content="Experience authentic handcrafted Mishri infused with Tulsi. 100% natural crystal sugar made using centuries-old traditional methods. Free shipping above ₹500." />
  <meta name="keywords" content="mishri, crystal sugar, tulsi mishri, rock sugar, traditional sweetener, natural sugar, indian mishri" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://tulsimishrika.com/" />
  <meta property="og:title" content="Tulsi Mishrika - Pure Traditional Crystal Sugar" />
  <meta property="og:description" content="Handcrafted Mishri infused with Tulsi. 100% natural and pure." />
  <meta property="og:image" content="https://tulsimishrika.com/og-image.png" />
  
  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content="https://tulsimishrika.com/" />
  <meta property="twitter:title" content="Tulsi Mishrika - Pure Traditional Crystal Sugar" />
  <meta property="twitter:description" content="Handcrafted Mishri infused with Tulsi. 100% natural and pure." />
  <meta property="twitter:image" content="https://tulsimishrika.com/og-image.png" />
  
  <link rel="canonical" href="https://tulsimishrika.com/" />
</head>
```

**Sitemap (`public/sitemap.xml`):**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tulsimishrika.com/</loc>
    <priority>1.0</priority>
    <changefreq>weekly</changefreq>
  </url>
  <url>
    <loc>https://tulsimishrika.com/shop</loc>
    <priority>0.9</priority>
    <changefreq>daily</changefreq>
  </url>
  <url>
    <loc>https://tulsimishrika.com/about</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tulsimishrika.com/story</loc>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://tulsimishrika.com/contact</loc>
    <priority>0.7</priority>
  </url>
</urlset>
```

**Robots.txt (`public/robots.txt`):**

```
User-agent: *
Allow: /
Disallow: /account
Disallow: /checkout
Disallow: /order-confirmation

Sitemap: https://tulsimishrika.com/sitemap.xml
```

---

## Step 5: Monitoring & Analytics

### 5.1 Error Tracking

**Sentry (Recommended):**

```bash
npm install @sentry/react @sentry/vite-plugin
```

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: "production",
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay(),
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
});
```

### 5.2 Analytics

**Google Analytics:**

```html
<!-- Add to index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

**Supabase Analytics:**

Built-in analytics available in Supabase Dashboard:
- Database usage
- API requests
- Auth activity
- Storage usage

### 5.3 Uptime Monitoring

**UptimeRobot** or **Pingdom**:
- Monitor `https://tulsimishrika.com`
- Check every 5 minutes
- Alert via email/SMS on downtime

---

## Step 6: Maintenance

### 6.1 Regular Backups

**Supabase Backups:**
- Daily automatic backups (Pro plan)
- Manual backups via: Settings → Database → Backups

### 6.2 Update Dependencies

```bash
# Check for updates
npm outdated

# Update packages
npm update

# Audit security
npm audit
npm audit fix
```

### 6.3 Database Maintenance

```sql
-- Run monthly
VACUUM ANALYZE;

-- Check table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Troubleshooting

### Common Issues

**1. CORS Errors**

Solution: Configure in Supabase → Settings → API:
```
Allowed origins: https://tulsimishrika.com
```

**2. Auth Emails Not Sending**

- Verify SMTP credentials
- Check spam folder
- Test with different email provider
- Check Supabase logs: Logs → Auth

**3. Database Connection Errors**

- Check RLS policies
- Verify API keys
- Check connection pooling limits (Supabase dashboard)

**4. Slow Page Loads**

- Enable CDN
- Optimize images
- Implement code splitting
- Use lazy loading

**5. Build Failures**

- Clear node_modules and reinstall
- Check Node version (v18+ required)
- Verify environment variables

---

## Production Checklist

### Pre-Launch
- [ ] All features tested end-to-end
- [ ] Responsive design verified (mobile, tablet, desktop)
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Performance optimized (Lighthouse >90)
- [ ] SEO meta tags configured
- [ ] Sitemap and robots.txt added
- [ ] SSL certificate configured
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics configured (Google Analytics)
- [ ] Environment variables set correctly
- [ ] Database migrations applied
- [ ] Seed data populated
- [ ] Email SMTP configured
- [ ] Domain configured and DNS propagated

### Post-Launch
- [ ] Monitor error rates
- [ ] Check analytics for traffic
- [ ] Test all critical user flows
- [ ] Monitor database performance
- [ ] Set up uptime monitoring
- [ ] Configure automated backups
- [ ] Document any issues
- [ ] Plan for scaling if needed

---

## Scaling Considerations

### When to Scale

Monitor these metrics:
- Database CPU > 80%
- API response time > 500ms
- Concurrent users > 1000
- Storage > 8GB

### Scaling Options

**Supabase:**
- Upgrade to Pro plan
- Increase connection pooling
- Add read replicas
- Enable Point-in-Time Recovery

**Frontend:**
- Enable CDN (automatic with Vercel/Netlify)
- Implement caching strategies
- Add service workers for offline support
- Use edge functions for SSR

---

## Support

**Resources:**
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)

**Getting Help:**
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: Create issue in project repository

---

## Next Steps

After deployment:
1. **Marketing**: Set up social media, ads
2. **Content**: Add blog, recipes, health benefits articles
3. **Features**: Implement wishlist, product reviews, referrals
4. **Payments**: Integrate real payment gateway (Razorpay, Stripe)
5. **Mobile App**: Consider React Native app
6. **Internationalization**: Add multi-language support

---

**Congratulations! Your Tulsi Mishrika e-commerce site is live! 🎉**
