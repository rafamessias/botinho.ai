import { strapi } from '@strapi/client';

export const client = strapi({ baseURL: `${process.env.NEXT_PUBLIC_STRAPI_URL}/api` });
export const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;