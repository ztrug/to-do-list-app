import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

describe('By Category Todos Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return todo count by category', async () => {
    const mockCategories = [
      {
        id: 'cat1',
        name: 'Trabalho',
        color: '#FF0000',
        icon: '💼',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { todos: 5 },
      },
      {
        id: 'cat2',
        name: 'Pessoal',
        color: '#00FF00',
        icon: '🏠',
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: { todos: 3 },
      },
    ];

    prisma.category.findMany.mockResolvedValue(mockCategories);
    prisma.todo.count.mockResolvedValue(2);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.byCategory();

    expect(result.categories).toHaveLength(3);
    expect(result.categories[0]).toEqual({
      categoryId: 'cat1',
      categoryName: 'Trabalho',
      categoryColor: '#FF0000',
      categoryIcon: '💼',
      todoCount: 5,
    });
    expect(result.categories[2]).toEqual({
      categoryId: 'uncategorized',
      categoryName: 'Sem categoria',
      categoryColor: '#9CA3AF',
      categoryIcon: null,
      todoCount: 2,
    });
  });

  it('should handle no categories', async () => {
    prisma.category.findMany.mockResolvedValue([]);
    prisma.todo.count.mockResolvedValue(10);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.byCategory();

    expect(result.categories).toHaveLength(1);
    expect(result.categories[0].categoryId).toBe('uncategorized');
    expect(result.categories[0].todoCount).toBe(10);
  });
});
