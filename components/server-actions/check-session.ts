import { auth } from "@/app/auth"

export const checkSession = async (): Promise<string> => {
    const session = await auth()
    if (!session?.user?.email) throw new Error("not-authenticated")

    return session?.user?.email
}