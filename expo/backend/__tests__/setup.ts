import { beforeAll, afterAll, afterEach } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import { prisma } from './mocks/prisma';

beforeAll(() => {
  console.log('Starting test suite');
});

afterEach(() => {
  mockReset(prisma);
  console.log('Test completed');
});

afterAll(() => {
  console.log('Test suite finished');
});
