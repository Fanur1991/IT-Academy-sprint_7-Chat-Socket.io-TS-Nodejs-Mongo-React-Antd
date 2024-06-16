import { createContext, useContext, useState, useEffect } from 'react';
import { IAuthContext, IAuthProviderProps, IUser } from '../types/types';
import Cookies from 'js-cookie';

export const AuthContext = createContext<IAuthContext | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('userAuthContext must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const [authUser, setAuthUser] = useState<IUser | null>(() => {
    const storedUser =
      sessionStorage.getItem('userData') || Cookies.get('userData');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (authUser) {
      sessionStorage.setItem('userData', JSON.stringify(authUser));
    } else {
      sessionStorage.removeItem('userData');
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
