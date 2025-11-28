import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { getDb } from "@/lib/mongodb"

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const db = await getDb()

        // Check if user has any pending plan upgrade transactions
        const pendingUpgrade = await db.collection("transactions").findOne({
            userId: session.userId,
            status: "pending",
            planUpgrade: { $exists: true }
        })

        return NextResponse.json({
            hasPendingUpgrade: !!pendingUpgrade,
            pendingPlan: pendingUpgrade?.planUpgrade || null
        })
    } catch (error) {
        console.error("Failed to check pending upgrades:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
