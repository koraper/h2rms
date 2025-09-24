# Authentication Implementation Guide

This guide covers implementing authentication in H2RMS using Supabase Auth and NextAuth.js.

## Overview

H2RMS uses a hybrid authentication approach:
- **Supabase Auth** for user management and JWT tokens
- **NextAuth.js** for session management and OAuth providers
- **Row Level Security (RLS)** for database access control

## Setup NextAuth.js

### 1. Install Dependencies

```bash
npm install next-auth @supabase/supabase-js
```

### 2. NextAuth Configuration

Create `pages/api/auth/[...nextauth].js`:

```javascript
import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@next-auth/supabase-adapter';
import GoogleProvider from 'next-auth/providers/google';
import EmailProvider from 'next-auth/providers/email';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default NextAuth({
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }),

  callbacks: {
    async session({ session, user }) {
      // Get user profile from Supabase
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      session.user.id = user.id;
      session.user.profile = profile;
      return session;
    },

    async jwt({ token, user, account }) {
      if (account && user) {
        // Get Supabase JWT token
        const { data } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: 'oauth-user', // Special handling for OAuth users
        });

        token.supabaseToken = data.session?.access_token;
      }
      return token;
    },
  },

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },
});
```

### 3. Environment Variables

Add to `.env.local`:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email Provider (optional)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=your-app-password
EMAIL_FROM=noreply@yourcompany.com
```

## Supabase Auth Setup

### 1. Auth Utilities

Create `lib/supabase/auth.js`:

```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const signUp = async (email, password, userData = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  });

  return { data, error };
};

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
};

export const updatePassword = async (newPassword) => {
  const { data, error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  return { data, error };
};

export const resetPassword = async (email) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });

  return { data, error };
};
```

### 2. Auth Context

Create `contexts/AuthContext.js`:

```javascript
import { createContext, useContext, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { supabase } from '../lib/supabase/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;

    if (session?.user) {
      setUser(session.user);
      setProfile(session.user.profile);
    } else {
      setUser(null);
      setProfile(null);
    }

    setLoading(false);
  }, [session, status]);

  const hasRole = (role) => {
    return profile?.role === role;
  };

  const hasPermission = (permission) => {
    const rolePermissions = {
      admin: ['all'],
      manager: ['view_department', 'manage_attendance', 'approve_leave'],
      employee: ['view_own', 'request_leave', 'check_attendance'],
    };

    const userPermissions = rolePermissions[profile?.role] || [];
    return userPermissions.includes('all') || userPermissions.includes(permission);
  };

  const value = {
    user,
    profile,
    loading,
    hasRole,
    hasPermission,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Authentication Components

### 1. Sign In Form

Create `components/auth/SignInForm.js`:

```javascript
import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('An error occurred during sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing In...' : 'Sign In'}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
        >
          Sign in with Google
        </button>
      </div>
    </form>
  );
}
```

### 2. Protected Route Component

Create `components/auth/ProtectedRoute.js`:

```javascript
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedRoute({
  children,
  requiredRole = null,
  requiredPermission = null
}) {
  const { user, profile, loading, hasRole, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.push('/auth/signin');
      return;
    }

    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/unauthorized');
      return;
    }

    if (requiredPermission && !hasPermission(requiredPermission)) {
      router.push('/unauthorized');
      return;
    }
  }, [user, profile, loading, router, requiredRole, requiredPermission]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return children;
}
```

## API Authentication Middleware

Create `middleware/auth.js`:

```javascript
import { getToken } from 'next-auth/jwt';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export function withAuth(handler, requiredRole = null) {
  return async (req, res) => {
    try {
      const token = await getToken({ req });

      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Get user profile
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', token.sub)
        .single();

      if (error || !profile) {
        return res.status(401).json({ error: 'User profile not found' });
      }

      if (requiredRole && profile.role !== requiredRole && profile.role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      req.user = {
        id: token.sub,
        email: token.email,
        profile,
      };

      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Authentication error' });
    }
  };
}

// Usage in API routes
export default withAuth(async (req, res) => {
  // Your API logic here
  // req.user contains authenticated user data
}, 'admin'); // Optional role requirement
```

## Implementing in Pages

### 1. App Component

Update `pages/_app.js`:

```javascript
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </SessionProvider>
  );
}
```

### 2. Protected Dashboard Page

```javascript
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Dashboard from '../components/Dashboard';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}
```

### 3. Admin Only Page

```javascript
import ProtectedRoute from '../components/auth/ProtectedRoute';
import AdminPanel from '../components/AdminPanel';

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminPanel />
    </ProtectedRoute>
  );
}
```

## Testing Authentication

### 1. Test User Creation

```javascript
// Create test users
const createTestUsers = async () => {
  const users = [
    {
      email: 'admin@company.com',
      password: 'admin123',
      role: 'admin',
      first_name: 'Admin',
      last_name: 'User'
    },
    {
      email: 'manager@company.com',
      password: 'manager123',
      role: 'manager',
      first_name: 'Manager',
      last_name: 'User',
      department: 'Engineering'
    },
    {
      email: 'employee@company.com',
      password: 'employee123',
      role: 'employee',
      first_name: 'Employee',
      last_name: 'User',
      department: 'Engineering'
    }
  ];

  for (const user of users) {
    await signUp(user.email, user.password, {
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      department: user.department
    });
  }
};
```

### 2. Test Authentication Flow

```bash
# Test sign up
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test sign in
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test protected endpoint
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer <jwt-token>"
```

## Security Best Practices

1. **Use HTTPS in production**
2. **Strong password requirements**
3. **Rate limiting on auth endpoints**
4. **JWT token expiration**
5. **Secure cookie settings**
6. **Input validation and sanitization**
7. **Row Level Security (RLS) policies**

## Troubleshooting

### Common Issues

1. **Session not persisting**: Check cookie settings and domain configuration
2. **RLS blocking queries**: Verify row-level security policies
3. **OAuth redirect errors**: Check provider configuration and redirect URLs
4. **Token expiration**: Implement token refresh logic

### Debug Mode

Enable debug logging:

```env
NEXTAUTH_DEBUG=true
DEBUG=true
```

## Next Steps

- [Set up API endpoints](endpoints.md)
- [Configure role-based permissions](../guides/permissions.md)
- [Implement password policies](../guides/security.md)