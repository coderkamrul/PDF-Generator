import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getAllFiles, deleteFile, getFileStats } from "@/lib/models/file"
import { createUsageLog } from "@/lib/models/usage-log"

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const [files, stats] = await Promise.all([getAllFiles(), getFileStats()])

    return NextResponse.json({ files, stats })
  } catch (error) {
    console.error("Admin get files error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("id")

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    const success = await deleteFile(fileId)

    if (success) {
      const ip = request.headers.get("x-forwarded-for") || "unknown"
      await createUsageLog(admin.userId, "ADMIN_DELETE_FILE", `Deleted file ${fileId}`, ip)
    }

    return NextResponse.json({ success })
  } catch (error) {
    console.error("Admin delete file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
