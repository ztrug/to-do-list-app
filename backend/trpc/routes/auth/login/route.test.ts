import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';
import bcrypt from 'bcryptjs';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

vi.mock('bcryptjs');

describe('Login Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should login user successfully with correct credentials', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      age: 25,
      howFound: 'Search',
      profilePhoto: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(true as never);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: null,
    });

    const result = await caller.auth.login({
      email: 'test@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBe('1');
  });

  it('should throw error if user not found', async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: null,
    });

    await expect(
      caller.auth.login({
        email: 'nonexistent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Email ou senha incorretos');
  });

  it('should throw error if password is incorrect', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Test User',
      age: 25,
      howFound: 'Search',
      profilePhoto: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(mockUser);
    vi.mocked(bcrypt.compare).mockResolvedValue(false as never);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: null,
    });

    await expect(
      caller.auth.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Email ou senha incorretos');
  });
});
