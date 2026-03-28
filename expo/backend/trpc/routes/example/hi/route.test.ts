import { describe, it, expect } from 'vitest';
import { createTestCaller } from '@/backend/__tests__/helpers/trpc-caller';

describe('Hi Route', () => {
  it('should return hello message with provided name', async () => {
    const caller = await createTestCaller();
    
    const result = await caller.example.hi({ name: 'John' });
    
    expect(result).toHaveProperty('hello', 'John');
    expect(result).toHaveProperty('date');
    expect(result.date).toBeInstanceOf(Date);
  });

  it('should return hello message with different name', async () => {
    const caller = await createTestCaller();
    
    const result = await caller.example.hi({ name: 'Maria' });
    
    expect(result.hello).toBe('Maria');
  });

  it('should return current date', async () => {
    const caller = await createTestCaller();
    const beforeCall = new Date();
    
    const result = await caller.example.hi({ name: 'Test' });
    
    const afterCall = new Date();
    
    expect(result.date.getTime()).toBeGreaterThanOrEqual(beforeCall.getTime());
    expect(result.date.getTime()).toBeLessThanOrEqual(afterCall.getTime());
  });

  it('should handle empty string name', async () => {
    const caller = await createTestCaller();
    
    const result = await caller.example.hi({ name: '' });
    
    expect(result.hello).toBe('');
    expect(result).toHaveProperty('date');
  });

  it('should handle special characters in name', async () => {
    const caller = await createTestCaller();
    const specialName = 'João@#$%';
    
    const result = await caller.example.hi({ name: specialName });
    
    expect(result.hello).toBe(specialName);
  });
});
