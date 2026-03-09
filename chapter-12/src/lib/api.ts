import { env } from '@/config/env';
import type { RefreshTokenResponse } from '@/types/generated/types.gen';

type RequestOptions<TBody = unknown> = {
  method?: string;
  headers?: Record<string, string>;
  body?: TBody;
  params?: Record<string, string | number | boolean | undefined | null>;
};

let refreshPromise: Promise<RefreshTokenResponse> | null = null;

async function refreshToken(
  cookieHeader?: string,
): Promise<RefreshTokenResponse> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      };

      const refreshTokenResponse = await fetch(`${env.API_URL}/auth/refresh`, {
        method: 'POST',
        headers,
        ...(cookieHeader ? {} : { credentials: 'include' }),
      });

      if (!refreshTokenResponse.ok) {
        throw new Error('Token refresh failed');
      }

      return refreshTokenResponse.json();
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

async function fetchApi<T, TBody = unknown>(
  url: string,
  options: RequestOptions<TBody> = {},
): Promise<T> {
  const { method = 'GET', headers = {}, body, params } = options;

  const fullUrl = new URL(url, env.API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value != null) {
        fullUrl.searchParams.set(key, String(value));
      }
    });
  }

  const makeRequest = async (accessToken?: string): Promise<Response> => {
    try {
      return await fetch(fullUrl, {
        method,
        headers: {
          Accept: 'application/json',
          ...(body ? { 'Content-Type': 'application/json' } : {}),
          ...headers,
          ...(accessToken && typeof window === 'undefined'
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
        credentials: typeof window !== 'undefined' ? 'include' : undefined,
      });
    } catch (error) {
      if (error instanceof TypeError) {
        const networkError = new Error(
          'Network error. Please check your connection.',
        );

        throw networkError;
      }
      throw error;
    }
  };

  let response = await makeRequest();

  if (
    !response.ok &&
    response.status === 401 &&
    !url.endsWith('/auth/login') &&
    !url.endsWith('/auth/register')
  ) {
    const cookieHeader = headers.Cookie;

    try {
      const { accessToken } = await refreshToken(cookieHeader);

      response = await makeRequest(accessToken);
    } catch (refreshError) {
      console.warn('Token refresh failed:', refreshError);
    }
  }

  if (!response.ok) {
    let message = response.statusText;
    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch {}

    throw new Error(message);
  }

  try {
    return await response.json();
  } catch {
    throw new Error('Invalid response from server');
  }
}

export const api = {
  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'GET' });
  },
  post<T, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<T> {
    return fetchApi<T, TBody>(url, { ...options, method: 'POST', body });
  },
  put<T, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<T> {
    return fetchApi<T, TBody>(url, { ...options, method: 'PUT', body });
  },
  patch<T, TBody = unknown>(
    url: string,
    body?: TBody,
    options?: RequestOptions,
  ): Promise<T> {
    return fetchApi<T, TBody>(url, { ...options, method: 'PATCH', body });
  },
  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return fetchApi<T>(url, { ...options, method: 'DELETE' });
  },
};
