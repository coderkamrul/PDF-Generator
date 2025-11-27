import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { updateUserPlan, getUserById } from "@/lib/models/user"
import { createUsageLog } from "@/lib/models/usage-log"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { plan } = await request.json()

    if (!["free", "pro", "business"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
    }

    const success = await updateUserPlan(session.userId, plan)

    if (!success) {
      return NextResponse.json({ error: "Failed to update plan" }, { status: 500 })
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    await createUsageLog(session.userId, "PLAN_CHANGE", `Changed plan to: ${plan}`, ip)

    const user = await getUserById(session.userId)

    return NextResponse.json({
      success: true,
      plan,
      credits: user?.credits,
    })
  } catch (error) {
    console.error("Update plan error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
