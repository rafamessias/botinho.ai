"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
    // Remove cookies
    const cookieStore = await cookies();
    cookieStore.delete("jwt");
    cookieStore.delete("user");
    // Redirect to sign-in
    redirect("/sign-in");
}