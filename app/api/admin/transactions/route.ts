import { type NextRequest, NextResponse } from "next/server"
import { requireAdmin } from "@/lib/admin-guard"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { addCreditsToUser } from "@/lib/models/user"

export async function GET() {
    const admin = await requireAdmin()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const db = await getDb()
        const transactions = await db
            .collection("transactions")
            .find({})
            .sort({ createdAt: -1 })
            .limit(100)
            .toArray()

        // Fetch user information for each transaction
        const transactionsWithUsers = await Promise.all(
            transactions.map(async (transaction) => {
                const user = await db.collection("users").findOne({ _id: new ObjectId(transaction.userId) })
                return {
                    ...transaction,
                    userName: user?.name || "Unknown",
                    userEmail: user?.email || "Unknown",
                }
            })
        )

        return NextResponse.json({ transactions: transactionsWithUsers })
    } catch (error) {
        console.error("Failed to fetch transactions:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    const admin = await requireAdmin()
    if (!admin) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { transactionId, action } = await request.json()

        if (!transactionId || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const db = await getDb()
        const transaction = await db.collection("transactions").findOne({ _id: new ObjectId(transactionId) })

        if (!transaction) {
            return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
        }

        if (transaction.status !== "pending") {
            return NextResponse.json({ error: "Transaction already processed" }, { status: 400 })
        }

        if (action === "approve") {
            // Update transaction status
            await db.collection("transactions").updateOne(
                { _id: new ObjectId(transactionId) },
                { $set: { status: "completed", updatedAt: new Date() } }
            )

            // Add credits to user
            await addCreditsToUser(transaction.userId, transaction.creditsAmount)

            // If this is a plan upgrade, update the user's plan
            if (transaction.planUpgrade) {
                const { updateUserPlan } = await import("@/lib/models/user")
                await updateUserPlan(transaction.userId, transaction.planUpgrade)
            }

            return NextResponse.json({ success: true, message: "Transaction approved" })
        } else if (action === "reject") {
            // Update transaction status
            await db.collection("transactions").updateOne(
                { _id: new ObjectId(transactionId) },
                { $set: { status: "failed", updatedAt: new Date() } }
            )

            return NextResponse.json({ success: true, message: "Transaction rejected" })
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 })
        }
    } catch (error) {
        console.error("Transaction update error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
