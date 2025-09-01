import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user] = useState<any | null>(null);
  const [session] = useState<any | null>(null);
  const [loading] = useState(false);

  const signIn = async (email: string, _password: string) => {
    // Placeholder implementation
    console.log('SignIn:', email);
    return { error: null };
  };

  const signUp = async (email: string, _password: string, fullName?: string) => {
    // Placeholder implementation
    console.log('SignUp:', email, fullName);
    return { error: null };
  };

  const signOut = async () => {
    // Placeholder implementation
    console.log('SignOut');
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};