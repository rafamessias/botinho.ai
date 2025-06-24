'use server';

import { getAuthToken } from "@/components/services/get-token";
import { ApiResponse } from "../types/strapi";
import { revalidateTag } from "next/cache";

const strapiUrl = process.env.STRAPI_URL;

// Example usage with type specification:
// const response = await fetchContentApi<Company>('companies', { method: 'GET' });
// const response = await fetchContentApi<Incident>('incidents', { method: 'POST', body: incidentData });
// const response = await fetchContentApi<Comment>('comments', { method: 'PUT', body: commentData });


export async function fetchContentApi<T>(
  endpoint: string,
  options?: Omit<RequestInit, 'method' | 'body'> & {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    token?: string;
    body?: any;
    next?: {
      revalidate?: number;
      tags?: string[];
    };
    revalidateTag?: string | string[];
  }
): Promise<ApiResponse<T>> {

  try {

    const url = new URL(endpoint, `${strapiUrl}/api/`);
    const token = options?.token || await getAuthToken();

    // Default fetch options
    const fetchOptions: RequestInit = {
      method: options?.method || 'GET',
      headers: {
        ...(endpoint !== 'upload' && { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      next: options?.next || {}
    };

    if (options?.body && endpoint !== 'upload') {
      fetchOptions.body = JSON.stringify(options.body);
    } else {
      //for upload, we need to pass the body as a FormData object
      fetchOptions.body = options?.body;
    }

    // console.log('strapiUrl', strapiUrl);
    // console.log('url', url.toString());
    const response = await fetch(url.toString(), fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, data: null, meta: null, error: `fetchContentApi error: ${response.status} ${response.statusText} - ${errorText}` } as ApiResponse<T>;
    }

    // Revalidate AFTER a successful mutation
    if (fetchOptions.method === 'POST' || fetchOptions.method === 'PUT' || fetchOptions.method === 'DELETE') {
      if (options?.revalidateTag) {
        const tags = Array.isArray(options.revalidateTag) ? options.revalidateTag : [options.revalidateTag];
        tags.forEach(tag => revalidateTag(tag));
      }
    }


    // If the method is DELETE, return a boolean true
    if (options?.method === 'DELETE') {
      return { success: true, data: true } as ApiResponse<T>;
    }

    const getData = await response.json();
    let data: T | null = null;
    let meta: any = null;

    if (getData.data) data = getData.data as T;
    else data = getData as T;

    if (getData.meta) meta = getData.meta;

    return { success: true, data: data, meta: meta } as ApiResponse<T>;

  } catch (error) {
    return { success: false, data: null, meta: null, error: `fetchContentApi error: ${error}` } as ApiResponse<T>;
  }
}
