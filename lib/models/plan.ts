import { ObjectId } from "mongodb"
import { getDb } from "../mongodb"

export interface PlanDocument {
    _id?: ObjectId
    name: string
    key: string // e.g., 'free', 'pro', 'business'

    // Monthly Configuration
    monthlyPrice: number
    monthlyCredits: number
    monthlyApiLimit: number // -1 for unlimited
    monthlyMaxApiKeys: number
    monthlyFeatures: string[]

    // Yearly Configuration
    yearlyEnabled: boolean
    yearlyPrice: number
    yearlyCredits: number
    yearlyApiLimit: number // -1 for unlimited
    yearlyMaxApiKeys: number
    yearlyFeatures: string[]

    isPopular?: boolean
    createdAt: Date
    updatedAt: Date
}

export async function createPlan(data: Omit<PlanDocument, "_id" | "createdAt" | "updatedAt">) {
    const db = await getDb()
    const plans = db.collection<PlanDocument>("plans")

    const result = await plans.insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    })

    return result.insertedId
}

export async function getPlans() {
    const db = await getDb()
    const plans = db.collection<PlanDocument>("plans")
    return plans.find({}).sort({ monthlyPrice: 1 }).toArray()
}

export async function getPlanById(id: string) {
    const db = await getDb()
    const plans = db.collection<PlanDocument>("plans")
    return plans.findOne({ _id: new ObjectId(id) })
}

export async function updatePlan(id: string, data: Partial<PlanDocument>) {
    const db = await getDb()
    const plans = db.collection<PlanDocument>("plans")

    const { _id, ...updateData } = data
    const result = await plans.updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...updateData, updatedAt: new Date() } }
    )

    return result.modifiedCount > 0
}

export async function deletePlan(id: string) {
    const db = await getDb()
    const plans = db.collection<PlanDocument>("plans")
    const result = await plans.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
}
