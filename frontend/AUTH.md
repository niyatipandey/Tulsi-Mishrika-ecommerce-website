# Authentication System Documentation

## Overview

The Tulsi Mishrika e-commerce platform uses **Supabase Authentication** with **OTP (One-Time Password)** login. Users can sign in using either email or phone number (phone UI is present but SMS delivery requires additional Supabase configuration).

## Architecture

### Technology Stack
- **Supabase Auth**: Backend authentication service
- **Zustand**: Global state management for auth state
- **React Router**: Protected routes and navigation
- **TypeScript**: Type-safe authentication interfaces

### Key Components

```
frontend/src/
├── store/
│   └── authStore.ts          # Global auth state with Zustand
├── components/
│   └── auth/
│       ├── OTPInput.tsx      # 6-digit OTP input component
│       └── ProtectedRoute.tsx # Route wrapper for authenticated pages
├── pages/
│   ├── Auth/
│   │   └── Login.tsx         # Login page with OTP flow
│   └── Account/
│       └── Account.tsx       # User account page
└── lib/
    └── supabase.ts           # Supabase client configuration
```

## Authentication Flow

### 1. Sign In with OTP

```typescript
// User enters email/phone
await authStore.signInWithOtp('user@example.com', 'email');

// Supabase sends OTP to user's email
// User receives 6-digit code
```

### 2. Verify OTP

```typescript
// User enters the 6-digit OTP
await authStore.verifyOtp('user@example.com', '123456', 'email');

// On success:
// - User session is created
// - User profile is auto-created in profiles table
// - Auth state is persisted to localStorage
// - User is redirected to intended page
```

### 3. Sign Out

```typescript
await authStore.signOut();

// Clears session and redirects to home
```

## Auth Store API

### State

```typescript
interface AuthState {
  user: User | null;              // Supabase user object
  profile: Profile | null;        // User profile from database
  session: Session | null;        // Supabase session
  loading: boolean;               // Auth initialization loading
  initialized: boolean;           // Auth has been initialized
}
```

### Methods

#### `initialize()`
Initializes the auth state by checking for existing session.

```typescript
// Call once on app mount
useEffect(() => {
  authStore.initialize();
}, []);
```

#### `signInWithOtp(identifier, type)`
Sends OTP to user's email or phone.

```typescript
await authStore.signInWithOtp('user@example.com', 'email');
// or
await authStore.signInWithOtp('+919876543210', 'sms');
```

**Parameters:**
- `identifier`: Email address or phone number
- `type`: `'email'` or `'sms'`

**Returns:** `Promise<{ error: Error | null }>`

#### `verifyOtp(identifier, token, type)`
Verifies the OTP code entered by user.

```typescript
await authStore.verifyOtp('user@example.com', '123456', 'email');
```

**Parameters:**
- `identifier`: Same email/phone used in signInWithOtp
- `token`: 6-digit OTP code
- `type`: `'email'` or `'sms'`

**Returns:** `Promise<{ error: Error | null }>`

#### `signOut()`
Signs out the current user and clears auth state.

```typescript
await authStore.signOut();
```

**Returns:** `Promise<void>`

## Components

### OTPInput Component

A specialized input for 6-digit OTP codes with enhanced UX.

```tsx
<OTPInput
  value={otp}
  onChange={setOtp}
  disabled={isLoading}
/>
```

**Features:**
- Auto-focus on first input
- Auto-advance to next input
- Backspace navigation
- Paste support (paste "123456" fills all inputs)
- Keyboard navigation (arrow keys)
- Disabled state

**Props:**
- `value`: string (current OTP value)
- `onChange`: (value: string) => void
- `disabled?`: boolean

### ProtectedRoute Component

Wrapper component that requires authentication.

```tsx
<Route path="/account" element={
  <ProtectedRoute>
    <Account />
  </ProtectedRoute>
} />
```

**Behavior:**
- Shows loading spinner while checking auth
- Redirects to `/login` if not authenticated
- Stores intended destination in state for post-login redirect
- Renders children if authenticated

## Usage Examples

### Using Auth State in Components

```tsx
import { useAuthStore } from '@/store/authStore';

function MyComponent() {
  const { user, profile, loading } = useAuthStore();

  if (loading) return <LoadingSpinner />;

  if (!user) {
    return <Link to="/login">Sign In</Link>;
  }

  return <div>Welcome, {profile?.full_name || user.email}!</div>;
}
```

### Protecting Routes

```tsx
// In AppRoutes.tsx
{
  path: '/account',
  element: (
    <ProtectedRoute>
      <Account />
    </ProtectedRoute>
  ),
},
{
  path: '/checkout',
  element: (
    <ProtectedRoute>
      <Checkout />
    </ProtectedRoute>
  ),
}
```

### Header with Auth State

```tsx
import { useAuthStore } from '@/store/authStore';

function Header() {
  const { user, signOut } = useAuthStore();

  return (
    <header>
      {user ? (
        <div>
          <span>{user.email}</span>
          <button onClick={signOut}>Logout</button>
        </div>
      ) : (
        <Link to="/login">Sign In</Link>
      )}
    </header>
  );
}
```

## Login Page Flow

### Email/Phone Toggle

The login page supports both email and phone authentication:

```tsx
const [authType, setAuthType] = useState<'email' | 'phone'>('email');
```

Users can switch between email and phone input at any time.

### Step-by-Step Flow

1. **Enter Identifier**
   - User enters email or phone number
   - Validation ensures proper format
   - Click "Send OTP" button

2. **Send OTP**
   - Loading state shown
   - `signInWithOtp()` called
   - Success message: "OTP sent! Check your email/phone"
   - Move to OTP entry step

3. **Enter OTP**
   - 6-digit OTP input shown
   - Auto-focus on first input
   - User enters code from email/SMS

4. **Verify OTP**
   - `verifyOtp()` called
   - On success: redirect to intended page or home
   - On error: show error message

5. **Resend OTP**
   - "Didn't receive code? Resend" link available
   - 60-second cooldown between resends
   - Countdown timer shown

### Error Handling

```tsx
try {
  const { error } = await authStore.verifyOtp(identifier, otp, authType);
  if (error) {
    setError(error.message); // Show to user
  }
} catch (err) {
  setError('Something went wrong. Please try again.');
}
```

## Database Integration

### Profiles Table

When a user signs in for the first time, a profile is automatically created:

```sql
-- Trigger function in supabase/migrations/20240101000000_initial_schema.sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Profile Schema

```typescript
interface Profile {
  id: string;                // UUID (matches auth.users.id)
  email: string;             // User's email
  phone: string | null;      // User's phone (optional)
  full_name: string | null;  // Display name (optional)
  created_at: string;        // ISO timestamp
  updated_at: string;        // ISO timestamp
}
```

### Row Level Security (RLS)

Profiles are protected with RLS policies:

```sql
-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

## Authentication State Listener

The auth store automatically listens for auth state changes:

```typescript
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // Fetch user profile from database
    // Update store with user and profile
  } else if (event === 'SIGNED_OUT') {
    // Clear user and profile from store
  }
});
```

This ensures the UI stays in sync with the authentication state.

## Local Storage Persistence

Auth state is persisted to localStorage using Zustand's persist middleware:

```typescript
persist(
  (set, get) => ({ /* store definition */ }),
  {
    name: 'auth-storage',
    partialize: (state) => ({
      user: state.user,
      profile: state.profile,
      session: state.session,
    }),
  }
)
```

**Benefits:**
- User stays logged in across page refreshes
- Session persists across browser tabs
- Automatic rehydration on app load

## Security Considerations

### 1. Environment Variables

Never commit Supabase keys to version control:

```env
# .env (gitignored)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Row Level Security (RLS)

All database tables use RLS policies to ensure users can only access their own data.

### 3. Anon Key vs Service Key

- **Anon Key**: Used in frontend, safe to expose
- **Service Key**: Never use in frontend, only in backend/Edge Functions

### 4. OTP Expiration

Supabase OTPs expire after 60 seconds by default. Users must verify within this window.

### 5. Rate Limiting

Supabase provides built-in rate limiting for auth endpoints to prevent abuse.

## Email Configuration (Required Setup)

For email OTP to work, configure SMTP in Supabase Dashboard:

1. Go to **Authentication → Email Templates**
2. Click **Settings** (gear icon)
3. Add SMTP credentials:
   - **Host**: smtp.gmail.com (or your provider)
   - **Port**: 587
   - **Username**: your-email@gmail.com
   - **Password**: app-specific password
   - **Sender Email**: your-email@gmail.com
   - **Sender Name**: Tulsi Mishrika

### Gmail Setup (Example)

1. Enable 2FA on your Google account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the app password in SMTP settings

## Phone/SMS Configuration (Optional)

For SMS OTP, configure Twilio in Supabase Dashboard:

1. Go to **Authentication → Providers**
2. Enable **Phone** provider
3. Add Twilio credentials:
   - **Account SID**
   - **Auth Token**
   - **Phone Number** (Twilio number)

**Note:** The UI supports phone login, but SMS delivery requires this additional setup.

## Testing Authentication

### Local Development

1. Ensure `.env` has correct Supabase credentials
2. Start dev server: `npm run dev`
3. Navigate to `/login`
4. Enter your email
5. Check email for OTP code
6. Enter OTP to sign in

### Testing Without Email

For development without email setup:

1. Use Supabase Dashboard → Authentication → Users
2. Manually create a test user
3. Copy the session token from Network tab
4. Manually set in localStorage

```javascript
// Browser console
localStorage.setItem('auth-storage', JSON.stringify({
  state: {
    user: { /* user object */ },
    session: { /* session object */ }
  }
}));
```

## Troubleshooting

### "Invalid login credentials"

- Check that email is correctly formatted
- Ensure OTP is entered within 60 seconds
- Verify SMTP is configured in Supabase Dashboard

### "Email not sent"

- Confirm SMTP credentials in Supabase Dashboard
- Check Supabase logs for email delivery errors
- Verify sender email is verified (some providers require this)

### "User already exists"

- This is expected behavior for returning users
- Users can sign in multiple times with the same email
- Each sign-in generates a new OTP

### Auth state not persisting

- Check browser localStorage for `auth-storage` key
- Ensure no errors in browser console
- Verify `initialize()` is called on app mount

### Protected routes not working

- Ensure `ProtectedRoute` wraps the page component
- Check that auth store is initialized
- Verify user is actually signed in (check store state)

## Future Enhancements

- [ ] Social login (Google, Facebook)
- [ ] Magic link authentication
- [ ] Two-factor authentication (2FA)
- [ ] Password-based login (optional)
- [ ] Session management (view/revoke active sessions)
- [ ] Email verification requirement
- [ ] Account deletion
- [ ] Profile picture upload

## Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Router Documentation](https://reactrouter.com/)
- [Frontend README](./README.md)
- [Components Documentation](./COMPONENTS.md)
- [Routing Documentation](./ROUTING.md)

---

**Last Updated:** Task #5 Complete
**Status:** Production-ready authentication system with OTP login
