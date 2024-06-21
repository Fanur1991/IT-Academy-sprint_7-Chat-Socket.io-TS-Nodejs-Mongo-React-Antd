import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContext, IAuthProviderProps, IUser } from '../types/types';
import Cookies from 'js-cookie';
import { axiosInstance } from '../config/axios';

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('userAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
  const [authUser, setAuthUser] = useState<IUser | null>(() => {
    const storedUser =
      sessionStorage.getItem('userData') || Cookies.get('userData');

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const checkToken = async () => {
    try {
      const response = await axiosInstance.get('/api/user', {
        headers: {
          Authorization: `Bearer ${authUser?.token}`,
        },
        withCredentials: true,
      });

      setAuthUser(response.data.user);
    } catch (error) {
      console.error('Token verification failed', error);
      setAuthUser(null);
      Cookies.remove('userData');
      sessionStorage.removeItem('userData');
    }
  };

  useEffect(() => {
    if (authUser) {
      sessionStorage.setItem('userData', JSON.stringify(authUser));
    } else {
      sessionStorage.removeItem('userData');
    }
  }, [authUser]);

  useEffect(() => {
    checkToken();
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};
