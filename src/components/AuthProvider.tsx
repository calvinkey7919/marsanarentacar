'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  role: 'ADMIN' | 'OPS' | 'CORPORATE' | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<'ADMIN' | 'OPS' | 'CORPORATE' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session and profile
    const getProfile = async (session: Session | null) => {
      if (session && session.user) {
        setUser(session.user);
        // Fetch user role from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (!error && data) {
          setRole(data.role as 'ADMIN' | 'OPS' | 'CORPORATE');
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };

    // Subscribe to auth state changes
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      getProfile(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      getProfile(session);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setRole(null);
  }

  const value: AuthContextValue = { session, user, role, loading, signOut };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
