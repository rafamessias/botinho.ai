'use server';

import { getAuthToken } from "@/components/services/get-token";

const strapiUrl = process.env.STRAPI_URL;

export async function fetchContentApi<T>(
  endpoint: string,
  options?: Omit<RequestInit, 'method' | 'body'> & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    token?: string;
    body?: any;
    revalidateSeconds?: number;
  }
): Promise<T> {
  const url = new URL(endpoint, `${strapiUrl}/api/`);
  const token = options?.token || await getAuthToken();

  // Default fetch options
  const fetchOptions: RequestInit = {
    method: options?.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    next: options?.revalidateSeconds
      ? { revalidate: options.revalidateSeconds }
      : undefined,
  };

  if (options?.body) {
    fetchOptions.body = JSON.stringify(options.body);
  }

  console.log('fetchOptions', fetchOptions);
  console.log('strapiUrl', strapiUrl);
  console.log('url', url.toString());
  const response = await fetch(url.toString(), fetchOptions);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `fetchContentApi error: ${response.status} ${response.statusText} - ${errorText}`
    );
  }

  return (await response.json()) as T;
}
