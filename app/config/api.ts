// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://hello-backend-five.vercel.app';

type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: RequestMethod;
    body?: unknown;
    headers?: Record<string, string>;
    params?: Record<string, string | number | boolean | undefined>;
}

/**
 * A centralized API client for making HTTP requests to the backend.
 * 
 * @param endpoint The API endpoint (e.g., '/rooms')
 * @param options Request options including method, body, headers, and query params
 * @returns The parsed JSON response
 */
export async function api<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { method = 'GET', body, headers, params } = options;

    // 1. Construct the URL with query parameters
    const url = new URL(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined) {
                url.searchParams.append(key, String(value));
            }
        });
    }

    // 2. Prepare request init
    const init: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body && (method === 'POST' || method === 'PATCH')) {
        init.body = JSON.stringify(body);
    }

    try {
        // 3. Make the request
        const response = await fetch(url.toString(), init);

        // 4. Handle non-2xx responses
        if (!response.ok) {
            let errorMessage = `API Error: ${response.status} ${response.statusText}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Fallback if response is not JSON
            }
            throw new Error(errorMessage);
        }

        // 5. Handle empty responses (e.g., 204 No Content)
        if (response.status === 204) {
            return {} as T;
        }

        // 6. Return parsed JSON
        return await response.json() as T;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}
