import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { notification } from 'antd';
import { IUser, UserRole } from '../interfaces';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isLoading: boolean;
}

const hasAdminAccess = (role: UserRole) => {
  return role === UserRole.ADMIN || role === UserRole.SUPERADMIN;
};

export const useAuth = () => {
  const navigate = useNavigate();
  const [authState, setAuthState] = useState<AuthState>(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { user, token } = JSON.parse(auth);
      return { user, token, isLoading: false };
    }
    return { user: null, token: null, isLoading: true };
  });

  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { user, token } = JSON.parse(auth);
      setAuthState({ user, token, isLoading: false });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (token: string, user: IUser) => {
    if (!hasAdminAccess(user.role)) {
      notification.error({
        message: 'Accès refusé',
        description: 'Vous devez être administrateur pour accéder à cette zone',
      });
      return false;
    }

    const authData = { token, user };
    localStorage.setItem('auth', JSON.stringify(authData));
    setAuthState({ user, token, isLoading: false });
    
    notification.success({
      message: 'Connexion réussie',
      description: `Bienvenue ${user.firstName} ${user.lastName}`,
    });
    
    navigate('/dashboard');
    return true;
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('auth');
    setAuthState({ user: null, token: null, isLoading: false });
    notification.success({
      message: 'Déconnexion',
      description: 'Vous avez été déconnecté avec succès',
    });
    navigate('/login');
  }, [navigate]);

  const checkAuth = useCallback(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      return false;
    }

    try {
      const { user, token } = JSON.parse(auth);
      if (!user || !token || !hasAdminAccess(user.role)) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, []);

  const updateUser = useCallback((updatedUser: IUser) => {
    const auth = localStorage.getItem('auth');
    if (auth) {
      const { token } = JSON.parse(auth);
      const newAuth = { token, user: updatedUser };
      localStorage.setItem('auth', JSON.stringify(newAuth));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  }, []);

  return {
    user: authState.user,
    token: authState.token,
    isLoading: authState.isLoading,
    login,
    logout,
    checkAuth,
    updateUser,
  };
};
