import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  format: string
  bytes: number
  width?: number
  height?: number
}

export async function uploadPdfToCloudinary(
  pdfBuffer: Buffer,
  filename: string,
  userId: string,
): Promise<CloudinaryUploadResult> {
  const base64Pdf = pdfBuffer.toString("base64")
  const dataUri = `data:application/pdf;base64,${base64Pdf}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `pdfforge/${userId}/pdfs`,
    public_id: `${Date.now()}-${filename.replace(/\.pdf$/i, "")}`,
    resource_type: "raw",
    format: "pdf",
  })

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    format: result.format,
    bytes: result.bytes,
  }
}

export async function uploadImageToCloudinary(
  base64Image: string,
  userId: string,
  index: number,
): Promise<CloudinaryUploadResult> {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: `pdfforge/${userId}/images`,
    public_id: `img-${Date.now()}-${index}`,
    resource_type: "image",
  })

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    format: result.format,
    bytes: result.bytes,
    width: result.width,
    height: result.height,
  }
}

export async function deleteFromCloudinary(publicId: string, resourceType: "image" | "raw" = "raw"): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType })
    return true
  } catch (error) {
    console.error("Cloudinary delete error:", error)
    return false
  }
}

export function getOptimizedImageUrl(publicId: string, width: number, height: number): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: "fit",
    quality: "auto",
    fetch_format: "auto",
  })
}

export default cloudinary
