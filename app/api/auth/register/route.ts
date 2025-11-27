import { type NextRequest, NextResponse } from "next/server"
import { createUser } from "@/lib/models/user"
import { signToken, setSessionCookie } from "@/lib/jwt"
import { createUsageLog } from "@/lib/models/usage-log"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 })
    }

    const user = await createUser(email, password, name)

    if (!user) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    })

    await setSessionCookie(token)

    // Log the registration
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    await createUsageLog(user.id, "REGISTER", `New user registered: ${email}`, ip)

    return NextResponse.json({ user, token })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
