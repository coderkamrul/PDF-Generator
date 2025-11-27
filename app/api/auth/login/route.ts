import { type NextRequest, NextResponse } from "next/server"
import { verifyUser } from "@/lib/models/user"
import { signToken, setSessionCookie } from "@/lib/jwt"
import { createUsageLog } from "@/lib/models/usage-log"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = await verifyUser(email, password)

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    await setSessionCookie(token)

    // Log the login
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    await createUsageLog(user.id, "LOGIN", `User logged in: ${email}`, ip)

    return NextResponse.json({ user, token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
