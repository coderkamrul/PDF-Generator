"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Upload, X, ImageIcon, GripVertical, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageFile {
  id: string
  file: File
  preview: string
  base64: string // Add base64 data for server upload
}

interface ImageDropzoneProps {
  images: ImageFile[]
  setImages: (images: ImageFile[]) => void
  maxFiles?: number
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result)
      } else {
        reject(new Error("Failed to read file"))
      }
    }
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function ImageDropzone({ images, setImages, maxFiles = 50 }: ImageDropzoneProps) {
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true)
      setError(null)

      try {
        const newImages: ImageFile[] = await Promise.all(
          acceptedFiles.map(async (file) => {
            const base64 = await fileToBase64(file)
            return {
              id: crypto.randomUUID(),
              file,
              preview: URL.createObjectURL(file),
              base64, // Store base64 for upload
            }
          }),
        )

        setImages([...images, ...newImages].slice(0, maxFiles))
      } catch (err) {
        console.error("Error processing images:", err)
        setError("Failed to process some images. Please try again.")
      } finally {
        setIsProcessing(false)
      }
    },
    [images, setImages, maxFiles],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "image/webp": [".webp"],
      "image/gif": [".gif"],
      "image/bmp": [".bmp"],
    },
    maxFiles: maxFiles - images.length,
    disabled: isProcessing,
  })

  const removeImage = (id: string) => {
    const removed = images.find((img) => img.id === id)
    if (removed) {
      URL.revokeObjectURL(removed.preview)
    }
    setImages(images.filter((img) => img.id !== id))
  }

  const handleDragStart = (id: string) => {
    setDraggedId(id)
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedId || draggedId === targetId) return

    const draggedIndex = images.findIndex((img) => img.id === draggedId)
    const targetIndex = images.findIndex((img) => img.id === targetId)

    if (draggedIndex === -1 || targetIndex === -1) return

    const newImages = [...images]
    const [removed] = newImages.splice(draggedIndex, 1)
    newImages.splice(targetIndex, 0, removed)
    setImages(newImages)
  }

  const handleDragEnd = () => {
    setDraggedId(null)
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div
        {...getRootProps()}
        className={cn(
          "cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
          isProcessing && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-sm font-medium text-foreground">
          {isProcessing ? "Processing images..." : isDragActive ? "Drop images here" : "Drag & drop images here"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">or click to select files (JPG, PNG, WebP, GIF, BMP)</p>
        <p className="mt-2 text-xs text-muted-foreground">
          {images.length}/{maxFiles} images
        </p>
      </div>

      {images.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">
              {images.length} image{images.length !== 1 ? "s" : ""} selected
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                images.forEach((img) => URL.revokeObjectURL(img.preview))
                setImages([])
              }}
            >
              Clear all
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(image.id)}
                onDragOver={(e) => handleDragOver(e, image.id)}
                onDragEnd={handleDragEnd}
                className={cn(
                  "group relative aspect-square cursor-move overflow-hidden rounded-lg border border-border bg-secondary transition-all",
                  draggedId === image.id && "opacity-50",
                )}
              >
                <img
                  src={image.preview || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-background/60 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="absolute left-2 top-2">
                    <GripVertical className="h-4 w-4 text-foreground" />
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <span className="rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium">{index + 1}</span>
                  </div>
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-1 text-destructive-foreground"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Drag images to reorder. Images will appear in this order in the PDF.
          </p>
        </div>
      )}

      {images.length === 0 && (
        <div className="rounded-xl border border-border bg-card p-6 text-center">
          <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-2 text-sm text-muted-foreground">No images selected yet</p>
        </div>
      )}
    </div>
  )
}
