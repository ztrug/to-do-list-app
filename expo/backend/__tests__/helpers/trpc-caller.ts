import { appRouter } from '@/backend/trpc/app-router';
import { createContext } from '@/backend/trpc/create-context';

export const createTestCaller = async () => {
  const mockRequest = new Request('http://localhost:3000/api/trpc');
  
  const ctx = await createContext({
    req: mockRequest,
    resHeaders: new Headers(),
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

  return appRouter.createCaller(ctx);
};
