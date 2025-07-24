import { cookies } from "next/headers";
import { getAuthToken } from "./get-token";

export async function getUserMeLoader() {

    const authToken = await getAuthToken();
    if (!authToken) return { ok: false, data: null, error: null };

    const baseUrl = process.env.STRAPI_URL;
    //Get the user me (id and documentId) with the company (id and documentId)
    const url = new URL(`/api/users/me?fields[0]=id&populate[company][fields][0]=id`, baseUrl);

    try {
        const response = await fetch(url.href, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        });
        const data = await response.json();
        if (data.error) {
            console.error(data.error);
            // Remove cookies
            const cookieStore = await cookies();
            cookieStore.delete("jwt");
            return { ok: false, data: null, error: data.error };
        }

        return { ok: true, data: data, error: null };
    } catch (error) {
        console.error(error);
        // Remove cookies
        const cookieStore = await cookies();
        cookieStore.delete("jwt");
        return { ok: false, data: null, error: error };
    }
}