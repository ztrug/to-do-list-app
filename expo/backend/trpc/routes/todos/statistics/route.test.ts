import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

describe('Statistics Todos Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return statistics for user todos', async () => {
    prisma.todo.count.mockResolvedValueOnce(10);
    prisma.todo.count.mockResolvedValueOnce(6);
    prisma.todo.count.mockResolvedValueOnce(4);
    prisma.todo.count.mockResolvedValueOnce(3);
    prisma.todo.count.mockResolvedValueOnce(2);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.statistics();

    expect(result.statistics).toEqual({
      total: 10,
      completed: 6,
      active: 4,
      urgent: 3,
      overdue: 2,
      completionRate: 60,
    });

    expect(prisma.todo.count).toHaveBeenCalledTimes(5);
  });

  it('should handle zero todos', async () => {
    prisma.todo.count.mockResolvedValue(0);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.statistics();

    expect(result.statistics.total).toBe(0);
    expect(result.statistics.completionRate).toBe(0);
  });

  it('should calculate completion rate correctly', async () => {
    prisma.todo.count.mockResolvedValueOnce(7);
    prisma.todo.count.mockResolvedValueOnce(5);
    prisma.todo.count.mockResolvedValueOnce(2);
    prisma.todo.count.mockResolvedValueOnce(1);
    prisma.todo.count.mockResolvedValueOnce(0);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.statistics();

    expect(result.statistics.completionRate).toBe(71.4);
  });
});
