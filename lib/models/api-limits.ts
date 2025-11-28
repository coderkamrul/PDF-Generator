import { getDb } from "../mongodb"
import { ObjectId } from "mongodb"

export interface ApiLimits {
    free: number
    pro: number
    business: number | null // null = unlimited
}

export interface KeyLimits {
    free: number
    pro: number
    business: number
}

// Default API limits per plan (requests per day)
export const DEFAULT_API_LIMITS: ApiLimits = {
    free: 10,
    pro: 500,
    business: null, // unlimited
}

// Default Max API Keys per plan
export const DEFAULT_KEY_LIMITS: KeyLimits = {
    free: 1,
    pro: 5,
    business: 20,
}

/**
 * Get the API limit for a user based on their plan and custom limit
 */
export async function getUserApiLimit(userId: string): Promise<number | null> {
    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) } as any)

    if (!user) return 0

    // Custom limit overrides plan limit
    if (user.apiLimit !== undefined && user.apiLimit !== null) {
        return user.apiLimit
    }

    // Return plan-based limit
    const plan = user.plan || "free"
    return DEFAULT_API_LIMITS[plan as keyof ApiLimits] || DEFAULT_API_LIMITS.free
}

/**
 * Get the Max API Keys limit for a user
 */
export async function getUserKeyLimit(userId: string): Promise<number> {
    const db = await getDb()
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) } as any)

    if (!user) return 1

    // Custom limit overrides plan limit
    if (user.maxApiKeys !== undefined && user.maxApiKeys !== null) {
        return user.maxApiKeys
    }

    // Return plan-based limit
    const plan = user.plan || "free"
    return DEFAULT_KEY_LIMITS[plan as keyof KeyLimits] || DEFAULT_KEY_LIMITS.free
}

/**
 * Check if user has exceeded their API limit
 */
export async function checkApiLimit(userId: string): Promise<{ allowed: boolean; remaining: number }> {
    const limit = await getUserApiLimit(userId)

    // Unlimited access
    if (limit === null) {
        return { allowed: true, remaining: -1 }
    }

    const usage = await getApiUsageToday(userId)
    const remaining = Math.max(0, limit - usage)

    return {
        allowed: usage < limit,
        remaining,
    }
}

/**
 * Check if user can create more API keys
 */
export async function canCreateApiKey(userId: string): Promise<boolean> {
    const limit = await getUserKeyLimit(userId)
    const db = await getDb()

    const count = await db.collection("api_keys").countDocuments({ userId })

    return count < limit
}

/**
 * Get API usage count for today
 */
export async function getApiUsageToday(userId: string): Promise<number> {
    const db = await getDb()
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const count = await db.collection("usage-logs").countDocuments({
        userId,
        type: "api",
        createdAt: { $gte: today },
    })

    return count
}

/**
 * Increment API usage counter
 */
export async function incrementApiUsage(userId: string, apiKeyId: string): Promise<void> {
    const db = await getDb()

    await db.collection("usage-logs").insertOne({
        userId,
        apiKeyId,
        type: "api",
        createdAt: new Date(),
    })
}

/**
 * Set custom API limit for a user (admin only)
 */
export async function setUserApiLimit(userId: string, limit: number | null): Promise<boolean> {
    const db = await getDb()

    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { apiLimit: limit } }
    )

    return result.modifiedCount > 0
}

/**
 * Set custom Max API Keys limit for a user (admin only)
 */
export async function setUserKeyLimit(userId: string, limit: number | null): Promise<boolean> {
    const db = await getDb()

    const result = await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $set: { maxApiKeys: limit } }
    )

    return result.modifiedCount > 0
}
