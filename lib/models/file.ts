import { ObjectId } from "mongodb"
import { getDb } from "../mongodb"
import { deleteFromCloudinary } from "../cloudinary"

export interface FileDocument {
  _id?: ObjectId
  userId: string
  filename: string
  size: number
  pages: number
  apiGenerated: boolean
  cloudinaryUrl: string
  cloudinaryPublicId: string
  createdAt: Date
}

export interface SafeFile {
  id: string
  userId: string
  filename: string
  size: string
  pages: number
  apiGenerated: boolean
  downloadUrl: string
  cloudinaryPublicId: string
  createdAt: string
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B"
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
  return (bytes / (1024 * 1024)).toFixed(1) + " MB"
}

export async function createFile(
  userId: string,
  filename: string,
  size: number,
  pages: number,
  cloudinaryUrl: string,
  cloudinaryPublicId: string,
  apiGenerated = false,
): Promise<SafeFile> {
  const db = await getDb()
  const files = db.collection<FileDocument>("files")

  const result = await files.insertOne({
    userId,
    filename,
    size,
    pages,
    apiGenerated,
    cloudinaryUrl,
    cloudinaryPublicId,
    createdAt: new Date(),
  })

  return {
    id: result.insertedId.toString(),
    userId,
    filename,
    size: formatFileSize(size),
    pages,
    apiGenerated,
    downloadUrl: cloudinaryUrl,
    cloudinaryPublicId,
    createdAt: new Date().toISOString(),
  }
}

export async function getFilesByUserId(userId: string): Promise<SafeFile[]> {
  const db = await getDb()
  const files = db.collection<FileDocument>("files")

  const userFiles = await files.find({ userId }).sort({ createdAt: -1 }).toArray()
  return userFiles.map((file) => ({
    id: file._id!.toString(),
    userId: file.userId,
    filename: file.filename,
    size: formatFileSize(file.size),
    pages: file.pages,
    apiGenerated: file.apiGenerated,
    downloadUrl: file.cloudinaryUrl,
    cloudinaryPublicId: file.cloudinaryPublicId,
    createdAt: file.createdAt.toISOString(),
  }))
}

export async function getFileById(id: string): Promise<SafeFile | null> {
  const db = await getDb()
  const files = db.collection<FileDocument>("files")

  try {
    const file = await files.findOne({ _id: new ObjectId(id) })
    if (!file) return null

    return {
      id: file._id!.toString(),
      userId: file.userId,
      filename: file.filename,
      size: formatFileSize(file.size),
      pages: file.pages,
      apiGenerated: file.apiGenerated,
      downloadUrl: file.cloudinaryUrl,
      cloudinaryPublicId: file.cloudinaryPublicId,
      createdAt: file.createdAt.toISOString(),
    }
  } catch {
    return null
  }
}

export async function deleteFile(id: string): Promise<boolean> {
  const db = await getDb()
  const files = db.collection<FileDocument>("files")

  try {
    const file = await files.findOne({ _id: new ObjectId(id) })
    if (file?.cloudinaryPublicId) {
      await deleteFromCloudinary(file.cloudinaryPublicId, "raw")
    }

    const result = await files.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount > 0
  } catch {
    return false
  }
}

export async function getAllFiles(): Promise<SafeFile[]> {
  const db = await getDb()
  const files = db.collection<FileDocument>("files")

  const allFiles = await files.find({}).sort({ createdAt: -1 }).toArray()
  return allFiles.map((file) => ({
    id: file._id!.toString(),
    userId: file.userId,
    filename: file.filename,
    size: formatFileSize(file.size),
    pages: file.pages,
    apiGenerated: file.apiGenerated,
    downloadUrl: file.cloudinaryUrl,
    cloudinaryPublicId: file.cloudinaryPublicId,
    createdAt: file.createdAt.toISOString(),
  }))
}

export async function getFileStats(): Promise<{ total: number; apiGenerated: number; totalSize: number }> {
  const db = await getDb()
  const files = db.collection<FileDocument>("files")

  const allFiles = await files.find({}).toArray()
  const apiGenerated = allFiles.filter((f) => f.apiGenerated).length
  const totalSize = allFiles.reduce((acc, f) => acc + f.size, 0)

  return { total: allFiles.length, apiGenerated, totalSize }
}
