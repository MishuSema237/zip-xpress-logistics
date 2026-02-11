import React, { createContext, useContext, useState, useEffect } from 'react';
import { validateUser, User as ServiceUser } from '../services/userService';

// Re-using the User interface from userService or defining a compatible one
// AuthContext exports User with specific fields
export interface User {
  id: string;
  email: string | null;
  name: string;
  role: 'admin' | 'user' | 'manager';
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => { },
  logout: async () => { },
  loading: false,
  error: null
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session in localStorage
    const checkSession = async () => {
      try {
        const storedUser = localStorage.getItem('auth_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Error recovering session:', err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const validatedUser = await validateUser(email, password);

      if (validatedUser) {
        const authUser: User = {
          id: validatedUser.id,
          email: validatedUser.email,
          name: validatedUser.username,
          role: validatedUser.role,
          permissions: validatedUser.permissions
        };
        setUser(authUser);
        localStorage.setItem('auth_user', JSON.stringify(authUser));
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      setError((err as Error).message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      localStorage.removeItem('auth_user');
    } catch (err) {
      console.error('Failed to logout:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 