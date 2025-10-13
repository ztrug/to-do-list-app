import { describe, it, expect } from 'vitest';
import app from './hono';

describe('Hono Server', () => {
  it('should return status ok on root endpoint', async () => {
    const req = new Request('http://localhost:3000/');
    const res = await app.fetch(req);
    const data = await res.json();
    
    expect(res.status).toBe(200);
    expect(data).toEqual({
      status: 'ok',
      message: 'API is running',
    });
  });

  it('should have CORS enabled', async () => {
    const req = new Request('http://localhost:3000/', {
      headers: {
        'Origin': 'http://example.com',
      },
    });
    const res = await app.fetch(req);
    
    expect(res.headers.get('access-control-allow-origin')).toBeTruthy();
  });

  it('should handle 404 for unknown routes', async () => {
    const req = new Request('http://localhost:3000/unknown-route');
    const res = await app.fetch(req);
    
    expect(res.status).toBe(404);
  });
});
