import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { createApiKey, getApiKeysByUserId, deleteApiKey } from "@/lib/models/api-key"
import { createUsageLog } from "@/lib/models/usage-log"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const keys = await getApiKeysByUserId(session.userId)
    return NextResponse.json({ keys })
  } catch (error) {
    console.error("Get API keys error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json({ error: "Key name is required" }, { status: 400 })
    }

    // Check API Key Limit
    const { canCreateApiKey } = await import("@/lib/models/api-limits")
    const allowed = await canCreateApiKey(session.userId)

    if (!allowed) {
      return NextResponse.json(
        { error: "API Key limit reached. Please upgrade your plan or contact support." },
        { status: 403 }
      )
    }

    const key = await createApiKey(session.userId, name)

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    await createUsageLog(session.userId, "API_KEY_CREATE", `Created API key: ${name}`, ip)

    return NextResponse.json({ key })
  } catch (error) {
    console.error("Create API key error:", error)
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
    const keyId = searchParams.get("id")

    if (!keyId) {
      return NextResponse.json({ error: "Key ID is required" }, { status: 400 })
    }

    const success = await deleteApiKey(keyId)

    if (!success) {
      return NextResponse.json({ error: "API key not found" }, { status: 404 })
    }

    const ip = request.headers.get("x-forwarded-for") || "unknown"
    await createUsageLog(session.userId, "API_KEY_DELETE", `Deleted API key: ${keyId}`, ip)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete API key error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
