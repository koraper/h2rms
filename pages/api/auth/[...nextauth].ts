import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import { signInWithEmail, getUserProfile, supabaseAdmin } from '@/lib/supabase';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'your-email@example.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        try {
          // Authenticate with Supabase
          const { data, error } = await signInWithEmail(
            credentials.email,
            credentials.password
          );

          if (error || !data.user) {
            throw new Error('Invalid credentials');
          }

          // Get user profile
          const { data: profile, error: profileError } = await getUserProfile(
            data.user.id
          );

          if (profileError || !profile) {
            throw new Error('User profile not found');
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: `${profile.first_name} ${profile.last_name}`.trim(),
            image: profile.avatar_url,
            role: profile.role,
            department: profile.department,
            profile,
          };
        } catch (error: any) {
          console.error('Authentication error:', error.message);
          return null;
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],

  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            department: user.department,
            profile: user.profile,
          },
        };
      }

      // Return previous token if the access token has not expired yet
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.user.id;
        session.user.role = token.user.role;
        session.user.department = token.user.department;
        session.user.profile = token.user.profile;
        session.accessToken = token.accessToken;
      }

      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Allow sign in
      return true;
    },

    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error',
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log('User signed in:', user.email);
    },
    async signOut({ session, token }) {
      console.log('User signed out');
    },
  },

  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);