// "use client"

// import { useState } from "react"
// import { useAuth } from "@/lib/auth-context"
// import { DashboardHeader } from "@/components/dashboard-header"
// import { ImageDropzone } from "@/components/image-dropzone"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Progress } from "@/components/ui/progress"
// import { FileText, Download, Loader2, Check, AlertCircle } from "lucide-react"
// import { mutate } from "swr"

// interface ImageFile {
//   id: string
//   file: File
//   preview: string
//   base64: string
// }

// type PageSize = "a4" | "letter" | "legal"
// type Orientation = "portrait" | "landscape"
// type Fit = "fit" | "fill"

// export default function ConvertPage() {
//   const { user, refreshUser } = useAuth()

//   const [images, setImages] = useState<ImageFile[]>([])
//   const [filename, setFilename] = useState("converted-images")
//   const [pageSize, setPageSize] = useState<PageSize>("a4")
//   const [orientation, setOrientation] = useState<Orientation>("portrait")
//   const [fit, setFit] = useState<Fit>("fit")
//   const [isConverting, setIsConverting] = useState(false)
//   const [progress, setProgress] = useState(0)
//   const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
//   const [pdfFilename, setPdfFilename] = useState<string>("")
//   const [error, setError] = useState<string | null>(null)

//   const handleConvert = async () => {
//     if (images.length === 0 || !user) return

//     setIsConverting(true)
//     setProgress(0)
//     setDownloadUrl(null)
//     setError(null)

//     try {
//       setProgress(20)

//       const imageDataUrls = images.map((img) => img.base64)

//       setProgress(40)

//       const res = await fetch("/api/convert", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           images: imageDataUrls,
//           options: {
//             pageSize,
//             orientation,
//             fitMode: fit,
//             filename: `${filename}.pdf`,
//           },
//         }),
//       })

//       setProgress(70)

//       const data = await res.json()

//       if (!res.ok) {
//         throw new Error(data.error || "Conversion failed")
//       }

//       setDownloadUrl(data.downloadUrl)
//       setPdfFilename(data.filename)
//       setProgress(100)

//       // Refresh user credits and file list
//       refreshUser()
//       mutate("/api/files")
//     } catch (err) {
//       console.error("Conversion error:", err)
//       setError(err instanceof Error ? err.message : "Conversion failed")
//     } finally {
//       setIsConverting(false)
//     }
//   }

//   const handleReset = () => {
//     // Cleanup object URLs for previews only
//     images.forEach((img) => URL.revokeObjectURL(img.preview))

//     setImages([])
//     setFilename("converted-images")
//     setProgress(0)
//     setDownloadUrl(null)
//     setPdfFilename("")
//     setError(null)
//   }

//   const handleDownload = () => {
//     if (!downloadUrl) return

//     // Open Cloudinary URL in new tab for download
//     const link = document.createElement("a")
//     link.href = downloadUrl
//     link.download = pdfFilename || `${filename}.pdf`
//     link.target = "_blank"
//     link.rel = "noopener noreferrer"
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   return (
//     <div>
//       <DashboardHeader
//         title="Convert Images to PDF"
//         description="Upload images and merge them into a single PDF document"
//       />

//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2">
//           <ImageDropzone images={images} setImages={setImages} maxFiles={user?.plan === "free" ? 5 : 50} />
//         </div>

//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>PDF Settings</CardTitle>
//               <CardDescription>Configure your output PDF</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="filename">File Name</Label>
//                 <Input
//                   id="filename"
//                   value={filename}
//                   onChange={(e) => setFilename(e.target.value)}
//                   placeholder="my-document"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label>Page Size</Label>
//                 <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="a4">A4 (210 x 297 mm)</SelectItem>
//                     <SelectItem value="letter">Letter (8.5 x 11 in)</SelectItem>
//                     <SelectItem value="legal">Legal (8.5 x 14 in)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Orientation</Label>
//                 <Select value={orientation} onValueChange={(v) => setOrientation(v as Orientation)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="portrait">Portrait</SelectItem>
//                     <SelectItem value="landscape">Landscape</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label>Image Fit</Label>
//                 <Select value={fit} onValueChange={(v) => setFit(v as Fit)}>
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="fit">Fit (with margins)</SelectItem>
//                     <SelectItem value="fill">Fill (cover page)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="pt-6">
//               {isConverting ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3">
//                     <Loader2 className="h-5 w-5 animate-spin text-primary" />
//                     <span className="text-sm font-medium">Converting...</span>
//                   </div>
//                   <Progress value={progress} />
//                   <p className="text-xs text-muted-foreground">
//                     {progress < 40
//                       ? "Preparing images..."
//                       : progress < 70
//                         ? "Generating PDF..."
//                         : "Uploading to cloud..."}
//                   </p>
//                 </div>
//               ) : downloadUrl ? (
//                 <div className="space-y-4">
//                   <div className="flex items-center gap-3 text-primary">
//                     <Check className="h-5 w-5" />
//                     <span className="text-sm font-medium">PDF created successfully!</span>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button onClick={handleDownload} className="flex-1">
//                       <Download className="mr-2 h-4 w-4" />
//                       Download PDF
//                     </Button>
//                     <Button variant="outline" onClick={handleReset}>
//                       New
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     Your PDF has been saved to the cloud. You can also download it from the Files page.
//                   </p>
//                 </div>
//               ) : (
//                 <>
//                   {error && (
//                     <div className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
//                       <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
//                       <span>{error}</span>
//                     </div>
//                   )}
//                   <Button
//                     className="w-full"
//                     size="lg"
//                     onClick={handleConvert}
//                     disabled={images.length === 0 || (user?.credits || 0) <= 0}
//                   >
//                     <FileText className="mr-2 h-4 w-4" />
//                     Convert to PDF ({images.length} image{images.length !== 1 ? "s" : ""})
//                   </Button>
//                 </>
//               )}

//               <div className="mt-4 rounded-lg bg-secondary/50 p-3">
//                 <p className="text-xs text-muted-foreground">
//                   <span className="font-medium text-foreground">Credits:</span> {user?.credits || 0} remaining
//                   {user?.plan === "free" && " (max 5 images per PDF)"}
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }


"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { DashboardHeader } from "@/components/dashboard-header"
import { ImageDropzone } from "@/components/image-dropzone"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { FileText, Download, Loader2, Check, AlertCircle } from "lucide-react"
import { mutate } from "swr"

interface ImageFile {
  id: string
  file: File
  preview: string
  base64: string
}

// UPDATED TYPE
type PageSize = "a4" | "letter" | "legal" | "square" | "twoThree"
type Orientation = "portrait" | "landscape"
type Fit = "fit" | "fill"

export default function ConvertPage() {
  const { user, refreshUser } = useAuth()

  const [images, setImages] = useState<ImageFile[]>([])
  const [filename, setFilename] = useState("converted-images")
  const [pageSize, setPageSize] = useState<PageSize>("a4")
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [fit, setFit] = useState<Fit>("fit")
  const [isConverting, setIsConverting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [pdfFilename, setPdfFilename] = useState<string>("")
  const [error, setError] = useState<string | null>(null)

  const handleConvert = async () => {
    if (images.length === 0 || !user) return

    setIsConverting(true)
    setProgress(0)
    setDownloadUrl(null)
    setError(null)

    try {
      setProgress(20)

      const imageDataUrls = images.map((img) => img.base64)

      setProgress(40)

      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: imageDataUrls,
          options: {
            pageSize,
            orientation,
            fitMode: fit,
            filename: `${filename}.pdf`,
          },
        }),
      })

      setProgress(70)

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Conversion failed")
      }

      setDownloadUrl(data.downloadUrl)
      setPdfFilename(data.filename)
      setProgress(100)

      refreshUser()
      mutate("/api/files")
    } catch (err) {
      console.error("Conversion error:", err)
      setError(err instanceof Error ? err.message : "Conversion failed")
    } finally {
      setIsConverting(false)
    }
  }

  const handleReset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.preview))
    setImages([])
    setFilename("converted-images")
    setProgress(0)
    setDownloadUrl(null)
    setPdfFilename("")
    setError(null)
  }

  const handleDownload = () => {
    if (!downloadUrl) return

    const link = document.createElement("a")
    link.href = downloadUrl
    link.download = pdfFilename || `${filename}.pdf`
    link.target = "_blank"
    link.rel = "noopener noreferrer"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div>
      <DashboardHeader
        title="Convert Images to PDF"
        description="Upload images and merge them into a single PDF document"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ImageDropzone images={images} setImages={setImages} maxFiles={user?.plan === "free" ? 5 : 50} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PDF Settings</CardTitle>
              <CardDescription>Configure your output PDF</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">

              {/* FILE NAME */}
              <div className="space-y-2">
                <Label htmlFor="filename">File Name</Label>
                <Input
                  id="filename"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                />
              </div>

              {/* UPDATED PAGE SIZE SELECT */}
              <div className="space-y-2">
                <Label>Page Size</Label>
                <Select value={pageSize} onValueChange={(v) => setPageSize(v as PageSize)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4 (210 × 297 mm)</SelectItem>
                    <SelectItem value="letter">Letter (8.5 × 11 in)</SelectItem>
                    <SelectItem value="legal">Legal (8.5 × 14 in)</SelectItem>
                    <SelectItem value="square">Square (1:1)</SelectItem>
                    <SelectItem value="twoThree">2:3 (Portrait)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* ORIENTATION */}
              <div className="space-y-2">
                <Label>Orientation</Label>
                <Select value={orientation} onValueChange={(v) => setOrientation(v as Orientation)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="portrait">Portrait</SelectItem>
                    <SelectItem value="landscape">Landscape</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* IMAGE FIT */}
              <div className="space-y-2">
                <Label>Image Fit</Label>
                <Select value={fit} onValueChange={(v) => setFit(v as Fit)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fit">Fit (with margins)</SelectItem>
                    <SelectItem value="fill">Fill (cover page)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              {isConverting ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-sm font-medium">Converting...</span>
                  </div>
                  <Progress value={progress} />
                </div>
              ) : downloadUrl ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-primary">
                    <Check className="h-5 w-5" />
                    <span className="text-sm font-medium">PDF created successfully!</span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleDownload} className="flex-1">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </Button>
                    <Button variant="outline" onClick={handleReset}>
                      New
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="mb-4 flex items-start gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleConvert}
                    disabled={images.length === 0 || (user?.credits || 0) <= 0}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Convert to PDF ({images.length} image{images.length !== 1 ? "s" : ""})
                  </Button>
                </>
              )}

              <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Credits:</span> {user?.credits || 0} remaining
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
