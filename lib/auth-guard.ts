import { getSession } from "./jwt"
import { getUserById } from "./models/user"

export async function requireUser(): Promise<{ userId: string; email: string } | null> {
    const session = await getSession()

    if (!session) return null

    // Optional: Verify user still exists in DB if strict security is needed
    // const user = await getUserById(session.userId)
    // if (!user) return null

    return { userId: session.userId, email: session.email }
}
