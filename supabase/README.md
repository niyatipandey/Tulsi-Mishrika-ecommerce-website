# Supabase Database Configuration

This folder contains the database schema and configuration for the Tulsi Mishrika e-commerce application.

## 📁 Files

| File | Purpose |
|------|---------|
| **config.toml** | Supabase local development configuration |
| **migrations/20240101000000_initial_schema.sql** | Database schema only (tables, RLS, triggers) |
| **COMPLETE_SETUP.sql** | 🌟 **All-in-one script** (schema + sample products) |

**Use `COMPLETE_SETUP.sql` for quick setup** - it includes everything!

## 🚀 Quick Setup

### Option 1: Dashboard (Recommended - One Script Does Everything!)

1. Go to https://supabase.com/dashboard/project/YOUR_PROJECT_REF/editor/sql
2. Copy ALL content from **`COMPLETE_SETUP.sql`**
3. Paste and click **RUN**
4. Done! Tables created AND 2 products added in one go! ✅

### Option 2: CLI (Two Steps)

```bash
# Link to your project
npx supabase link --project-ref YOUR_PROJECT_REF

# Apply schema
npx supabase db push
```

Note: CLI method only applies schema. To add sample products, run `COMPLETE_SETUP.sql` in SQL Editor or add products manually in Table Editor.

## 📊 Database Schema

### Tables Created

1. **profiles** - User profiles
2. **products** - Product catalog
3. **carts** - Shopping carts
4. **cart_items** - Cart line items
5. **orders** - Customer orders
6. **order_items** - Order line items

### Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Products are publicly readable when active
- ✅ Users can only access their own carts and orders
- ✅ Automatic profile creation on signup

### Sample Data

- **Kunj Mishri** - ₹299
- **Baal Mishri** - ₹349

## 🔧 Customization

### Add More Products

Edit `seed.sql` or use Supabase Table Editor

### Modify Schema

1. Create new migration file in `migrations/`
2. Run: `npx supabase db push`

## 📖 More Info

See root-level documentation:
- `DATABASE_SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_DATABASE_FIX.md` - Troubleshooting 401 errors
- `DEPLOYMENT.md` - Production deployment guide

## 🆘 Having Issues?

**401 Errors?** → Check `../FIX_API_KEY_NOW.md`

**Tables not created?** → Run `COMPLETE_SETUP.sql` in SQL Editor

**Need help?** → See `../DATABASE_SETUP_GUIDE.md`
