import { describe, it, expect } from 'vitest';
import { createContext } from './create-context';

describe('Create Context', () => {
  it('should create context with request object', async () => {
    const mockRequest = new Request('http://localhost:3000/api/trpc');
    const mockHeaders = new Headers();
    
    const context = await createContext({
      req: mockRequest,
      resHeaders: mockHeaders,
      info: {
        isBatchCall: false,
        calls: [],
        accept: 'application/jsonl',
        type: 'unknown' as const,
        connectionParams: null,
        signal: new AbortController().signal,
        url: new URL('http://localhost:3000/api/trpc'),
      },
    });
    
    expect(context).toHaveProperty('req');
    expect(context.req).toBe(mockRequest);
  });

  it('should handle different request URLs', async () => {
    const mockRequest = new Request('http://localhost:3000/api/trpc/example.hi');
    const mockHeaders = new Headers();
    
    const context = await createContext({
      req: mockRequest,
      resHeaders: mockHeaders,
      info: {
        isBatchCall: false,
        calls: [],
        accept: 'application/jsonl',
        type: 'unknown' as const,
        connectionParams: null,
        signal: new AbortController().signal,
        url: new URL('http://localhost:3000/api/trpc/example.hi'),
      },
    });
    
    expect(context.req.url).toBe('http://localhost:3000/api/trpc/example.hi');
  });

  it('should handle POST requests', async () => {
    const mockRequest = new Request('http://localhost:3000/api/trpc', {
      method: 'POST',
      body: JSON.stringify({ test: 'data' }),
    });
    const mockHeaders = new Headers();
    
    const context = await createContext({
      req: mockRequest,
      resHeaders: mockHeaders,
      info: {
        isBatchCall: false,
        calls: [],
        accept: 'application/jsonl',
        type: 'unknown' as const,
        connectionParams: null,
        signal: new AbortController().signal,
        url: new URL('http://localhost:3000/api/trpc'),
      },
    });
    
    expect(context.req.method).toBe('POST');
  });
});
