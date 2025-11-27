import { ObjectId } from "mongodb"
import { getDb } from "../mongodb"
import crypto from "crypto"

export interface ApiKeyDocument {
  _id?: ObjectId
  userId: string
  name: string
  key: string
  keyHash: string
  createdAt: Date
  lastUsed: Date | null
  usageCount: number
}

export interface SafeApiKey {
  id: string
  userId: string
  name: string
  key: string
  createdAt: string
  lastUsed: string | null
  usageCount: number
}

function generateApiKey(): string {
  return "pf_" + crypto.randomBytes(24).toString("hex")
}

function hashKey(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex")
}

export async function createApiKey(userId: string, name: string): Promise<SafeApiKey> {
  const db = await getDb()
  const apiKeys = db.collection<ApiKeyDocument>("apiKeys")

  const key = generateApiKey()
  const keyHash = hashKey(key)

  const result = await apiKeys.insertOne({
    userId,
    name,
    key: key, // Store masked version
    keyHash,
    createdAt: new Date(),
    lastUsed: null,
    usageCount: 0,
  })

  // Return full key only on creation
  return {
    id: result.insertedId.toString(),
    userId,
    name,
    key, // Full key returned only once
    createdAt: new Date().toISOString(),
    lastUsed: null,
    usageCount: 0,
  }
}

export async function getApiKeysByUserId(userId: string): Promise<SafeApiKey[]> {
  const db = await getDb()
  const apiKeys = db.collection<ApiKeyDocument>("apiKeys")

  const keys = await apiKeys.find({ userId }).toArray()
  return keys.map((k) => ({
    id: k._id!.toString(),
    userId: k.userId,
    name: k.name,
    key: k.key, // Masked version
    createdAt: k.createdAt.toISOString(),
    lastUsed: k.lastUsed?.toISOString() || null,
    usageCount: k.usageCount,
  }))
}

export async function verifyApiKey(key: string): Promise<{ userId: string; keyId: string } | null> {
  const db = await getDb()
  const apiKeys = db.collection<ApiKeyDocument>("apiKeys")

  const keyHash = hashKey(key)
  const apiKey = await apiKeys.findOne({ keyHash })

  if (!apiKey) return null

  // Update last used
  await apiKeys.updateOne({ _id: apiKey._id }, { $set: { lastUsed: new Date() }, $inc: { usageCount: 1 } })

  return { userId: apiKey.userId, keyId: apiKey._id!.toString() }
}

export async function deleteApiKey(id: string): Promise<boolean> {
  const db = await getDb()
  const apiKeys = db.collection<ApiKeyDocument>("apiKeys")

  const result = await apiKeys.deleteOne({ _id: new ObjectId(id) })
  return result.deletedCount > 0
}

export async function getAllApiKeys(): Promise<SafeApiKey[]> {
  const db = await getDb()
  const apiKeys = db.collection<ApiKeyDocument>("apiKeys")

  const keys = await apiKeys.find({}).toArray()
  return keys.map((k) => ({
    id: k._id!.toString(),
    userId: k.userId,
    name: k.name,
    key: k.key,
    createdAt: k.createdAt.toISOString(),
    lastUsed: k.lastUsed?.toISOString() || null,
    usageCount: k.usageCount,
  }))
}
