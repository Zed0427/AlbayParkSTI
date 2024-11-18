import React, { createContext, useState, useContext, useEffect } from 'react';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../data/models';
import { users, passwords } from '../data/mockData';

interface AuthContextData {
  authData?: User;
  loading: boolean;
  isLoading: boolean;
  error?: string;
  signIn(username: string, password: string): Promise<void>;
  signOut(): void;
  clearError(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authData, setAuthData] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    loadAuthData();
  }, []);

  const loadAuthData = async () => {
    try {
      const storedAuthData = await AsyncStorage.getItem('authData');
      if (storedAuthData) {
        setAuthData(JSON.parse(storedAuthData));
      }
    } catch (error) {
      console.error('Failed to load auth data:', error);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    setError(undefined);
    try {
      const user = users.find((u) => u.email === username);
      if (user && passwords[user.id] === password) {
        setAuthData(user);
        await AsyncStorage.setItem('authData', JSON.stringify(user));
      } else {
        throw new Error('Invalid username or password');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setAuthData(undefined);
    await AsyncStorage.removeItem('authData');
  };

  const clearError = () => setError(undefined);

  return (
    <AuthContext.Provider
      value={{
        authData,
        loading,
        isLoading,
        error,
        signIn,
        signOut,
        clearError,
      }}
    >
      {React.isValidElement(children) ? children : <Text>Loading...</Text>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
