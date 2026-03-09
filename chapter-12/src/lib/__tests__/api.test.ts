import { api } from '../api';

vi.mock('@/config/env', () => ({
  env: {
    API_URL: 'https://api.example.com',
  },
}));

describe('api', () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch);
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const createMockResponse = (
    data: unknown,
    options: { ok?: boolean; status?: number; statusText?: string } = {},
  ) => {
    const { ok = true, status = 200, statusText = 'OK' } = options;
    return {
      ok,
      status,
      statusText,
      json: vi.fn().mockResolvedValue(data),
    };
  };

  describe('api.get', () => {
    it('should make a GET request to the correct URL', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ data: 'test' }));

      await api.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users',
        }),
        expect.objectContaining({
          method: 'GET',
        }),
      );
    });

    it('should return the response data', async () => {
      const responseData = { id: 1, name: 'John' };
      mockFetch.mockResolvedValue(createMockResponse(responseData));

      const result = await api.get('/users/1');

      expect(result).toEqual(responseData);
    });

    it('should include query params in the URL', async () => {
      mockFetch.mockResolvedValue(createMockResponse([]));

      await api.get('/users', { params: { page: 1, limit: 10, active: true } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users?page=1&limit=10&active=true',
        }),
        expect.anything(),
      );
    });

    it('should exclude null and undefined params', async () => {
      mockFetch.mockResolvedValue(createMockResponse([]));

      await api.get('/users', {
        params: { page: 1, filter: undefined, sort: null },
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users?page=1',
        }),
        expect.anything(),
      );
    });

    it('should include custom headers', async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await api.get('/users', { headers: { 'X-Custom-Header': 'value' } });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'value',
            Accept: 'application/json',
          }),
        }),
      );
    });
  });

  describe('api.post', () => {
    it('should make a POST request with body', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ id: 1 }));
      const body = { name: 'John', email: 'john@example.com' };

      await api.post('/users', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users',
        }),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(body),
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        }),
      );
    });

    it('should make a POST request without body', async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await api.post('/logout');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        }),
      );
    });
  });

  describe('api.put', () => {
    it('should make a PUT request with body', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ id: 1 }));
      const body = { name: 'Jane' };

      await api.put('/users/1', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users/1',
        }),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe('api.patch', () => {
    it('should make a PATCH request with body', async () => {
      mockFetch.mockResolvedValue(createMockResponse({ id: 1 }));
      const body = { status: 'active' };

      await api.patch('/users/1', body);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users/1',
        }),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(body),
        }),
      );
    });
  });

  describe('api.delete', () => {
    it('should make a DELETE request', async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await api.delete('/users/1');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.objectContaining({
          href: 'https://api.example.com/users/1',
        }),
        expect.objectContaining({
          method: 'DELETE',
        }),
      );
    });
  });

  describe('error handling', () => {
    it('should throw an error with message from response on non-ok response', async () => {
      const errorResponse = {
        ok: false,
        status: 400,
        statusText: 'Bad Request',
        json: vi.fn().mockResolvedValue({ message: 'Validation failed' }),
      };
      mockFetch.mockResolvedValue(errorResponse);

      await expect(api.get('/users')).rejects.toThrow('Validation failed');
    });

    it('should throw an error with statusText if no message in response', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockResolvedValue({}),
      };
      mockFetch.mockResolvedValue(errorResponse);

      await expect(api.get('/users')).rejects.toThrow('Internal Server Error');
    });

    it('should throw an error with statusText if response json parsing fails', async () => {
      const errorResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(errorResponse);

      await expect(api.get('/users')).rejects.toThrow('Internal Server Error');
    });

    it('should throw a network error on TypeError', async () => {
      mockFetch.mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(api.get('/users')).rejects.toThrow(
        'Network error. Please check your connection.',
      );
    });

    it('should rethrow non-TypeError errors', async () => {
      const customError = new Error('Custom error');
      mockFetch.mockRejectedValue(customError);

      await expect(api.get('/users')).rejects.toThrow('Custom error');
    });

    it('should throw an error if response is not valid JSON', async () => {
      const response = {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      };
      mockFetch.mockResolvedValue(response);

      await expect(api.get('/users')).rejects.toThrow(
        'Invalid response from server',
      );
    });
  });

  describe('token refresh', () => {
    it('should attempt to refresh token on 401 response', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ message: 'Unauthorized' }),
      };
      const refreshResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ accessToken: 'new-token' }),
      };
      const successResponse = createMockResponse({ data: 'success' });

      mockFetch
        .mockResolvedValueOnce(unauthorizedResponse)
        .mockResolvedValueOnce(refreshResponse)
        .mockResolvedValueOnce(successResponse);

      const result = await api.get('/protected');

      expect(mockFetch).toHaveBeenCalledTimes(3);
      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://api.example.com/auth/refresh',
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(result).toEqual({ data: 'success' });
    });

    it('should not refresh token for /auth/login endpoint', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ message: 'Invalid credentials' }),
      };
      mockFetch.mockResolvedValue(unauthorizedResponse);

      await expect(
        api.post('/auth/login', { email: 'test@test.com' }),
      ).rejects.toThrow('Invalid credentials');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should not refresh token for /auth/register endpoint', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ message: 'Registration failed' }),
      };
      mockFetch.mockResolvedValue(unauthorizedResponse);

      await expect(
        api.post('/auth/register', { email: 'test@test.com' }),
      ).rejects.toThrow('Registration failed');

      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should throw original error if refresh fails', async () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ message: 'Token expired' }),
      };
      const refreshFailResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({}),
      };

      mockFetch
        .mockResolvedValueOnce(unauthorizedResponse)
        .mockResolvedValueOnce(refreshFailResponse);

      await expect(api.get('/protected')).rejects.toThrow('Token expired');
      expect(consoleSpy).toHaveBeenCalledWith(
        'Token refresh failed:',
        expect.any(Error),
      );

      consoleSpy.mockRestore();
    });

    it('should forward Cookie header to refresh endpoint for server-side requests', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({ message: 'Unauthorized' }),
      };
      const refreshResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ accessToken: 'new-token' }),
      };
      const successResponse = createMockResponse({ data: 'success' });

      mockFetch
        .mockResolvedValueOnce(unauthorizedResponse)
        .mockResolvedValueOnce(refreshResponse)
        .mockResolvedValueOnce(successResponse);

      await api.get('/protected', {
        headers: { Cookie: 'session=abc123' },
      });

      expect(mockFetch).toHaveBeenNthCalledWith(
        2,
        'https://api.example.com/auth/refresh',
        expect.objectContaining({
          headers: expect.objectContaining({
            Cookie: 'session=abc123',
          }),
        }),
      );
    });
  });

  describe('browser vs server environment', () => {
    it('should include credentials in browser environment', async () => {
      mockFetch.mockResolvedValue(createMockResponse({}));

      await api.get('/users');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          credentials: 'include',
        }),
      );
    });

    it('should not include Authorization header in browser environment', async () => {
      const unauthorizedResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: vi.fn().mockResolvedValue({}),
      };
      const refreshResponse = {
        ok: true,
        status: 200,
        json: vi.fn().mockResolvedValue({ accessToken: 'new-token' }),
      };
      const successResponse = createMockResponse({ data: 'success' });

      mockFetch
        .mockResolvedValueOnce(unauthorizedResponse)
        .mockResolvedValueOnce(refreshResponse)
        .mockResolvedValueOnce(successResponse);

      await api.get('/protected');

      const retryCall = mockFetch.mock.calls[2];
      expect(retryCall[1].headers).not.toHaveProperty('Authorization');
    });
  });
});
