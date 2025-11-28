import { ObjectId } from "mongodb"
import { getDb } from "../mongodb"

export interface TransactionDocument {
    _id?: ObjectId
    userId: string
    amount: number
    currency: string
    provider: "stripe" | "paypal" | "cod"
    status: "pending" | "completed" | "failed"
    providerTransactionId?: string
    creditsAmount: number
    createdAt: Date
    updatedAt: Date
}

export async function createTransaction(
    userId: string,
    amount: number,
    currency: string,
    provider: "stripe" | "paypal" | "cod",
    creditsAmount: number
): Promise<string> {
    const db = await getDb()
    const transactions = db.collection<TransactionDocument>("transactions")

    const result = await transactions.insertOne({
        userId,
        amount,
        currency,
        provider,
        status: "pending",
        creditsAmount,
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    return result.insertedId.toString()
}

export async function updateTransactionStatus(
    id: string,
    status: "completed" | "failed",
    providerTransactionId?: string
): Promise<boolean> {
    const db = await getDb()
    const transactions = db.collection<TransactionDocument>("transactions")

    const update: any = {
        status,
        updatedAt: new Date(),
    }

    if (providerTransactionId) {
        update.providerTransactionId = providerTransactionId
    }

    const result = await transactions.updateOne(
        { _id: new ObjectId(id) },
        { $set: update }
    )

    return result.modifiedCount > 0
}
