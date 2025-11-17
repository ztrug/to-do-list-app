import { beforeAll, afterAll, afterEach } from 'vitest';

beforeAll(() => {
  console.log('Starting test suite');
});

afterEach(() => {
  console.log('Test completed');
});

afterAll(() => {
  console.log('Test suite finished');
});
