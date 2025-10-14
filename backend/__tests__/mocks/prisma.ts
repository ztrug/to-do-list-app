import { PrismaClient } from '@prisma/client';
import { beforeEach } from 'vitest';
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended';

beforeEach(() => {
  mockReset(prisma);
});

export const prisma = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;
