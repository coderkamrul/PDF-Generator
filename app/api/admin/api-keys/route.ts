import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getAllApiKeys } from "@/lib/models/api-key"

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const keys = await getAllApiKeys()
    return NextResponse.json({ keys })
  } catch (error) {
    console.error("Admin get API keys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
