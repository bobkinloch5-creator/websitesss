import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  apiKey?: string;
  prompt_balance: number;
  reset_time: Date;
  aws_configured: boolean;
  avatar_url?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 AuthProvider mounting, checking session...');
    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔐 Auth state change:', event, 'Session:', !!session);
      
      if (event === 'SIGNED_IN' && session) {
        console.log('✅ SIGNED_IN event');
        setSession(session);
        await loadUserProfile(session.user.id, session.user);
      } else if (event === 'SIGNED_OUT') {
        console.log('👋 SIGNED_OUT event');
        setSession(null);
        setUser(null);
        setLoading(false);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('🔄 TOKEN_REFRESHED event');
        setSession(session);
      } else if (event === 'INITIAL_SESSION' && session) {
        console.log('🎬 INITIAL_SESSION event');
        setSession(session);
        await loadUserProfile(session.user.id, session.user);
      }
    });

    return () => {
      console.log('🧹 AuthProvider unmounting');
      subscription.unsubscribe();
    };
  }, []);

  const initializeAuth = async () => {
    try {
      console.log('🔍 Checking for existing session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('❌ Session error:', error);
        setLoading(false);
        return;
      }

      if (session) {
        console.log('✅ Found existing session');
        setSession(session);
        await loadUserProfile(session.user.id, session.user);
      } else {
        console.log('❌ No existing session');
        setLoading(false);
      }
    } catch (err) {
      console.error('❌ Initialize auth error:', err);
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId: string, authUser: any) => {
    try {
      console.log('📥 Loading profile for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('📝 Profile not found, creating...');
        await createUserProfile(userId, authUser);
        return;
      }

      if (error) {
        console.error('❌ Error loading profile:', error);
        throw error;
      }

      if (data) {
        console.log('✅ Profile loaded:', data.username);
        setUser({
          id: data.id,
          username: data.username,
          email: data.email,
          apiKey: data.api_key,
          prompt_balance: data.prompt_balance || 100,
          reset_time: new Date(data.reset_time),
          aws_configured: data.aws_configured || false,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('❌ Load user profile error:', error);
    } finally {
      setLoading(false);
    }
  };

  const createUserProfile = async (userId: string, authUser: any) => {
    try {
      console.log('🆕 Creating new profile...');
      
      const username = authUser.user_metadata?.full_name || 
                      authUser.user_metadata?.preferred_username ||
                      authUser.user_metadata?.name ||
                      authUser.email?.split('@')[0] ||
                      `user_${userId.slice(0, 8)}`;

      const avatar_url = authUser.user_metadata?.avatar_url || 
                        authUser.user_metadata?.picture ||
                        null;

      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            username: username,
            email: authUser.email,
            prompt_balance: 100,
            reset_time: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            avatar_url: avatar_url,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating profile:', error);
        throw error;
      }

      console.log('✅ Profile created:', data.username);
      
      setUser({
        id: data.id,
        username: data.username,
        email: data.email,
        apiKey: data.api_key,
        prompt_balance: data.prompt_balance,
        reset_time: new Date(data.reset_time),
        aws_configured: false,
        avatar_url: data.avatar_url,
      });
    } catch (error) {
      console.error('❌ Create profile error:', error);
    } finally {
      setLoading(false);
    }
  };


  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      console.log('📧 Attempting email login...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Check if it's an email not confirmed error
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email to verify your account. If you didn\'t receive an email, contact support.');
        }
        throw error;
      }

      console.log('✅ Email login successful');
      // Don't set loading to false here - let the auth state change handle it
    } catch (err: any) {
      console.error('❌ Login error:', err);
      setError(err.message || 'Login failed');
      setLoading(false);
      throw err;
    }
  };

  const register = async (username: string, email: string, password: string) => {
    try {
      setError(null);
      console.log('📝 Attempting registration...');

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) throw authError;

      console.log('✅ Registration successful - check email for verification');
    } catch (err: any) {
      console.error('❌ Registration error:', err);
      setError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      console.log('👋 Logging out...');
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      console.log('✅ Logged out successfully');
    } catch (err: any) {
      console.error('❌ Logout error:', err);
      setError(err.message || 'Logout failed');
    }
  };

  const refreshUser = async () => {
    if (session) {
      await loadUserProfile(session.user.id, session.user);
    }
  };

  console.log('🔍 AuthProvider render - Loading:', loading, 'User:', user?.username);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        login,
          register,
        logout,
        refreshUser,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
