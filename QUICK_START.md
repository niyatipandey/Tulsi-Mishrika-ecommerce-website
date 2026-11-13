# Quick Start Guide - Tulsi Mishrika

**Get your e-commerce site running in 5 minutes!**

---

## ⚡ Quick Setup (Development)

### 1. Prerequisites

```bash
# Check you have these installed:
node --version   # Should be v18 or higher
npm --version    # Should be v9 or higher
git --version    # Any recent version
```

### 2. Install & Configure

```bash
# Navigate to frontend
cd frontend

# Install dependencies (takes ~2 minutes)
npm install

# Set up environment
cp .env.example .env

# Edit .env with your credentials:
# VITE_SUPABASE_URL=https://wovtisaikznykkaegmck.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. Set Up Database

**Option A: Quick Setup (Recommended)**

Your Supabase project already has the schema if you've run migrations before. Just verify:

1. Go to https://supabase.com/dashboard
2. Select your project: `wovtisaikznykkaegmck`
3. Check **Table Editor** - you should see: `profiles`, `products`, `carts`, `cart_items`, `orders`, `order_items`

If tables don't exist:

```bash
cd ../supabase

# Apply migrations
npx supabase db push

# Seed products
npx supabase db execute --file seed.sql
```

### 4. Start Development

```bash
cd frontend
npm run dev
```

**Open**: http://localhost:5173

---

## 🎯 Test the Application

### Login Flow
1. Go to http://localhost:5173
2. Click **Login** in header
3. Enter any email (e.g., `test@example.com`)
4. Click **Continue**
5. Check your email for OTP code
6. Enter 6-digit code
7. ✅ You're logged in!

**Note**: For OTP to work, you need to configure SMTP in Supabase:
- Go to: **Authentication → Providers → Email**
- Configure SMTP settings (Gmail, etc.)

**Quick Test Without Email**: Use Supabase Magic Link:
- Check your email for magic link
- Click link to auto-login

### Shopping Flow
1. Browse **Shop** page
2. Click on a product (Kunj Mishri or Baal Mishri)
3. Click **Add to Cart**
4. Cart badge shows count
5. Click cart icon to view cart
6. Click **Checkout**
7. Fill address and payment info
8. Click **Place Order**
9. ✅ Order confirmed!

### View Orders
1. Go to **Account** page (click profile icon)
2. See your order history
3. Click on an order to view details

---

## 📦 Production Deployment (30 minutes)

### Step 1: Create Production Supabase Project (5 min)

1. Go to https://supabase.com/dashboard
2. Click **New Project**
3. Name: `tulsimishrika-prod`
4. Choose region closest to users (e.g., Mumbai for India)
5. Wait for provisioning

### Step 2: Set Up Production Database (5 min)

```bash
cd supabase

# Link to production project
npx supabase link --project-ref YOUR_PROD_PROJECT_REF

# Push migrations
npx supabase db push

# Seed data
npx supabase db execute --file seed.sql
```

### Step 3: Configure Email (5 min)

1. In Supabase dashboard: **Authentication → Providers → Email**
2. Enable Email provider
3. Configure SMTP:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: your-email@gmail.com
   Password: your-app-password
   ```
4. Save

### Step 4: Deploy Frontend to Vercel (10 min)

1. Push code to GitHub (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Click **New Project**
4. Import your GitHub repository
5. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   ```
   VITE_SUPABASE_URL=https://your-prod-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-prod-anon-key
   ```

7. Click **Deploy**
8. Wait 2-3 minutes
9. ✅ Your site is live!

### Step 5: Test Production (5 min)

Visit your Vercel URL and test:
- [ ] Login with OTP works
- [ ] Products load
- [ ] Add to cart works
- [ ] Checkout works
- [ ] Order appears in account

---

## 🔧 Common Issues & Solutions

### Issue: "Supabase client error"
**Solution**: Check `.env` file has correct credentials

### Issue: "OTP email not received"
**Solution**: 
1. Check spam folder
2. Verify SMTP settings in Supabase
3. Test with a different email provider

### Issue: "Products not loading"
**Solution**: 
1. Check database has products: `SELECT * FROM products;`
2. Run seed: `npx supabase db execute --file seed.sql`

### Issue: "Cart not persisting"
**Solution**: Check user is logged in (cart syncs only for authenticated users)

### Issue: "Build fails"
**Solution**: 
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 📚 Key Files to Know

| File | Purpose |
|------|---------|
| `frontend/.env` | Environment variables (Supabase credentials) |
| `frontend/src/lib/supabase.ts` | Supabase client configuration |
| `frontend/src/store/authStore.ts` | Authentication state |
| `frontend/src/store/cartStore.ts` | Shopping cart state |
| `supabase/migrations/...sql` | Database schema |
| `supabase/seed.sql` | Sample product data |

---

## 🎨 Customization Quick Tips

### Change Colors

Edit `frontend/tailwind.config.js`:

```js
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  accent: '#YOUR_COLOR',
}
```

### Change Products

Edit `supabase/seed.sql`:

```sql
INSERT INTO products (name, price, description, ...)
VALUES ('Your Product', 499, 'Description', ...);
```

Then run: `npx supabase db execute --file seed.sql`

### Add Product Images

1. Upload to Supabase Storage:
   - Dashboard → Storage → Create bucket `product-images`
   - Upload images
2. Get public URL
3. Update product `image_url` in database

### Change Fonts

Edit `frontend/tailwind.config.js`:

```js
fontFamily: {
  display: ['Your Font', 'serif'],
  sans: ['Your Font', 'sans-serif'],
}
```

Add font link in `frontend/index.html`

---

## 📖 Documentation

Detailed guides available in `frontend/`:

- **DEPLOYMENT.md** - Complete production deployment guide
- **PROJECT_SUMMARY.md** - Full project overview
- **README.md** - Project introduction
- **COMPONENTS.md** - Component library
- **AUTH.md** - Authentication system
- **CART.md** - Shopping cart architecture
- **CHECKOUT.md** - Order flow

---

## 🆘 Need Help?

1. **Check Documentation**: Start with the MD files in `frontend/`
2. **Review Logs**:
   - Frontend: Browser DevTools Console
   - Backend: Supabase Dashboard → Logs
3. **Common Solutions**: See "Common Issues" section above
4. **Supabase Docs**: https://supabase.com/docs
5. **Supabase Discord**: https://discord.supabase.com

---

## ✅ Quick Health Check

Run these commands to verify everything:

```bash
# Check Node version
node --version  # Should be v18+

# Check dependencies installed
cd frontend
npm list --depth=0

# Test build
npm run build

# Check database tables
# In Supabase SQL Editor:
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
# Should show: profiles, products, carts, cart_items, orders, order_items

# Check products exist
SELECT * FROM products;
# Should show 2 products
```

---

## 🚀 Ready to Launch?

**Development Checklist:**
- [x] Node 18+ installed
- [x] Dependencies installed (`npm install`)
- [x] Environment variables set (`.env`)
- [x] Database schema applied (migrations)
- [x] Products seeded
- [x] Dev server running (`npm run dev`)
- [x] Login tested
- [x] Shopping flow tested

**Production Checklist:**
- [ ] Production Supabase project created
- [ ] Migrations applied to prod
- [ ] SMTP configured
- [ ] Frontend deployed to Vercel/Netlify
- [ ] Production environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL certificate verified
- [ ] All features tested in production

---

**That's it! You're ready to go!** 🎉

For detailed information, see:
- Full deployment: `DEPLOYMENT.md`
- Project overview: `PROJECT_SUMMARY.md`
- Individual features: Other MD files in `frontend/`

**Happy Selling! 🛍️**
