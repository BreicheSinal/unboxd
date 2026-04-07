import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: "google" | "email";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const STORAGE_KEY = "unboxd_user";
const LEGACY_STORAGE_KEY = "mysterykit_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser =
      localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY);
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      localStorage.setItem(STORAGE_KEY, storedUser);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name: email.split("@")[0],
      provider: "email",
    };
    
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const signInWithGoogle = async () => {
    // Simulate Google OAuth
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email: "user@gmail.com",
      name: "Google User",
      avatar: "https://images.unsplash.com/photo-1753161023792-d240af5e6ef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3NDQ3MjAyN3ww&ixlib=rb-4.1.0&q=80&w=200",
      provider: "google",
    };
    
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const user: User = {
      id: Math.random().toString(36).substring(7),
      email,
      name,
      provider: "email",
    };
    
    setUser(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signInWithGoogle,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
