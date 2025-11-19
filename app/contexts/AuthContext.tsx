import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { trpc } from '@/lib/trpc';

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  howFound: string;
  profilePhoto?: string;
}

interface StoredUser extends User {
  password: string;
}

const USERS_KEY = '@todo_users';
const CURRENT_USER_KEY = '@todo_current_user';

export const [AuthContext, useAuth] = createContextHook(() => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const loadCurrentUser = async () => {
    try {
      const currentUserJson = await AsyncStorage.getItem(CURRENT_USER_KEY);
      if (currentUserJson) {
        const currentUser = JSON.parse(currentUserJson) as User;
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Error loading current user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerMutation = trpc.auth.register.useMutation();

  const register = async (email: string, password: string, name: string, age: number, howFound: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await registerMutation.mutateAsync({
        email,
        password,
        name,
        age,
        howFound,
      });

      if (result.success) {
        const userWithoutPassword: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          age: result.user.age,
          howFound: result.user.howFound,
          profilePhoto: result.user.profilePhoto,
        };

        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        await AsyncStorage.setItem('@auth_token', result.token);
        setUser(userWithoutPassword);

        return { success: true };
      }

      return { success: false, error: 'Erro ao cadastrar usuário' };
    } catch (error: any) {
      console.error('Error registering user:', error);
      return { success: false, error: error.message || 'Erro ao cadastrar usuário' };
    }
  };

  const loginMutation = trpc.auth.login.useMutation();

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await loginMutation.mutateAsync({
        email,
        password,
      });

      if (result.success) {
        const userWithoutPassword: User = {
          id: result.user.id,
          email: result.user.email,
          name: result.user.name,
          age: result.user.age,
          howFound: result.user.howFound,
          profilePhoto: result.user.profilePhoto,
        };

        await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        await AsyncStorage.setItem('@auth_token', result.token);
        setUser(userWithoutPassword);

        return { success: true };
      }

      return { success: false, error: 'Erro ao fazer login' };
    } catch (error: any) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message || 'Email ou senha incorretos' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      await AsyncStorage.removeItem('@auth_token');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfilePhoto = async (photoUri: string) => {
    if (!user) return;

    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, profilePhoto: photoUri } : u
      );

      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));

      const updatedUser = { ...user, profilePhoto: photoUri };
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating profile photo:', error);
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
    updateProfilePhoto,
  };
});
