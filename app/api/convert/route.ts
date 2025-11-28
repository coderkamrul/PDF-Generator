// import { type NextRequest, NextResponse } from "next/server"
// import { getSession } from "@/lib/jwt"
// import { verifyApiKey } from "@/lib/models/api-key"
// import { getUserById, updateUserCredits } from "@/lib/models/user"
// import { createUsageLog } from "@/lib/models/usage-log"
// import { createFile } from "@/lib/models/file"
// import { uploadPdfToCloudinary } from "@/lib/cloudinary"
// import { jsPDF } from "jspdf"
// import sharp from "sharp"
// import { Buffer } from "buffer"

// export async function POST(request: NextRequest) {
//   try {
//     const ip = request.headers.get("x-forwarded-for") || "unknown"
//     let userId: string
//     let apiKeyId: string | undefined
//     let isApiRequest = false

//     const authHeader = request.headers.get("authorization")
//     if (authHeader?.startsWith("Bearer ")) {
//       const apiKey = authHeader.slice(7)
//       const keyData = await verifyApiKey(apiKey)
//       if (!keyData)
//         return NextResponse.json({ error: "Invalid API key" }, { status: 401 })

//       userId = keyData.userId
//       apiKeyId = keyData.keyId
//       isApiRequest = true
//     } else {
//       const session = await getSession()
//       if (!session)
//         return NextResponse.json({ error: "Authentication required" }, { status: 401 })
//       userId = session.userId
//     }

//     const user = await getUserById(userId)
//     if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
//     if (user.credits <= 0)
//       return NextResponse.json({ error: "Insufficient credits" }, { status: 403 })

//     const body = await request.json()
//     const images: string[] = body.images || []
//     const options = body.options

//     if (!images.length)
//       return NextResponse.json({ error: "No images provided" }, { status: 400 })

//     // PAGE SIZES
//     const pageSizes: Record<string, { width: number; height: number }> = {
//       a4: { width: 210, height: 297 },
//       letter: { width: 215.9, height: 279.4 },
//       legal: { width: 215.9, height: 355.6 },
//       square: { width: 200, height: 200 },
//       twoThree: { width: 200, height: 300 },
//     }

//     const basePage = pageSizes[options.pageSize] || pageSizes["a4"]

//     const isLandscape = options.orientation === "landscape"
//     const pdfWidth = isLandscape ? basePage.height : basePage.width
//     const pdfHeight = isLandscape ? basePage.width : basePage.height

//     const pdf = new jsPDF({
//       orientation: options.orientation,
//       unit: "mm",
//       format: [pdfWidth, pdfHeight],
//     })

//     for (let i = 0; i < images.length; i++) {
//       if (i > 0)
//         pdf.addPage([pdfWidth, pdfHeight], options.orientation)

//       const base64 = images[i]
//       const imgBuffer = Buffer.from(base64.split(",")[1], "base64")

//       // Extract size using SHARP
//       const meta = await sharp(imgBuffer).metadata()
//       const imgWidth = meta.width || 1000
//       const imgHeight = meta.height || 1000
//       const imgRatio = imgWidth / imgHeight
//       const pageRatio = pdfWidth / pdfHeight

//       let finalW = pdfWidth
//       let finalH = pdfHeight
//       let x = 0
//       let y = 0

//       if (options.fitMode === "fit") {
//         if (imgRatio > pageRatio) {
//           finalW = pdfWidth
//           finalH = pdfWidth / imgRatio
//         } else {
//           finalH = pdfHeight
//           finalW = pdfHeight * imgRatio
//         }

//         x = (pdfWidth - finalW) / 2
//         y = (pdfHeight - finalH) / 2
//       }

//       pdf.addImage(base64, "JPEG", x, y, finalW, finalH)
//     }

//     // Make final PDF
//     const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

//     const cloudinaryResult = await uploadPdfToCloudinary(
//       pdfBuffer,
//       options.filename,
//       userId
//     )

//     await updateUserCredits(userId, user.credits - 1)
//     await createUsageLog(
//       userId,
//       "CONVERT",
//       `Converted ${images.length} images`,
//       ip,
//       apiKeyId
//     )

//     await createFile(
//       userId,
//       options.filename,
//       pdfBuffer.length,
//       images.length,
//       cloudinaryResult.secure_url,
//       cloudinaryResult.public_id,
//       isApiRequest
//     )

//     return NextResponse.json({
//       success: true,
//       downloadUrl: cloudinaryResult.secure_url,
//       filename: options.filename,
//     })
//   } catch (error: any) {
//     console.error("Convert Error:", error)
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     )
//   }
// }



import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/jwt"
import { verifyApiKey } from "@/lib/models/api-key"
import { getUserById, updateUserCredits } from "@/lib/models/user"
import { createUsageLog } from "@/lib/models/usage-log"
import { createFile } from "@/lib/models/file"
import { uploadPdfToCloudinary } from "@/lib/cloudinary"
import { jsPDF } from "jspdf"
import sharp from "sharp"
import { Buffer } from "buffer"

// NEW → URL to base64 helper
async function fetchImageAsBase64(url: string): Promise<string> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch image: ${url}`)

  const buffer = Buffer.from(await res.arrayBuffer())
  const mime = res.headers.get("content-type") || "image/jpeg"

  return `data:${mime};base64,${buffer.toString("base64")}`
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown"
    let userId: string
    let apiKeyId: string | undefined
    let isApiRequest = false

    const authHeader = request.headers.get("authorization")
    if (authHeader?.startsWith("Bearer ")) {
      const apiKey = authHeader.slice(7)
      const keyData = await verifyApiKey(apiKey)
      if (!keyData)
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 })

      userId = keyData.userId
      apiKeyId = keyData.keyId
      isApiRequest = true
    } else {
      const session = await getSession()
      if (!session)
        return NextResponse.json({ error: "Authentication required" }, { status: 401 })

      userId = session.userId
    }

    const user = await getUserById(userId)
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })
    if (user.credits <= 0)
      return NextResponse.json({ error: "Insufficient credits" }, { status: 403 })

    // Check API limits for API requests
    if (isApiRequest) {
      const { checkApiLimit, incrementApiUsage } = await import("@/lib/models/api-limits")
      const limitCheck = await checkApiLimit(userId)

      if (!limitCheck.allowed) {
        return NextResponse.json(
          {
            error: "API limit exceeded",
            message: "You have reached your daily API request limit. Please upgrade your plan or wait until tomorrow.",
            limit: limitCheck.remaining
          },
          { status: 429 }
        )
      }

      // Increment usage counter
      await incrementApiUsage(userId, apiKeyId!)
    }

    const body = await request.json()

    // images can be mix of base64 + URLs
    const rawImages: string[] = body.images || []
    const options = body.options

    if (!rawImages.length)
      return NextResponse.json({ error: "No images provided" }, { status: 400 })

    // FINAL → all images as base64
    let images: string[] = []

    for (const item of rawImages) {
      if (item.startsWith("http://") || item.startsWith("https://")) {
        const base64 = await fetchImageAsBase64(item)
        images.push(base64)
      } else {
        images.push(item) // already base64
      }
    }

    // PAGE SIZES
    const pageSizes: Record<string, { width: number; height: number }> = {
      a4: { width: 210, height: 297 },
      letter: { width: 215.9, height: 279.4 },
      legal: { width: 215.9, height: 355.6 },
      square: { width: 200, height: 200 },
      twoThree: { width: 200, height: 300 },
    }

    const basePage = pageSizes[options.pageSize] || pageSizes["a4"]

    const isLandscape = options.orientation === "landscape"
    const pdfWidth = isLandscape ? basePage.height : basePage.width
    const pdfHeight = isLandscape ? basePage.width : basePage.height

    const pdf = new jsPDF({
      orientation: options.orientation,
      unit: "mm",
      format: [pdfWidth, pdfHeight],
    })

    for (let i = 0; i < images.length; i++) {
      if (i > 0)
        pdf.addPage([pdfWidth, pdfHeight], options.orientation)

      const base64 = images[i]
      const imgBuffer = Buffer.from(base64.split(",")[1], "base64")

      // Extract size using SHARP
      const meta = await sharp(imgBuffer).metadata()
      const imgWidth = meta.width || 1000
      const imgHeight = meta.height || 1000
      const imgRatio = imgWidth / imgHeight
      const pageRatio = pdfWidth / pdfHeight

      let finalW = pdfWidth
      let finalH = pdfHeight
      let x = 0
      let y = 0

      if (options.fitMode === "fit") {
        if (imgRatio > pageRatio) {
          finalW = pdfWidth
          finalH = pdfWidth / imgRatio
        } else {
          finalH = pdfHeight
          finalW = pdfHeight * imgRatio
        }

        x = (pdfWidth - finalW) / 2
        y = (pdfHeight - finalH) / 2
      }

      pdf.addImage(base64, "JPEG", x, y, finalW, finalH)
    }

    // Make final PDF
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"))

    const cloudinaryResult = await uploadPdfToCloudinary(
      pdfBuffer,
      options.filename,
      userId
    )

    await updateUserCredits(userId, user.credits - 1)
    await createUsageLog(
      userId,
      "CONVERT",
      `Converted ${images.length} images`,
      ip,
      apiKeyId
    )

    await createFile(
      userId,
      options.filename,
      pdfBuffer.length,
      images.length,
      cloudinaryResult.secure_url,
      cloudinaryResult.public_id,
      isApiRequest
    )

    return NextResponse.json({
      success: true,
      downloadUrl: cloudinaryResult.secure_url,
      filename: options.filename,
    })
  } catch (error: any) {
    console.error("Convert Error:", error)
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    )
  }
}
