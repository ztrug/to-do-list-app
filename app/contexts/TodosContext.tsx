import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export type Priority = 'urgent' | 'intermediate' | 'not-urgent';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
  userId: string;
  priority: Priority;
  dueDate?: number;
  notificationId?: string;
}

export type FilterType = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | 'urgent' | 'intermediate' | 'not-urgent';

const TODOS_KEY = '@todo_items';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const [TodosContext, useTodos] = createContextHook(() => {
  const { user } = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const registerForPushNotificationsAsync = async () => {
    if (Platform.OS === 'web') {
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
  };

  useEffect(() => {
    if (user) {
      loadTodos();
    } else {
      setTodos([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadTodos = async () => {
    try {
      const todosJson = await AsyncStorage.getItem(TODOS_KEY);
      if (todosJson) {
        const allTodos: Todo[] = JSON.parse(todosJson);
        const userTodos = allTodos.filter(t => t.userId === user?.id);
        setTodos(userTodos);
      }
    } catch (error) {
      console.error('Error loading todos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      const todosJson = await AsyncStorage.getItem(TODOS_KEY);
      const allTodos: Todo[] = todosJson ? JSON.parse(todosJson) : [];
      
      const otherUsersTodos = allTodos.filter(t => t.userId !== user?.id);
      const updatedAllTodos = [...otherUsersTodos, ...newTodos];
      
      await AsyncStorage.setItem(TODOS_KEY, JSON.stringify(updatedAllTodos));
    } catch (error) {
      console.error('Error saving todos:', error);
    }
  };

  const scheduleNotification = async (todo: Todo) => {
    if (Platform.OS === 'web' || !todo.dueDate) {
      return undefined;
    }

    try {
      const now = Date.now();

      if (todo.dueDate <= now) {
        return undefined;
      }

      const secondsUntilDue = Math.floor((todo.dueDate - now) / 1000);

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de Tarefa',
          body: todo.title,
          data: { todoId: todo.id },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: secondsUntilDue,
          repeats: false,
        },
      });

      return notificationId;
    } catch (error) {
      console.error('Error scheduling notification:', error);
      return undefined;
    }
  };

  const cancelNotification = async (notificationId?: string) => {
    if (Platform.OS === 'web' || !notificationId) {
      return;
    }

    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Error canceling notification:', error);
    }
  };

  const addTodo = useCallback(async (title: string, priority: Priority, dueDate?: number) => {
    if (!user) return;

    const newTodo: Todo = {
      id: Date.now().toString(),
      title,
      completed: false,
      createdAt: Date.now(),
      userId: user.id,
      priority,
      dueDate,
    };

    const notificationId = await scheduleNotification(newTodo);
    if (notificationId) {
      newTodo.notificationId = notificationId;
    }

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  }, [todos, user]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo && !todo.completed && todo.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    const updatedTodos = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  }, [todos]);

  const deleteTodo = useCallback(async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (todo?.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  }, [todos]);

  const clearCompleted = useCallback(() => {
    const updatedTodos = todos.filter(todo => !todo.completed);
    setTodos(updatedTodos);
    saveTodos(updatedTodos);
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let result = todos;

    switch (filter) {
      case 'active':
        result = result.filter(t => !t.completed);
        break;
      case 'completed':
        result = result.filter(t => t.completed);
        break;
    }

    if (priorityFilter !== 'all') {
      result = result.filter(t => t.priority === priorityFilter);
    }

    return result;
  }, [todos, filter, priorityFilter]);

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter(t => !t.completed).length,
    completed: todos.filter(t => t.completed).length,
  }), [todos]);

  return {
    todos: filteredTodos,
    allTodos: todos,
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    stats,
  };
});
