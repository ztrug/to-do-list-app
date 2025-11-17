import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

describe('List Todos Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should list all todos for a user', async () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Todo 1',
        completed: false,
        priority: 'urgent',
        dueDate: new Date(),
        notificationId: null,
        userId: 'user1',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
      },
      {
        id: '2',
        title: 'Todo 2',
        completed: true,
        priority: 'intermediate',
        dueDate: null,
        notificationId: null,
        userId: 'user1',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
      },
    ];

    prisma.todo.findMany.mockResolvedValue(mockTodos);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.list();

    expect(result.todos).toHaveLength(2);
    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      where: { userId: 'user1' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should filter active todos', async () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Active Todo',
        completed: false,
        priority: 'urgent',
        dueDate: null,
        notificationId: null,
        userId: 'user1',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
      },
    ];

    prisma.todo.findMany.mockResolvedValue(mockTodos);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.list({ filter: 'active' as const });

    expect(result.todos).toHaveLength(1);
    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      where: { userId: 'user1', completed: false },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should filter by priority', async () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Urgent Todo',
        completed: false,
        priority: 'urgent',
        dueDate: null,
        notificationId: null,
        userId: 'user1',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
      },
    ];

    prisma.todo.findMany.mockResolvedValue(mockTodos);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.list({ priorityFilter: 'urgent' as const });

    expect(result.todos).toHaveLength(1);
    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      where: { userId: 'user1', priority: 'urgent' },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  });
});
