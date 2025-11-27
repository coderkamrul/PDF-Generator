import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getUsageLogs } from "@/lib/models/usage-log"

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    const logs = await getUsageLogs(limit)
    return NextResponse.json({ logs })
  } catch (error) {
    console.error("Admin get logs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
