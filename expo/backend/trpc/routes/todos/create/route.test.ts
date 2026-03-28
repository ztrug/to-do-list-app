import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

describe('Create Todo Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a new todo successfully', async () => {
    const mockTodo = {
      id: '1',
      title: 'Test Todo',
      completed: false,
      priority: 'urgent',
      dueDate: new Date('2025-10-15'),
      notificationId: null,
      userId: 'user1',
      categoryId: 'cat1',
      createdAt: new Date(),
      updatedAt: new Date(),
      category: {
        id: 'cat1',
        name: 'Work',
        color: '#3B82F6',
        icon: 'briefcase',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    };

    prisma.todo.create.mockResolvedValue(mockTodo);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.create({
      title: 'Test Todo',
      priority: 'urgent' as const,
      dueDate: '2025-10-15T00:00:00.000Z',
      categoryId: 'cat1',
    });

    expect(result.success).toBe(true);
    expect(result.todo.title).toBe('Test Todo');
    expect(result.todo.priority).toBe('urgent');
    expect(prisma.todo.create).toHaveBeenCalled();
  });

  it('should create todo without optional fields', async () => {
    const mockTodo = {
      id: '2',
      title: 'Simple Todo',
      completed: false,
      priority: 'not-urgent',
      dueDate: null,
      notificationId: null,
      userId: 'user1',
      categoryId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      category: null,
    };

    prisma.todo.create.mockResolvedValue(mockTodo);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: 'user1',
    });

    const result = await caller.todos.create({
      title: 'Simple Todo',
      priority: 'not-urgent' as const,
    });

    expect(result.success).toBe(true);
    expect(result.todo.title).toBe('Simple Todo');
  });
});
