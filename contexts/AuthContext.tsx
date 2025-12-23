
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: '@kickr_users',
  CURRENT_USER: '@kickr_current_user',
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const userJson = await AsyncStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      const foundUser = users.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(foundUser));
        setUser(foundUser);
        return { success: true };
      } else {
        return { success: false, error: 'Ungültige E-Mail oder Passwort' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      
      // Check if email already exists
      if (users.find(u => u.email === email)) {
        return { success: false, error: 'E-Mail bereits registriert' };
      }

      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: role as any,
        friends: [],
        friendRequests: [],
      };

      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
      setUser(newUser);
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Ein Fehler ist aufgetreten' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) return;

      const updatedUser = { ...user, ...updates };
      
      // Update in users list
      const usersJson = await AsyncStorage.getItem(STORAGE_KEYS.USERS);
      const users: User[] = usersJson ? JSON.parse(usersJson) : [];
      const userIndex = users.findIndex(u => u.id === user.id);
      
      if (userIndex !== -1) {
        users[userIndex] = updatedUser;
        await AsyncStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      }
      
      // Update current user
      await AsyncStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Update profile error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
