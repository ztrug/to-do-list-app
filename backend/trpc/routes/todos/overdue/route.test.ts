import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

describe('Overdue Todos Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return overdue todos', async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const mockTodos = [
      {
        id: '1',
        title: 'Overdue urgent',
        completed: false,
        priority: 'urgent',
        dueDate: yesterday,
        notificationId: null,
        userId: 'user1',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
      },
      {
        id: '2',
        title: 'Overdue intermediate',
        completed: false,
        priority: 'intermediate',
        dueDate: yesterday,
        notificationId: null,
        userId: 'user1',
        categoryId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        category: null,
      },
      {
        id: '3',
        title: 'Overdue not-urgent',
        completed: false,
        priority: 'not-urgent',
        dueDate: yesterday,
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

    const result = await caller.todos.overdue();

    expect(result.todos).toHaveLength(3);
    expect(result.count).toBe(3);
    expect(result.groupedByPriority).toEqual({
      urgent: 1,
      intermediate: 1,
      notUrgent: 1,
    });
  });

  it('should return empty array when no overdue todos', async () => {
    prisma.todo.findMany.mockResolvedValue([]);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.overdue();

    expect(result.todos).toHaveLength(0);
    expect(result.count).toBe(0);
    expect(result.groupedByPriority).toEqual({
      urgent: 0,
      intermediate: 0,
      notUrgent: 0,
    });
  });

  it('should only return incomplete todos', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    await caller.todos.overdue();

    expect(prisma.todo.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          completed: false,
        }),
      })
    );
  });
});
