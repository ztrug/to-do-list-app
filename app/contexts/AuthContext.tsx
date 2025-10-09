import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';

interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  howFound: string;
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

  const register = async (email: string, password: string, name: string, age: number, howFound: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existingUser) {
        return { success: false, error: 'Email já cadastrado' };
      }

      const newUser: StoredUser = {
        id: Date.now().toString(),
        email: email.toLowerCase(),
        password,
        name,
        age,
        howFound,
      };

      users.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

      const userWithoutPassword: User = {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        age: newUser.age,
        howFound: newUser.howFound,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return { success: true };
    } catch (error) {
      console.error('Error registering user:', error);
      return { success: false, error: 'Erro ao cadastrar usuário' };
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const usersJson = await AsyncStorage.getItem(USERS_KEY);
      const users: StoredUser[] = usersJson ? JSON.parse(usersJson) : [];

      const foundUser = users.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      );

      if (!foundUser) {
        return { success: false, error: 'Email ou senha incorretos' };
      }

      const userWithoutPassword: User = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        age: foundUser.age,
        howFound: foundUser.howFound,
      };

      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return { success: true };
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: 'Erro ao fazer login' };
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(CURRENT_USER_KEY);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return {
    user,
    isLoading,
    login,
    register,
    logout,
  };
});
