import { NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { getUserById } from "@/lib/models/user"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = await getUserById(session.userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      credits: user.credits,
      plan: user.plan,
    })
  } catch (error) {
    console.error("Get credits error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
