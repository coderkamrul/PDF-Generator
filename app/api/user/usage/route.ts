import { NextResponse } from "next/server"
import { requireUser } from "@/lib/auth-guard"
import { getApiUsageToday, getUserApiLimit, getUserKeyLimit } from "@/lib/models/api-limits"
import { getDb } from "@/lib/mongodb"

export async function GET() {
    const user = await requireUser()
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const [apiUsage, apiLimit, keyLimit] = await Promise.all([
            getApiUsageToday(user.userId),
            getUserApiLimit(user.userId),
            getUserKeyLimit(user.userId),
        ])

        const db = await getDb()
        const keyCount = await db.collection("api_keys").countDocuments({ userId: user.userId })

        return NextResponse.json({
            apiUsage,
            apiLimit,
            keyCount,
            keyLimit,
        })
    } catch (error) {
        console.error("Failed to fetch user usage:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
