import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

describe('Search Todos Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should search todos by query', async () => {
    const mockTodos = [
      {
        id: '1',
        title: 'Comprar café',
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
        title: 'Preparar café',
        completed: false,
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

    const result = await caller.todos.search({ query: 'café' });

    expect(result.todos).toHaveLength(2);
    expect(result.count).toBe(2);
    expect(prisma.todo.findMany).toHaveBeenCalledWith({
      where: {
        userId: 'user1',
        title: {
          contains: 'café',
          mode: 'insensitive',
        },
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  });

  it('should return empty array for empty query', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.search({ query: '' });

    expect(result.todos).toHaveLength(0);
    expect(prisma.todo.findMany).not.toHaveBeenCalled();
  });

  it('should return empty array for whitespace-only query', async () => {
    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.search({ query: '   ' });

    expect(result.todos).toHaveLength(0);
    expect(prisma.todo.findMany).not.toHaveBeenCalled();
  });
});
