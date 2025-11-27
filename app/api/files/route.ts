import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { getFilesByUserId, deleteFile, getFileById } from "@/lib/models/file"
import { createUsageLog } from "@/lib/models/usage-log"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const files = await getFilesByUserId(session.userId)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Get files error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const fileId = searchParams.get("id")

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    const file = await getFileById(fileId)
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const success = await deleteFile(fileId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    await createUsageLog(session.userId, "FILE_DELETE", `Deleted file: ${file.filename}`, ip)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    const file = await getFileById(fileId)

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    if (file.userId !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ file })
  } catch (error) {
    console.error("Get file error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
