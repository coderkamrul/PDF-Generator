import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { createTransaction } from "@/lib/models/transaction"

export async function POST(request: NextRequest) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        const { plan, paymentMethod, amount, interval } = await request.json()

        // Validate plan against database
        const { getDb } = await import("@/lib/mongodb")
        const db = await getDb()
        const selectedPlan = await db.collection("plans").findOne({ key: plan })

        if (!selectedPlan) {
            return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
        }

        if (!paymentMethod) {
            return NextResponse.json({ error: "Payment method is required" }, { status: 400 })
        }

        if (amount < 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
        }

        // Check if user is already on this plan
        const { getUserById, updateUserPlan, addCreditsToUser } = await import("@/lib/models/user")
        const currentUser = await getUserById(session.userId)

        if (currentUser?.plan === plan) {
            return NextResponse.json({ error: "You are already subscribed to this plan" }, { status: 400 })
        }

        // Determine credits based on interval
        const credits = interval === "yearly" ? selectedPlan.yearlyCredits : selectedPlan.monthlyCredits

        // If amount is 0 (Free Plan), auto-approve
        if (amount === 0) {
            await updateUserPlan(session.userId, plan)
            // For free plan, we might want to set credits or add them. 
            // Assuming we add them as per previous logic, or maybe just set them?
            // The user request "credit s not added" implies they expect addition.
            // But for a plan switch, usually you get the new plan's allowance.
            // I will add them to be safe and consistent with "upgrade".
            await addCreditsToUser(session.userId, credits)

            return NextResponse.json({
                success: true,
                message: "Plan updated successfully."
            })
        }

        // Create a pending transaction with plan upgrade metadata
        const transactionId = await createTransaction(
            session.userId,
            amount,
            "USD",
            paymentMethod,
            credits
        )

        const { ObjectId } = await import("mongodb")
        await db.collection("transactions").updateOne(
            { _id: new ObjectId(transactionId) },
            { $set: { planUpgrade: plan } }
        )

        return NextResponse.json({
            success: true,
            transactionId,
            message: "Plan upgrade request submitted."
        })
    } catch (error) {
        console.error("Plan upgrade error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
