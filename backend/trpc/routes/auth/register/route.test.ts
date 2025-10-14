import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prisma } from '@/backend/__tests__/mocks/prisma';
import { appRouter } from '@/backend/trpc/app-router';
import bcrypt from 'bcryptjs';

vi.mock('@/backend/lib/prisma', () => ({
  prisma: prisma,
}));

vi.mock('bcryptjs');

describe('Register Route', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
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

    prisma.user.findUnique.mockResolvedValue(null);
    prisma.user.create.mockResolvedValue(mockUser);
    vi.mocked(bcrypt.hash).mockResolvedValue('hashedPassword' as never);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: null,
    });

    const result = await caller.auth.register({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      age: 25,
      howFound: 'Search',
    });

    expect(result.success).toBe(true);
    expect(result.user.email).toBe('test@example.com');
    expect(result.token).toBe('1');
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        age: 25,
        howFound: 'Search',
      },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        howFound: true,
        profilePhoto: true,
        createdAt: true,
      },
    });
  });

  it('should throw error if email already exists', async () => {
    const existingUser = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedPassword',
      name: 'Existing User',
      age: 30,
      howFound: 'Friend',
      profilePhoto: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(existingUser);

    const caller = appRouter.createCaller({
      req: {} as any,
      prisma,
      userId: null,
    });

    await expect(
      caller.auth.register({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        age: 25,
        howFound: 'Search',
      })
    ).rejects.toThrow('Email já cadastrado');
  });
});
