import { NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getAllUsers } from "@/lib/models/user"
import { getFileStats } from "@/lib/models/file"
import { getAllApiKeys } from "@/lib/models/api-key"

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const [users, fileStats, apiKeys] = await Promise.all([getAllUsers(), getFileStats(), getAllApiKeys()])

    const totalUsers = users.length
    const proUsers = users.filter((u) => u.plan === "pro").length
    const businessUsers = users.filter((u) => u.plan === "business").length

    return NextResponse.json({
      totalUsers,
      proUsers,
      businessUsers,
      totalFiles: fileStats.total,
      apiGeneratedFiles: fileStats.apiGenerated,
      totalApiKeys: apiKeys.length,
      totalUsage: apiKeys.reduce((acc, k) => acc + k.usageCount, 0),
    })
  } catch (error) {
    console.error("Admin get stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
