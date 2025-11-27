import { ObjectId } from "mongodb"
import { getDb } from "../mongodb"
import bcrypt from "bcryptjs"

export interface UserDocument {
  _id?: ObjectId
  email: string
  password: string
  name: string
  plan: "free" | "pro" | "business"
  credits: number
  isAdmin: boolean
  isDisabled: boolean
  createdAt: Date
  updatedAt: Date
}

export interface SafeUser {
  id: string
  email: string
  name: string
  plan: "free" | "pro" | "business"
  credits: number
  isAdmin: boolean
  createdAt: string
}

export async function createUser(email: string, password: string, name: string): Promise<SafeUser | null> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const existingUser = await users.findOne({ email })
  if (existingUser) {
    return null
  }

  const hashedPassword = await bcrypt.hash(password, 12)
  const isAdmin = email === "admin@pdfforge.com"

  const result = await users.insertOne({
    email,
    password: hashedPassword,
    name,
    plan: "free",
    credits: 10,
    isAdmin,
    isDisabled: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  return {
    id: result.insertedId.toString(),
    email,
    name,
    plan: "free",
    credits: 10,
    isAdmin,
    createdAt: new Date().toISOString(),
  }
}

export async function verifyUser(email: string, password: string): Promise<SafeUser | null> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const user = await users.findOne({ email })
  if (!user) return null

  if (user.isDisabled) return null

  const isValid = await bcrypt.compare(password, user.password)
  if (!isValid) return null

  return {
    id: user._id!.toString(),
    email: user.email,
    name: user.name,
    plan: user.plan,
    credits: user.credits,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt.toISOString(),
  }
}

export async function getUserById(id: string): Promise<SafeUser | null> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  try {
    const user = await users.findOne({ _id: new ObjectId(id) })
    if (!user) return null

    return {
      id: user._id!.toString(),
      email: user.email,
      name: user.name,
      plan: user.plan,
      credits: user.credits,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt.toISOString(),
    }
  } catch {
    return null
  }
}

export async function updateUserCredits(id: string, credits: number): Promise<boolean> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { credits, updatedAt: new Date() } })
  return result.modifiedCount > 0
}

export async function updateUserPlan(id: string, plan: "free" | "pro" | "business"): Promise<boolean> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const planCredits = { free: 10, pro: 100, business: 1000 }

  const result = await users.updateOne(
    { _id: new ObjectId(id) },
    { $set: { plan, credits: planCredits[plan], updatedAt: new Date() } },
  )
  return result.modifiedCount > 0
}

export async function getAllUsers(): Promise<SafeUser[]> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const allUsers = await users.find({}).toArray()
  return allUsers.map((user) => ({
    id: user._id!.toString(),
    email: user.email,
    name: user.name,
    plan: user.plan,
    credits: user.credits,
    isAdmin: user.isAdmin,
    createdAt: user.createdAt.toISOString(),
  }))
}

export async function toggleUserDisabled(id: string, isDisabled: boolean): Promise<boolean> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const result = await users.updateOne({ _id: new ObjectId(id) }, { $set: { isDisabled, updatedAt: new Date() } })
  return result.modifiedCount > 0
}

export async function addCreditsToUser(id: string, amount: number): Promise<boolean> {
  const db = await getDb()
  const users = db.collection<UserDocument>("users")

  const result = await users.updateOne(
    { _id: new ObjectId(id) },
    { $inc: { credits: amount }, $set: { updatedAt: new Date() } },
  )
  return result.modifiedCount > 0
}
