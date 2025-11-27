import { getSession } from "./jwt"
import { getUserById } from "./models/user"

export async function requireAdmin(): Promise<{ userId: string; email: string } | null> {
  const session = await getSession()

  if (!session) return null

  const user = await getUserById(session.userId)

  if (!user || !user.isAdmin) return null

  return { userId: session.userId, email: session.email }
}
