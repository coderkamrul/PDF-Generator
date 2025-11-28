import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getSettings, updateSettings } from "@/lib/models/settings"

export async function GET() {
    const admin = await requireAdmin()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const settings = await getSettings()
        return NextResponse.json(settings)
    } catch (error) {
        console.error("Failed to fetch settings:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const admin = await requireAdmin()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const body = await request.json()
        const success = await updateSettings(body)

        if (success) {
            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
        }
    } catch (error) {
        console.error("Failed to update settings:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
