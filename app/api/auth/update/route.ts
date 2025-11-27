import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { getDb } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import bcrypt from "bcryptjs"

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { name, currentPassword, newPassword } = await request.json()

    const db = await getDb()
    const users = db.collection("users")

    const updateData: Record<string, unknown> = { updatedAt: new Date() }

    if (name) {
      updateData.name = name
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Current password is required to change password" }, { status: 400 })
      }

      const user = await users.findOne({ _id: new ObjectId(session.userId) })
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })
      }

      updateData.password = await bcrypt.hash(newPassword, 12)
    }

    await users.updateOne({ _id: new ObjectId(session.userId) }, { $set: updateData })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
