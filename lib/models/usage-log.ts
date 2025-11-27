import type { ObjectId } from "mongodb"
import { getDb } from "../mongodb"

export interface UsageLogDocument {
  _id?: ObjectId
  userId: string
  action: string
  details: string
  ipAddress: string
  apiKeyId?: string
  createdAt: Date
}

export interface SafeUsageLog {
  id: string
  userId: string
  action: string
  details: string
  ipAddress: string
  apiKeyId?: string
  createdAt: string
}

export async function createUsageLog(
  userId: string,
  action: string,
  details: string,
  ipAddress: string,
  apiKeyId?: string,
): Promise<SafeUsageLog> {
  const db = await getDb()
  const logs = db.collection<UsageLogDocument>("usageLogs")

  const result = await logs.insertOne({
    userId,
    action,
    details,
    ipAddress,
    apiKeyId,
    createdAt: new Date(),
  })

  return {
    id: result.insertedId.toString(),
    userId,
    action,
    details,
    ipAddress,
    apiKeyId,
    createdAt: new Date().toISOString(),
  }
}

export async function getUsageLogs(limit = 100): Promise<SafeUsageLog[]> {
  const db = await getDb()
  const logs = db.collection<UsageLogDocument>("usageLogs")

  const allLogs = await logs.find({}).sort({ createdAt: -1 }).limit(limit).toArray()
  return allLogs.map((log) => ({
    id: log._id!.toString(),
    userId: log.userId,
    action: log.action,
    details: log.details,
    ipAddress: log.ipAddress,
    apiKeyId: log.apiKeyId,
    createdAt: log.createdAt.toISOString(),
  }))
}

export async function getUserUsageLogs(userId: string, limit = 50): Promise<SafeUsageLog[]> {
  const db = await getDb()
  const logs = db.collection<UsageLogDocument>("usageLogs")

  const userLogs = await logs.find({ userId }).sort({ createdAt: -1 }).limit(limit).toArray()
  return userLogs.map((log) => ({
    id: log._id!.toString(),
    userId: log.userId,
    action: log.action,
    details: log.details,
    ipAddress: log.ipAddress,
    apiKeyId: log.apiKeyId,
    createdAt: log.createdAt.toISOString(),
  }))
}
