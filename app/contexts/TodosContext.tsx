import { useState, useEffect, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { useAuth } from './AuthContext';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { trpc } from '@/lib/trpc';

export type Priority = 'urgent' | 'intermediate' | 'not-urgent';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date | number;
  userId: string;
  priority: Priority;
  dueDate?: Date | number | null;
  notificationId?: string;
  description?: string | null;
  categoryId?: string | null;
}

export type FilterType = 'all' | 'active' | 'completed';
export type PriorityFilter = 'all' | 'urgent' | 'intermediate' | 'not-urgent';

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
  const [filter, setFilter] = useState<FilterType>('all');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('all');

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

  const todosQuery = trpc.todos.list.useQuery(
    {
      filter,
      priorityFilter: priorityFilter === 'all' ? undefined : priorityFilter,
    },
    {
      enabled: !!user,
      refetchOnMount: true,
    }
  );

  const createTodoMutation = trpc.todos.create.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  const updateTodoMutation = trpc.todos.update.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  const deleteTodoMutation = trpc.todos.delete.useMutation({
    onSuccess: () => {
      todosQuery.refetch();
    },
  });

  const scheduleNotification = async (todo: Todo) => {
    if (Platform.OS === 'web' || !todo.dueDate) {
      return undefined;
    }

    try {
      const now = Date.now();
      const dueDateTime = typeof todo.dueDate === 'number' ? todo.dueDate : new Date(todo.dueDate).getTime();

      if (dueDateTime <= now) {
        return undefined;
      }

      const secondsUntilDue = Math.floor((dueDateTime - now) / 1000);

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

    try {
      await createTodoMutation.mutateAsync({
        title,
        priority,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }, [user, createTodoMutation]);

  const toggleTodo = useCallback(async (id: string) => {
    const todo = todosQuery.data?.todos.find((t: any) => t.id === id);
    if (!todo) return;

    if (!todo.completed && todo.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    try {
      await updateTodoMutation.mutateAsync({
        id,
        completed: !todo.completed,
      });
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  }, [todosQuery.data, updateTodoMutation]);

  const deleteTodo = useCallback(async (id: string) => {
    const todo = todosQuery.data?.todos.find((t: any) => t.id === id);
    if (todo?.notificationId) {
      await cancelNotification(todo.notificationId);
    }

    try {
      await deleteTodoMutation.mutateAsync({ id });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }, [todosQuery.data, deleteTodoMutation]);

  const clearCompleted = useCallback(async () => {
    const completedTodos = todosQuery.data?.todos.filter((t: any) => t.completed) || [];
    
    try {
      await Promise.all(
        completedTodos.map((todo: any) => deleteTodoMutation.mutateAsync({ id: todo.id }))
      );
    } catch (error) {
      console.error('Error clearing completed todos:', error);
    }
  }, [todosQuery.data, deleteTodoMutation]);

  const todos = useMemo(() => {
    return (todosQuery.data?.todos || []).map((todo: any) => ({
      ...todo,
      createdAt: typeof todo.createdAt === 'string' ? new Date(todo.createdAt).getTime() : todo.createdAt,
      dueDate: todo.dueDate ? (typeof todo.dueDate === 'string' ? new Date(todo.dueDate).getTime() : todo.dueDate) : undefined,
    }));
  }, [todosQuery.data]);

  const allTodos = useMemo(() => {
    return (todosQuery.data?.todos || []).map((todo: any) => ({
      ...todo,
      createdAt: typeof todo.createdAt === 'string' ? new Date(todo.createdAt).getTime() : todo.createdAt,
      dueDate: todo.dueDate ? (typeof todo.dueDate === 'string' ? new Date(todo.dueDate).getTime() : todo.dueDate) : undefined,
    }));
  }, [todosQuery.data]);

  const stats = useMemo(() => ({
    total: allTodos.length,
    active: allTodos.filter((t: any) => !t.completed).length,
    completed: allTodos.filter((t: any) => t.completed).length,
  }), [allTodos]);

  return {
    todos,
    allTodos,
    filter,
    setFilter,
    priorityFilter,
    setPriorityFilter,
    isLoading: todosQuery.isLoading,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    stats,
    refetch: todosQuery.refetch,
  };
});
