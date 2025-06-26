import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface Coach {
  id: number;
  name: string;
  email: string;
  phone?: string;
  sports: string[];
  experience_years?: number;
  status: string;
}

interface LoginResponse {
  coach: Coach;
  token: string;
}

interface VerifyResponse {
  coach: Coach;
}

interface CoachAuthContextType {
  coach: Coach | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const CoachAuthContext = createContext<CoachAuthContextType | undefined>(undefined);

export const useCoachAuth = () => {
  const context = useContext(CoachAuthContext);
  if (!context) {
    throw new Error('useCoachAuth must be used within a CoachAuthProvider');
  }
  return context;
};

interface CoachAuthProviderProps {
  children: React.ReactNode;
}

export const CoachAuthProvider: React.FC<CoachAuthProviderProps> = ({ children }) => {
  const [coach, setCoach] = useState<Coach | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!coach;

  const logout = () => {
    setCoach(null);
    localStorage.removeItem('coachToken');
    localStorage.removeItem('coachData');
  };

  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('coachToken');
      const storedCoachData = localStorage.getItem('coachData');

      if (token && storedCoachData) {
        try {
          // Verify token with backend
          const response = await apiClient.verifyCoachAuth(token);
          if (response.success && response.data?.coach) {
            setCoach(response.data.coach);
          } else {
            // Token invalid, clear local storage
            logout();
          }
        } catch (error) {
          // Token verification failed, try using stored data
          console.warn('Token verification failed, using stored data:', error);
          const parsedCoachData = JSON.parse(storedCoachData);
          setCoach(parsedCoachData);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<{ success: boolean; message?: string }> => {
    try {
      setIsLoading(true);
      const response = await apiClient.coachLogin(username, password);
      
      if (response.success && response.data?.coach && response.data?.token) {
        setCoach(response.data.coach);
        localStorage.setItem('coachToken', response.data.token);
        localStorage.setItem('coachData', JSON.stringify(response.data.coach));
        return { success: true };
      } else {
        return { success: false, message: response.message || 'Invalid response from server' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Login failed. Please check your credentials.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const value: CoachAuthContextType = {
    coach,
    isLoggedIn,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return (
    <CoachAuthContext.Provider value={value}>
      {children}
    </CoachAuthContext.Provider>
  );
};
