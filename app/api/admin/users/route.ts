import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getAllUsers, addCreditsToUser, toggleUserDisabled } from "@/lib/models/user"
import { createUsageLog } from "@/lib/models/usage-log"

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const users = await getAllUsers()
    return NextResponse.json({ users })
  } catch (error) {
    console.error("Admin get users error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { userId, action, amount } = await request.json()
    const ip = request.headers.get("x-forwarded-for") || "unknown"

    if (action === "add_credits") {
      const success = await addCreditsToUser(userId, amount)
      if (success) {
        await createUsageLog(admin.userId, "ADMIN_ADD_CREDITS", `Added ${amount} credits to user ${userId}`, ip)
      }
      return NextResponse.json({ success })
    }

    if (action === "disable") {
      const success = await toggleUserDisabled(userId, true)
      if (success) {
        await createUsageLog(admin.userId, "ADMIN_DISABLE_USER", `Disabled user ${userId}`, ip)
      }
      return NextResponse.json({ success })
    }

    if (action === "enable") {
      const success = await toggleUserDisabled(userId, false)
      if (success) {
        await createUsageLog(admin.userId, "ADMIN_ENABLE_USER", `Enabled user ${userId}`, ip)
      }
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Admin update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
