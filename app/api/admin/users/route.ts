import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getAllUsers, addCreditsToUser, toggleUserDisabled } from "@/lib/models/user"
import { createUsageLog } from "@/lib/models/usage-log"
import { getDb } from "@/lib/mongodb"

export const dynamic = 'force-dynamic'

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

    const { userId, action, amount, isAdmin, apiLimit } = await request.json()
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

    if (action === "toggleAdmin") {
      const db = await getDb()
      const { ObjectId } = await import("mongodb")
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { isAdmin: isAdmin } }
      )
      await createUsageLog(admin.userId, "ADMIN_TOGGLE_ROLE", `Changed admin status for user ${userId} to ${isAdmin}`, ip)
      return NextResponse.json({ success: true })
    }

    if (action === "setApiLimit") {
      const { setUserApiLimit } = await import("@/lib/models/api-limits")
      const success = await setUserApiLimit(userId, apiLimit)
      if (success) {
        await createUsageLog(admin.userId, "ADMIN_SET_API_LIMIT", `Set API limit for user ${userId} to ${apiLimit}`, ip)
      }
      return NextResponse.json({ success })
    }

    if (action === "setMaxApiKeys") {
      const { setUserKeyLimit } = await import("@/lib/models/api-limits")
      const { maxApiKeys } = await request.json()
      const success = await setUserKeyLimit(userId, maxApiKeys)
      if (success) {
        await createUsageLog(admin.userId, "ADMIN_SET_KEY_LIMIT", `Set Max API Keys for user ${userId} to ${maxApiKeys}`, ip)
      }
      return NextResponse.json({ success })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Admin update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
